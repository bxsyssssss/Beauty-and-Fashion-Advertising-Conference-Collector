"use client";
import { useState } from "react";
import { ReferenceAccount } from "@/lib/types";

interface Props {
  onAdd: (account: ReferenceAccount) => void;
  onClose: () => void;
}

function detectPlatform(url: string): ReferenceAccount["platform"] {
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("tiktok.com")) return "tiktok";
  if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
  return "other";
}

function extractUsername(url: string, platform: string): string {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    if (platform === "instagram" || platform === "tiktok" || platform === "twitter")
      return "@" + (parts[0] ?? "");
    if (platform === "youtube")
      return parts.find((p) => p.startsWith("@")) ?? parts[0] ?? "";
    return parts[0] ?? url;
  } catch {
    return url;
  }
}

export default function AddAccountModal({ onAdd, onClose }: Props) {
  const [url, setUrl] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [follower, setFollower] = useState("");
  const [category, setCategory] = useState<"패션" | "뷰티" | "전체">("전체");

  const handleAdd = () => {
    if (!url.trim()) return;
    const platform = detectPlatform(url);
    const username = extractUsername(url, platform);
    const now = new Date().toISOString().split("T")[0];
    onAdd({
      id: Date.now().toString(),
      platform,
      username,
      url: url.trim(),
      category,
      display_name: displayName || username,
      follower_count: follower,
      last_post_date: now,
      added_at: now,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-lg">래퍼런스 계정 추가</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl">×</button>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">계정 URL *</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.instagram.com/account"
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-brand transition"
            />
            {url && (
              <p className="text-xs text-gray-400 mt-1">
                플랫폼: <strong>{detectPlatform(url)}</strong> · 계정: {extractUsername(url, detectPlatform(url))}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">표시 이름</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="예: 뷰티 크리에이터 민지"
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-brand transition"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">팔로워 수 (선택)</label>
            <input
              type="text"
              value={follower}
              onChange={(e) => setFollower(e.target.value)}
              placeholder="예: 12만, 1.2M"
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-brand transition"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">카테고리</label>
            <div className="flex gap-2">
              {(["전체", "패션", "뷰티"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                    category === c ? "bg-brand text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={!url.trim()}
          className="w-full py-3 rounded-xl bg-brand text-white font-bold text-sm hover:opacity-90 transition disabled:opacity-40"
        >
          추가하기
        </button>
      </div>
    </div>
  );
}
