import { Title, Detail, Button } from "@krds-ui/core";

type Props = {
  regions: string[];                          
  statuses: string[];                          
  selected: { regions: Set<string>; statuses: Set<string> };
  onToggle: (type: "region" | "status", value: string) => void; // 체크 클릭 시 부모에 토글 요청
  onReset: () => void;                             // 전체 선택 초기화
};

export default function FilterPanel({
  regions,
  statuses,
  selected,
  onToggle,
  onReset,
}: Props) {
  const Item = ({
    checked,
    label,
    onClick,
  }: {
    checked: boolean;   
    label: string;      // 표시 텍스트
    onClick: () => void;
  }) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onClick}
        className="h-4 w-4"
      />
      <Detail size="s">{label}</Detail>
    </label>
  );

  return (
    <aside className="bg-gray-0 border border-gray-20 rounded-xl p-4 h-max sticky top-4">
      <Title size="s">필터</Title>

      {/* 지역 그룹 */}
      <div className="mt-4">
        <Detail size="s" className="mb-2">지역</Detail>
        <div className="grid gap-2">
          {regions.map((r) => (
            <Item
              key={r}                                   
              checked={selected.regions.has(r)}         // 선택 여부는 Set에서 바로 체크
              label={r}
              onClick={() => onToggle("region", r)}     // 클릭시 부모로 토글 요청
            />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <Detail size="s" className="mb-2">상태</Detail>
        <div className="grid gap-2">
          {statuses.map((s) => (
            <Item
              key={s}
              checked={selected.statuses.has(s)}
              label={s}
              onClick={() => onToggle("status", s)}
            />
          ))}
        </div>
      </div>

      <Button className="mt-4 w-full" onClick={onReset}>
        필터 초기화
      </Button>
    </aside>
  );
}
