"use client";
import { Ad } from "@/lib/types";
import { useEffect } from "react";

interface Props {
  ad: Ad;
  onClose: () => void;
}

export default function AdModal({ ad, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <span className="text-xs font-semibold text-brand bg-brand-light px-2 py-0.5 rounded-full">
              {ad.category}
            </span>
            <span className="ml-2 font-bold text-gray-900">{ad.page_name}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* 본문 */}
        <div className="flex flex-col md:flex-row overflow-auto">
          {/* 미디어 */}
          <div className="md:w-1/2 bg-gray-50 flex items-center justify-center min-h-[260px] p-4">
            {ad.video_url ? (
              <video
                src={ad.video_url}
                controls
                className="max-h-[420px] max-w-full rounded-xl"
              />
            ) : ad.thumbnail_url ? (
              <img
                src={ad.thumbnail_url}
                alt="광고 이미지"
                className="max-h-[420px] max-w-full rounded-xl object-contain"
                onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
              />
            ) : (
              <div className="text-gray-300 text-sm">이미지 없음</div>
            )}
          </div>

          {/* 정보 */}
          <div className="md:w-1/2 p-5 flex flex-col gap-4 overflow-y-auto">
            {/* 배지 */}
            <div className="flex gap-2 flex-wrap">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${ad.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {ad.is_active ? "활성" : "비활성"}
              </span>
              {ad.has_video && (
                <span className="text-xs px-2 py-1 rounded-full font-medium bg-purple-100 text-purple-700">
                  영상
                </span>
              )}
              {ad.platforms.map((p) => (
                <span key={p} className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 capitalize">
                  {p}
                </span>
              ))}
            </div>

            {/* 게재 정보 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">게재일수</p>
                <p className="font-bold text-lg text-gray-900">{ad.active_days ?? "-"}일</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">시작일</p>
                <p className="font-bold text-sm text-gray-900">{ad.start_date ?? "-"}</p>
              </div>
            </div>

            {/* CTA */}
            {ad.cta_text && (
              <div>
                <p className="text-xs text-gray-400 mb-1">CTA 버튼</p>
                <span className="inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded-lg">
                  {ad.cta_text}
                </span>
              </div>
            )}

            {/* 캡션 */}
            {ad.caption && (
              <div>
                <p className="text-xs text-gray-400 mb-1">광고 캡션</p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap line-clamp-6">
                  {ad.caption}
                </p>
              </div>
            )}

            {/* 링크 버튼 */}
            <div className="flex flex-col gap-2 mt-auto pt-2">
              {ad.landing_url && (
                <a
                  href={ad.landing_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-sm font-medium bg-brand text-white py-2 rounded-xl hover:opacity-90 transition"
                >
                  랜딩페이지 열기 →
                </a>
              )}
              <a
                href={ad.library_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-sm font-medium border border-gray-200 text-gray-600 py-2 rounded-xl hover:bg-gray-50 transition"
              >
                광고 라이브러리에서 보기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
