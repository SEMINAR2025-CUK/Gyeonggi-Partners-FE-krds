import { Title, Detail, Badge, Button } from "@krds-ui/core";

type ForumCardProps = {
  item: {
    id: string;
    title: string;
    summary: string;
    category: string[];
    region: string;
    status: string;
    tags?: string[];
    participants: number;
    comments: number;
    date: string;
  };
};

export default function ForumCard({ item }: ForumCardProps) {
  return (
    <div className="bg-gray-0 border border-gray-20 rounded-xl p-4 grid h-full
                    grid-rows-[auto_auto_auto_1fr_auto]">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {item.category.map((c) => <Badge key={c} label={c} />)}
        {item.tags?.map((t) => <Badge key={t} label={t} />)}
      </div>

      <Title size="m" className="mb-1">{item.title}</Title>


      <div className="mb-3">
        <Detail className="mb-3 line-clamp-2">{item.summary}</Detail>
        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          <span>👥 {item.participants.toLocaleString("ko-KR")}명 참여</span>
          <span>💬 {item.comments.toLocaleString("ko-KR")}개 댓글</span>
          <span>📍 {item.region}</span>
          <span>🗓 {item.date}</span>
        </div>
      </div>


      <div />

      <div className="pt-3 border-t border-gray-20 flex justify-between items-center">
        <Badge label={item.status} />
        <Button>토의실 참여하기</Button>
      </div>
    </div>
  );
}
