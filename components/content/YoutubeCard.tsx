"use client";
import { YoutubeItem } from "@/lib/types";
import { useState } from "react";

interface Props { item: YoutubeItem }

function ytThumb(item: YoutubeItem): string {
  // video ID가 있으면 YouTube CDN 썸네일 사용
  if (item.url && item.url.includes("watch?v=")) {
    const id = new URL(item.url).searchParams.get("v");
    if (id) return `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
  }
  return item.thumbnail_url || "";
}

export default function YoutubeCard({ item }: Props) {
  const [imgError, setImgError] = useState(false);
  const thumb = ytThumb(item);

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group flex flex-col"
    >
      {/* 썸네일 */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {!imgError && thumb ? (
          <img
            src={thumb}
            alt={item.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl bg-gray-100">
            {item.category === "뷰티" ? "💄" : "👗"}
          </div>
        )}
        {/* 재생 아이콘 오버레이 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/20">
          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
            <span className="text-red-600 text-sm ml-0.5">▶</span>
          </div>
        </div>
        <span className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium text-white ${
          item.category === "뷰티" ? "bg-pink-500" : "bg-blue-500"
        }`}>
          {item.category}
        </span>
      </div>

      {/* 정보 */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">{item.title}</p>
        <p className="text-xs text-gray-400">{item.channel}</p>
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-xs text-gray-400">조회 {item.views}</span>
          <span className="text-xs text-gray-300">{item.published_at}</span>
        </div>
      </div>
    </a>
  );
}
