"use client";
import { Ad } from "@/lib/types";
import { useState } from "react";

interface Props {
  ad: Ad;
  isFav: boolean;
  onFavToggle: (id: string) => void;
  onClick: () => void;
}

export default function AdCard({ ad, isFav, onFavToggle, onClick }: Props) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      {/* 썸네일 */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {!imgError && ad.thumbnail_url ? (
          <img
            src={ad.thumbnail_url}
            alt={ad.page_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm flex-col gap-2">
            <span className="text-3xl">{ad.has_video ? "🎬" : "🖼️"}</span>
            <span>{ad.page_name}</span>
          </div>
        )}

        {/* 영상 배지 */}
        {ad.has_video && (
          <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
            🎬 영상
          </span>
        )}

        {/* 찜 버튼 */}
        <button
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow transition"
          onClick={(e) => { e.stopPropagation(); onFavToggle(ad.ad_id); }}
        >
          {isFav ? "❤️" : "🤍"}
        </button>
      </div>

      {/* 카드 하단 */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm text-gray-900 truncate">{ad.page_name}</p>
            <p className="text-xs text-gray-400">{ad.category}</p>
          </div>
          <div className="text-right">
            <p className={`text-xs font-medium px-2 py-0.5 rounded-full ${ad.is_active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
              {ad.is_active ? `${ad.active_days ?? "-"}일 게재중` : "종료"}
            </p>
          </div>
        </div>
        {ad.caption && (
          <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {ad.caption}
          </p>
        )}
      </div>
    </div>
  );
}
