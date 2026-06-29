"use client";
import { useState } from "react";
import { ReferenceAccount } from "@/lib/types";

interface Props { onAdd: (a: ReferenceAccount) => void; onClose: () => void; }

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
    if (["instagram", "tiktok", "twitter"].includes(platform)) return "@" + (parts[0] ?? "");
    if (platform === "youtube") return parts.find((p) => p.startsWith("@")) ?? parts[0] ?? "";
    return parts[0] ?? url;
  } catch { return url; }
}

async function fetchChannelName(url: string, platform: string): Promise<string> {
  if (platform === "youtube") {
    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
      if (res.ok) { const d = await res.json(); return d.author_name || ""; }
    } catch {}
  }
  return "";
}

const PLATFORM_INFO: Record<string, { emoji: string; label: string }> = {
  instagram: { emoji: "📷", label: "Instagram" },
  youtube:   { emoji: "▶️", label: "YouTube" },
  tiktok:    { emoji: "🎵", label: "TikTok" },
  twitter:   { emoji: "🐦", label: "X (Twitter)" },
  other:     { emoji: "🔗", label: "기타" },
};

export default function AddAccountModal({ onAdd, onClose }: Props) {
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<"패션" | "뷰티" | "전체">("전체");
  const [region, setRegion] = useState<"국내" | "해외">("국내");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoName, setAutoName] = useState("");

  const platform = detectPlatform(url);
  const username = url ? extractUsername(url, platform) : "";

  const handleUrlBlur = async () => {
    if (!url) return;
    setLoading(true);
    const name = await fetchChannelName(url, platform);
    setAutoName(name);
    setLoading(false);
  };

  const handleAdd = () => {
    if (!url.trim()) return;
    const now = new Date().toISOString().split("T")[0];
    onAdd({
      id: Date.now().toString(),
      platform, username, url: url.trim(), category, region,
      display_name: autoName || username,
      follower_count: "", last_post_date: now, added_at: now,
      memo: memo.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-lg">래퍼런스 계정 추가</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl">×</button>
        </div>

        {/* URL */}
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">계정 URL *</label>
          <input type="url" value={url}
            onChange={(e) => { setUrl(e.target.value); setAutoName(""); }}
            onBlur={handleUrlBlur}
            placeholder="https://www.instagram.com/account"
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-brand transition"
          />
          {url && (
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                {PLATFORM_INFO[platform]?.emoji} {PLATFORM_INFO[platform]?.label}
              </span>
              <span className="text-xs text-gray-400">{username}</span>
              {loading && <span className="text-xs text-gray-400">채널명 불러오는 중...</span>}
              {autoName && <span className="text-xs text-brand font-semibold">✓ {autoName}</span>}
            </div>
          )}
        </div>

        {/* 카테고리 */}
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">카테고리 *</label>
          <div className="flex gap-2">
            {(["전체", "패션", "뷰티"] as const).map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${category === c ? "bg-brand text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >{c}</button>
            ))}
          </div>
        </div>

        {/* 국내/해외 */}
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">지역</label>
          <div className="flex gap-2">
            {(["국내", "해외"] as const).map((r) => (
              <button key={r} onClick={() => setRegion(r)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${region === r ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >{r === "국내" ? "🇰🇷 국내" : "🌍 해외"}</button>
            ))}
          </div>
        </div>

        {/* 메모 (선택) */}
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">메모 <span className="font-normal text-gray-300">(선택)</span></label>
          <textarea value={memo} onChange={(e) => setMemo(e.target.value)}
            placeholder="이 계정을 등록한 이유, 특이사항 등..."
            rows={2}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-brand transition resize-none"
          />
        </div>

        <button onClick={handleAdd} disabled={!url.trim()}
          className="w-full py-3 rounded-xl bg-brand text-white font-bold text-sm hover:opacity-90 transition disabled:opacity-40"
        >추가하기</button>
      </div>
    </div>
  );
}
