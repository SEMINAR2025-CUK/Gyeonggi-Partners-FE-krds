import React, { useMemo, useState } from "react";
import { Title, Detail, TextInput } from "@krds-ui/core";
import CategoryChips from "./components/CategoryChips";
import FilterPanel from "./components/FilterPanel";
import ForumCard from "./components/ForumCard";
import mockItemsRaw from "./mockItems"; 


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

const mockItems = mockItemsRaw as unknown as ForumItem[];


/* 검색어 상태, 정렬 기준, 선택된 필터들 */
export default function SolutionForumPage() {
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

  // 검색, 필터, 정렬 관련 처리 함수
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let arr = mockItems.filter((it) => {
      //검색어 히트 조건들
      const hitQ =
        !q ||
        it.title.toLowerCase().includes(q) ||
        it.summary.toLowerCase().includes(q) ||
        it.category.some((c) => c.toLowerCase().includes(q)) ||
        it.region.toLowerCase().includes(q);
        
      //다양한 필터 히트 조건
      const hitCat = selected.categories.size
        ? it.category.some((c) => selected.categories.has(c))
        : true;
      const hitRegion = selected.regions.size ? selected.regions.has(it.region) : true;
      const hitStatus = selected.statuses.size ? selected.statuses.has(it.status) : true;

      return hitQ && hitCat && hitRegion && hitStatus;
    });
  
    arr = arr.sort((a, b) => {
      //localeCompare(a.date);  날짜 최신순(문자열 yyyy-mm-dd라 OK) 다를 경우 수정 필요
      if (sort === "latest") return b.date.localeCompare(a.date);
      if (sort === "popular") return b.participants - a.participants;
      return b.comments - a.comments;
    });

    return arr;
  }, [query, sort, selected]);

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8">
      <header className="mb-6">
        <Title size="l">솔루션 토의실</Title>
        <Detail>
          지역 문제를 함께 논의하고 해결책을 만들어가는 공간입니다. 관심있는 토의실에
          참여하여 의견을 나누세요.
        </Detail>
      </header>

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

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <ForumCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
