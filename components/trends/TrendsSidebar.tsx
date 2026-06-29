"use client";

type SourceFilter = "전체" | "pinterest" | "twitter" | "google" | "reddit" | "naver";
type CategoryFilter = "전체" | "패션" | "뷰티";

interface Props {
  sourceFilter: SourceFilter;
  onSourceChange: (s: SourceFilter) => void;
  categoryFilter: CategoryFilter;
  onCategoryChange: (c: CategoryFilter) => void;
  lastUpdated: string;
  onCollect: () => void;
}

const SOURCES: { key: SourceFilter; emoji: string; label: string }[] = [
  { key: "전체",     emoji: "🔍", label: "전체" },
  { key: "pinterest",emoji: "📌", label: "Pinterest" },
  { key: "twitter",  emoji: "🐦", label: "X / Twitter" },
  { key: "google",   emoji: "📊", label: "구글 트렌드" },
  { key: "reddit",   emoji: "🌐", label: "Reddit" },
  { key: "naver",    emoji: "🛒", label: "네이버 DataLab" },
];

export default function TrendsSidebar({ sourceFilter, onSourceChange, categoryFilter, onCategoryChange, lastUpdated, onCollect }: Props) {
  return (
    <aside className="w-52 shrink-0 flex flex-col gap-5 p-5 bg-white rounded-2xl shadow-sm h-fit sticky top-20">
      <div>
        <h2 className="font-black text-gray-900 text-base leading-tight">
          트렌드<br /><span className="text-brand">리서치</span>
        </h2>
        <p className="text-xs text-gray-400 mt-1">실시간 마켓 센싱</p>
      </div>

      <button onClick={onCollect}
        className="w-full py-2.5 rounded-xl bg-brand text-white text-sm font-bold hover:opacity-90 transition"
      >⚡ 리서치 시작</button>

      <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-400">
        업데이트: {lastUpdated}
      </div>

      <hr className="border-gray-100" />

      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">카테고리</p>
        <div className="flex flex-col gap-1">
          {(["전체", "패션", "뷰티"] as CategoryFilter[]).map((c) => (
            <button key={c} onClick={() => onCategoryChange(c)}
              className={`text-left text-sm px-3 py-2 rounded-xl font-medium transition ${
                categoryFilter === c ? "bg-brand text-white" : "text-gray-500 hover:bg-gray-100"
              }`}
            >{c === "전체" ? "🏠 전체" : c === "패션" ? "👗 패션" : "💄 뷰티"}</button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">소스</p>
        <div className="flex flex-col gap-1">
          {SOURCES.map((s) => (
            <button key={s.key} onClick={() => onSourceChange(s.key)}
              className={`text-left text-sm px-3 py-2 rounded-xl font-medium transition ${
                sourceFilter === s.key ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"
              }`}
            >{s.emoji} {s.label}</button>
          ))}
        </div>
      </div>
    </aside>
  );
}
