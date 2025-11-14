import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Title, Detail, TextInput, Button } from "@krds-ui/core";
import CategoryChips from "./components/CategoryChips";
import FilterPanel from "./components/FilterPanel";
import ForumCard from "./components/ForumCard";
import mockItemsRaw from "./mockItems";
import { CreateRoomDialog } from './components/CreateRoomDialog';
import { GroupChatRoom } from '../../components/GroupChatRoom';
import { DiscussionRoomCard } from '../../components/DiscussionRoomCard';
import { discussionRoomAPI } from '../../services/api';
import { DiscussionRoom } from '../../types/discussion';


//타입 선언하기
type Category = "환경" | "교통" | "안전" | "문화" | "경제" | "복지";
type Region =
  | "부천시" | "수원시" | "성남시" | "안양시" | "용인시"
  | "광명시" | "과천시" | "평택시" | "광주시" | "남양주시";
type Status = "토론중" | "제안채택/종결";
type SortKey = "latest" | "popular" | "comments";

type ForumItem = {
  id: string;
  title: string;
  summary: string;
  category: Category[];
  region: Region;
  status: Status;
  tags?: string[];
  participants: number;
  comments: number;
  date: string; // yyyy-mm-dd
};

/* 상수 배열 리터널, 목 데이터ㅗ 가져오기*/
const CATEGORIES: Category[] = ["환경", "교통", "안전", "문화", "경제", "복지"];
const REGIONS: Region[] = [
  "부천시","수원시","성남시","안양시","용인시",
  "광명시","과천시","평택시","광주시","남양주시",
];
const STATUSES: Status[] = ["토론중", "제안채택/종결"];
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "popular", label: "참여순" },
  { value: "comments", label: "댓글순" },
];

// const mockItems = mockItemsRaw as unknown as ForumItem[];


/* 검색어 상태, 정렬 기준, 선택된 필터들 */
export default function SolutionForumPage() {

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false); // 다이어그램 오픈 상태관리

  // 탭 상태 추가
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  // API 데이터 상태
  const [apiRooms, setApiRooms] = useState<DiscussionRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // GroupChatRoom 모달 상태
  const [selectedRoom, setSelectedRoom] = useState<DiscussionRoom | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("latest");
  const [selected, setSelected] = useState<{
    categories: Set<Category>;
    regions: Set<Region>;
    statuses: Set<Status>;
  }>({
    categories: new Set(),
    regions: new Set(),
    statuses: new Set(),
  });

  //카테고리 토글
  const toggleCategory = (cat: Category) => {
    setSelected((prev) => {
      const categories = new Set(prev.categories);
      categories.has(cat) ? categories.delete(cat) : categories.add(cat);
      return { ...prev, categories };
    });
  };
  //왼쪽 지역, 상태 관련 핸들러
  const toggle = (type: "region" | "status", value: Region | Status) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (type === "region") {
        const s = new Set(prev.regions);
        s.has(value as Region) ? s.delete(value as Region) : s.add(value as Region);
        next.regions = s;
      } else {
        const s = new Set(prev.statuses);
        s.has(value as Status) ? s.delete(value as Status) : s.add(value as Status);
        next.statuses = s;
      }
      return next;
    });
  };

  //모든 토글 초기화
  const resetFilters = () =>
    setSelected({ categories: new Set(), regions: new Set(), statuses: new Set() });

  // API 데이터 로드
  const loadRooms = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = activeTab === 'all'
        ? await discussionRoomAPI.getAllRooms()
        : await discussionRoomAPI.getMyRooms();

      if (response.code === 'SUCCESS' && response.data?.content) {
        setApiRooms(response.data.content);
      } else {
        setApiRooms([]);
      }
    } catch (error) {
      console.error('Failed to load rooms:', error);
      setApiRooms([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  // 탭 변경 또는 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  // 논의방 카드 클릭 핸들러
  const handleRoomClick = (room: DiscussionRoom) => {
    setSelectedRoom(room);
    setIsChatModalOpen(true);
  };

  // 채팅방 닫기 핸들러
  const handleCloseChatModal = () => {
    setIsChatModalOpen(false);
    setSelectedRoom(null);
    loadRooms(); // 목록 새로고침
  };

  // 검색, 필터, 정렬 관련 처리 함수 (API 데이터 사용)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let arr = apiRooms.filter((room) => {
      //검색어 히트 조건들
      const hitQ =
        !q ||
        room.title.toLowerCase().includes(q) ||
        room.description?.toLowerCase().includes(q) ||
        room.region.toLowerCase().includes(q);

      //지역 필터 (API의 region은 'BUCHEON' 같은 형식)
      const hitRegion = selected.regions.size
        ? Array.from(selected.regions).some(r => room.region.includes(r.replace('시', '').toUpperCase()))
        : true;

      return hitQ && hitRegion;
    });

    // 정렬
    arr = arr.sort((a, b) => {
      if (sort === "popular") return b.participantCount - a.participantCount;
      // latest는 roomId로 대체 (나중에 createdAt 추가되면 변경)
      return b.roomId - a.roomId;
    });

    return arr;
  }, [query, sort, selected, apiRooms]);

  const handleCreateForum = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateSuccess = () => {
    console.log('Room created successfully');
    loadRooms(); // 목록 새로고침
  };


  // 채팅방이 열려있으면 채팅방만 렌더링
  if (isChatModalOpen) {
    return (
      <GroupChatRoom
        selectedRoom={selectedRoom}
        isModalOpen={isChatModalOpen}
        onClose={handleCloseChatModal}
      />
    );
  }

  // 기본 리스트 화면
  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8">
      <header className="mb-6">
        <Title size="l">솔루션 토의실</Title>
        <Detail>
          지역 문제를 함께 논의하고 해결책을 만들어가는 공간입니다. 관심있는 토의실에
          참여하여 의견을 나누세요.
        </Detail>
      </header>

      {/* 탭 네비게이션 */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'all' ? 'primary' : 'secondary'}
          size="medium"
          onClick={() => setActiveTab('all')}
        >
          전체 논의방
        </Button>
        <Button
          variant={activeTab === 'my' ? 'primary' : 'secondary'}
          size="medium"
          onClick={() => setActiveTab('my')}
        >
          내가 참여한 논의방
        </Button>
      </div>

      {/* 🔧 3:7 고정 */}
      <div className="grid grid-cols-[30%_70%] gap-4 items-start">
        <aside className="self-start">
          <FilterPanel
            regions={REGIONS}
            statuses={STATUSES}
            selected={{
              regions: new Set<string>(selected.regions),
              statuses: new Set<string>(selected.statuses),
            }}
            onToggle={(type, v) => toggle(type, v as Region & Status)}
            onReset={resetFilters}
            onCreateForum={handleCreateForum}
          />
        </aside>

        <section className="min-w-0">
          <div className="mb-5 grid gap-3 items-center md:grid-cols-[1fr_auto_auto]">
            <div className="min-w-[260px]">
              <TextInput
                id="search"
                aria-label="검색어"
                placeholder="검색어를 입력하세요"
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setQuery(e.target.value)
                }
                length="full"
              />
            </div>

            <div className="justify-self-start md:justify-self-center">
              <CategoryChips
                categories={CATEGORIES}
                selected={new Set<string>(selected.categories)}
                onToggle={(c) => toggleCategory(c as Category)}
              />
            </div>

            <label className="text-sm text-gray-700 justify-self-end">
              <span className="mr-2">정렬</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="border border-gray-20 rounded-lg px-3 py-2"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* 로딩 상태 */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">논의방을 불러오는 중...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                {query ? '검색 결과가 없습니다.' : '현재 개설된 논의방이 없습니다.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {filtered.map((room) => (
                <DiscussionRoomCard
                  key={room.roomId}
                  room={room}
                  onClick={() => handleRoomClick(room)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <CreateRoomDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </main>
  );
}
