import { Detail } from "@krds-ui/core";

type Props = {
  categories: string[];           // 카테고리 목록 빈 배열로 받음
  selected: Set<string>;          // 선택된 카테고리들 Set을 이용해서 중복 방지 및 속도 빠름
  onToggle: (cat: string) => void; // 버튼 눌렀을 때 토글 부모 요소에게
};

export default function CategoryChips({ categories, selected, onToggle }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Detail size="s" className="whitespace-nowrap text-gray-80">
        카테고리
      </Detail>

      <div className="flex flex-wrap gap-6">
        {categories.map((c) => {
          const active = selected.has(c); // 선택 여부 체크 set을 통해 받아온 요소들~

          return (
            <button
              key={c}                       
              type="button"                 
              aria-pressed={active}      
              onClick={() => onToggle(c)}  
              className={[

                "text-sm rounded-full px-3 py-1 border transition-colors",
                active
                  ? "bg-primary-10 text-primary-70 border-primary-30"
                  : "bg-gray-0 text-gray-80 border-gray-20 hover:bg-gray-10",
              ].join(" ")}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
