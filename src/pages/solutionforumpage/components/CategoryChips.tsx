import { Detail } from "@krds-ui/core";

type Props = {
  categories: string[];
  selected: Set<string>;
  onToggle: (cat: string) => void;
};

export default function CategoryChips({ categories, selected, onToggle }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Detail size="s" className="whitespace-nowrap text-gray-80">
        카테고리
      </Detail>
      <div className="flex flex-wrap gap-6">
        {categories.map((c) => {
          const active = selected.has(c);
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
