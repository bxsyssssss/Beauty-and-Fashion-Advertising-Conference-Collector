"use client";
import { ReferenceAccount } from "@/lib/types";

type ContentSubTab = "전체" | "패션" | "뷰티";
type PlatformFilter = "전체" | "instagram" | "youtube" | "tiktok" | "twitter";

interface Props {
  subTab: ContentSubTab;
  onSubTabChange: (t: ContentSubTab) => void;
  platformFilter: PlatformFilter;
  onPlatformChange: (p: PlatformFilter) => void;
  accounts: ReferenceAccount[];
  onAddAccount: () => void;
  totalAccounts: number;
  filteredCount: number;
  lastUpdated: string;
  onCollect: () => void;
}

const PLATFORM_LABELS: Record<PlatformFilter, string> = {
  "전체": "전체",
  instagram: "📷 인스타",
  youtube: "▶ 유튜브",
  tiktok: "🎵 틱톡",
  twitter: "🐦 X",
};

export default function ContentSidebar({
  subTab, onSubTabChange, platformFilter, onPlatformChange,
  onAddAccount, totalAccounts, filteredCount, lastUpdated, onCollect,
}: Props) {
  return (
    <aside className="w-56 shrink-0 flex flex-col gap-5 p-5 bg-white rounded-2xl shadow-sm h-fit sticky top-20">
      <div>
        <h2 className="font-black text-gray-900 text-base leading-tight">
          콘텐츠<br /><span className="text-brand">피드</span>
        </h2>
        <p className="text-xs text-gray-400 mt-1">레퍼런스 & 트렌딩</p>
      </div>

      <button
        onClick={onCollect}
        className="w-full py-2.5 rounded-xl bg-brand text-white text-sm font-bold hover:opacity-90 transition"
      >
        ⚡ 리서치 시작
      </button>

      <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 space-y-1">
        <p>래퍼런스 계정: <span className="font-semibold text-gray-700">{totalAccounts}개</span></p>
        <p>현재 표시: <span className="font-semibold text-gray-700">{filteredCount}개</span></p>
        <p className="text-gray-400">업데이트: {lastUpdated}</p>
      </div>

      <hr className="border-gray-100" />

      {/* 카테고리 */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">카테고리</p>
        <div className="flex flex-col gap-1">
          {(["전체", "패션", "뷰티"] as ContentSubTab[]).map((t) => (
            <button
              key={t}
              onClick={() => onSubTabChange(t)}
              className={`text-left text-sm px-3 py-2 rounded-xl font-medium transition ${
                subTab === t ? "bg-brand text-white" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {t === "전체" ? "🏠 전체" : t === "패션" ? "👗 패션" : "💄 뷰티"}
            </button>
          ))}
        </div>
      </div>

      {/* 플랫폼 */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">플랫폼</p>
        <div className="flex flex-col gap-1">
          {(Object.keys(PLATFORM_LABELS) as PlatformFilter[]).map((p) => (
            <button
              key={p}
              onClick={() => onPlatformChange(p)}
              className={`text-left text-sm px-3 py-2 rounded-xl font-medium transition ${
                platformFilter === p ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {PLATFORM_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      <button
        onClick={onAddAccount}
        className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm font-semibold text-gray-400 hover:border-brand hover:text-brand transition"
      >
        + 계정 추가
      </button>
    </aside>
  );
}
