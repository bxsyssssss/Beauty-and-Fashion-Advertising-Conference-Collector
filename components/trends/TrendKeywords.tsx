"use client";
import { TrendKeyword } from "@/lib/types";

interface Props { keywords: TrendKeyword[]; }

const SOURCE_BADGES: Record<string, { label: string; color: string }> = {
  pinterest: { label: "Pinterest", color: "#E60023" },
  twitter:   { label: "Twitter",   color: "#1DA1F2" },
  google:    { label: "Google",    color: "#4285F4" },
  reddit:    { label: "Reddit",    color: "#FF4500" },
  naver:     { label: "Naver",     color: "#03C75A" },
};

export default function TrendKeywords({ keywords }: Props) {
  return (
    <section>
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
        🔥 지금 뜨는 키워드
      </h2>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        {keywords.map((kw, i) => (
          <div
            key={kw.keyword}
            className={`flex items-center gap-4 px-5 py-3.5 ${i < keywords.length - 1 ? "border-b border-gray-50" : ""}`}
          >
            {/* 순위 */}
            <span className={`w-6 text-sm font-black ${i < 3 ? "text-brand" : "text-gray-300"}`}>
              {kw.rank}
            </span>

            {/* 방향 */}
            <span className={`text-lg ${kw.direction === "up" ? "text-green-500" : "text-red-400"}`}>
              {kw.direction === "up" ? "↑" : "↓"}
            </span>

            {/* 키워드 */}
            <span className="flex-1 font-semibold text-gray-900">{kw.keyword}</span>

            {/* 카테고리 */}
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              kw.category === "뷰티" ? "bg-pink-50 text-pink-600" : "bg-blue-50 text-blue-600"
            }`}>
              {kw.category}
            </span>

            {/* 소스 배지 */}
            <div className="flex gap-1">
              {kw.sources.map((s) => (
                <span
                  key={s}
                  className="text-xs px-1.5 py-0.5 rounded text-white font-medium"
                  style={{ backgroundColor: SOURCE_BADGES[s]?.color ?? "#999" }}
                >
                  {SOURCE_BADGES[s]?.label ?? s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
