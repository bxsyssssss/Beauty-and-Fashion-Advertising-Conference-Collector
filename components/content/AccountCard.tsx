"use client";
import { ReferenceAccount } from "@/lib/types";
import { useState } from "react";

interface Props { account: ReferenceAccount; onDelete: (id: string) => void; }

const PLATFORM_INFO: Record<string, { emoji: string; color: string }> = {
  instagram: { emoji: "📷", color: "#E1306C" },
  youtube:   { emoji: "▶️", color: "#FF0000" },
  tiktok:    { emoji: "🎵", color: "#010101" },
  twitter:   { emoji: "🐦", color: "#1DA1F2" },
  other:     { emoji: "🔗", color: "#6C757D" },
};

function timeAgo(dateStr: string) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return "오늘"; if (days === 1) return "1일 전";
  if (days < 7) return `${days}일 전`; if (days < 30) return `${Math.floor(days / 7)}주 전`;
  return `${Math.floor(days / 30)}개월 전`;
}
function statusColor(dateStr: string) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  return days <= 1 ? "bg-green-400" : days <= 7 ? "bg-yellow-400" : "bg-red-400";
}

export default function AccountCard({ account, onDelete }: Props) {
  const [showMemo, setShowMemo] = useState(false);
  const p = PLATFORM_INFO[account.platform] ?? PLATFORM_INFO.other;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-2.5 text-sm">
      {/* 플랫폼 + 지역 + 삭제 */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: p.color }}>
          {p.emoji}
        </span>
        {account.region && (
          <span className="text-xs text-gray-400">{account.region === "국내" ? "🇰🇷" : "🌍"}</span>
        )}
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-auto ${
          account.category === "뷰티" ? "bg-pink-50 text-pink-600" :
          account.category === "패션" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"
        }`}>{account.category}</span>
        <button onClick={() => onDelete(account.id)} className="text-gray-200 hover:text-red-400 transition ml-1 text-xs">✕</button>
      </div>

      {/* 이름 */}
      <div>
        <p className="font-bold text-gray-900 text-sm truncate">{account.display_name}</p>
        <p className="text-xs text-gray-400 truncate">{account.username}</p>
      </div>

      {/* 업데이트 상태 */}
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full shrink-0 ${statusColor(account.last_post_date)}`} />
        <span className="text-xs text-gray-400">{timeAgo(account.last_post_date)}</span>
        {account.memo && (
          <button onClick={() => setShowMemo(!showMemo)} className="ml-auto text-xs text-gray-300 hover:text-brand transition">
            메모 {showMemo ? "▲" : "▼"}
          </button>
        )}
      </div>

      {/* 메모 */}
      {showMemo && account.memo && (
        <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 leading-relaxed">
          {account.memo}
        </p>
      )}

      <a href={account.url} target="_blank" rel="noopener noreferrer"
        className="block text-center text-xs font-semibold py-1.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition mt-auto"
      >방문하기 →</a>
    </div>
  );
}
