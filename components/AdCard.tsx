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
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
      {/* 썸네일 — 클릭 시 광고 라이브러리 바로 이동 */}
      <a
        href={ad.library_url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative aspect-[4/3] bg-gray-100 overflow-hidden block"
        onClick={(e) => e.stopPropagation()}
      >
        {!imgError && ad.thumbnail_url ? (
          <img
            src={ad.thumbnail_url}
            alt={ad.page_name}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center flex-col gap-2 bg-gray-50">
            <span className="text-3xl">{ad.has_video ? "🎬" : "🖼️"}</span>
            <span className="text-xs text-gray-400">{ad.page_name}</span>
            <span className="text-xs text-gray-300">클릭 → 광고 보기</span>
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
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFavToggle(ad.ad_id); }}
        >
          {isFav ? "❤️" : "🤍"}
        </button>

        {/* 호버 오버레이 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full">
            광고 보기 →
          </span>
        </div>
      </a>

      {/* 카드 하단 — 클릭 시 상세 모달 */}
      <div className="p-3 cursor-pointer flex-1" onClick={onClick}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-sm text-gray-900 truncate">{ad.page_name}</p>
            <p className="text-xs text-gray-400">{ad.category}</p>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
            ad.is_active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
          }`}>
            {ad.is_active ? `${ad.active_days ?? "-"}일` : "종료"}
          </span>
        </div>
        {ad.caption && (
          <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">{ad.caption}</p>
        )}
        <p className="mt-2 text-xs text-gray-300 hover:text-brand transition">상세 정보 보기 ▸</p>
      </div>
    </div>
  );
}
