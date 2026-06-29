"use client";
import { ReferenceAccount } from "@/lib/types";

interface Props {
  account: ReferenceAccount;
  onDelete: (id: string) => void;
}

const PLATFORM_INFO: Record<string, { emoji: string; color: string; label: string }> = {
  instagram: { emoji: "📷", color: "#E1306C", label: "Instagram" },
  youtube:   { emoji: "▶️", color: "#FF0000", label: "YouTube" },
  tiktok:    { emoji: "🎵", color: "#010101", label: "TikTok" },
  twitter:   { emoji: "🐦", color: "#1DA1F2", label: "Twitter" },
  other:     { emoji: "🔗", color: "#6C757D", label: "Link" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "오늘";
  if (days === 1) return "1일 전";
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  return `${Math.floor(days / 30)}개월 전`;
}

function statusColor(dateStr: string) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days <= 1) return "bg-green-400";
  if (days <= 7) return "bg-yellow-400";
  return "bg-red-400";
}

export default function AccountCard({ account, onDelete }: Props) {
  const p = PLATFORM_INFO[account.platform] ?? PLATFORM_INFO.other;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3">
      {/* 플랫폼 + 삭제 */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: p.color }}
        >
          {p.emoji} {p.label}
        </span>
        <button
          onClick={() => onDelete(account.id)}
          className="text-gray-300 hover:text-red-400 text-sm transition"
        >
          ✕
        </button>
      </div>

      {/* 계정 정보 */}
      <div>
        <p className="font-bold text-gray-900">{account.display_name || account.username}</p>
        <p className="text-xs text-gray-400">{account.username}</p>
      </div>

      {/* 팔로워 + 최근 업데이트 */}
      <div className="flex items-center justify-between text-xs">
        {account.follower_count && (
          <span className="text-gray-500">팔로워 {account.follower_count}</span>
        )}
        <span className="flex items-center gap-1.5 ml-auto">
          <span className={`w-2 h-2 rounded-full ${statusColor(account.last_post_date)}`} />
          <span className="text-gray-400">{timeAgo(account.last_post_date)}</span>
        </span>
      </div>

      {/* 카테고리 */}
      <span className={`text-xs px-2 py-0.5 rounded-full w-fit font-medium ${
        account.category === "뷰티" ? "bg-pink-50 text-pink-600" :
        account.category === "패션" ? "bg-blue-50 text-blue-600" :
        "bg-gray-100 text-gray-500"
      }`}>
        {account.category}
      </span>

      {/* 방문 버튼 */}
      <a
        href={account.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-xs font-semibold py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition"
      >
        방문하기 →
      </a>
    </div>
  );
}
