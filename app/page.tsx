"use client";

import { useState, useMemo } from "react";
import type { Ad, AdsData } from "@/lib/types";
import adsDataRaw from "@/data/ads.json";
import AdCard from "@/components/AdCard";
import AdModal from "@/components/AdModal";
import Sidebar from "@/components/Sidebar";
import CollectModal from "@/components/CollectModal";

const adsData = adsDataRaw as AdsData;

interface Filters {
  search: string;
  brands: string[];
  categories: string[];
  status: "all" | "active" | "inactive";
  media: "all" | "image" | "video";
  minDays: number;
}

const DEFAULT_FILTERS: Filters = {
  search: "",
  brands: [],
  categories: [],
  status: "all",
  media: "all",
  minDays: 0,
};

export default function Home() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [showCollect, setShowCollect] = useState(false);
  const [favIds, setFavIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      return new Set(JSON.parse(localStorage.getItem("fav_ads") || "[]"));
    } catch {
      return new Set();
    }
  });
  const [showFavsOnly, setShowFavsOnly] = useState(false);

  const allAds = adsData.ads;

  const brandList = useMemo(
    () => [...new Set(allAds.map((a) => a.page_name))].sort(),
    [allAds]
  );
  const categoryList = useMemo(
    () => [...new Set(allAds.map((a) => a.category).filter(Boolean))].sort(),
    [allAds]
  );

  const filtered = useMemo(() => {
    let ads = showFavsOnly ? allAds.filter((a) => favIds.has(a.ad_id)) : allAds;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      ads = ads.filter(
        (a) =>
          a.caption?.toLowerCase().includes(q) ||
          a.page_name?.toLowerCase().includes(q) ||
          a.cta_text?.toLowerCase().includes(q)
      );
    }
    if (filters.brands.length)
      ads = ads.filter((a) => filters.brands.includes(a.page_name));
    if (filters.categories.length)
      ads = ads.filter((a) => filters.categories.includes(a.category));
    if (filters.status === "active") ads = ads.filter((a) => a.is_active);
    if (filters.status === "inactive") ads = ads.filter((a) => !a.is_active);
    if (filters.media === "image") ads = ads.filter((a) => !a.has_video);
    if (filters.media === "video") ads = ads.filter((a) => a.has_video);
    if (filters.minDays > 0)
      ads = ads.filter((a) => (a.active_days ?? 0) >= filters.minDays);

    return ads;
  }, [allAds, filters, favIds, showFavsOnly]);

  const toggleFav = (id: string) => {
    setFavIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("fav_ads", JSON.stringify([...next]));
      return next;
    });
  };

  const lastUpdated = (() => {
    if (!adsData.last_updated) return "정보 없음";
    const d = new Date(adsData.last_updated);
    const diff = Math.round((Date.now() - d.getTime()) / 60000);
    if (diff < 60) return `${diff}분 전`;
    if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`;
    return `${Math.floor(diff / 1440)}일 전`;
  })();

  return (
    <div className="min-h-screen p-5">
      <div className="max-w-7xl mx-auto flex gap-5 items-start">
        {/* 사이드바 */}
        <Sidebar
          filters={filters}
          onChange={setFilters}
          brandList={brandList}
          categoryList={categoryList}
          totalCount={allAds.length}
          filteredCount={filtered.length}
          lastUpdated={lastUpdated}
          onCollect={() => setShowCollect(true)}
          collecting={false}
        />

        {/* 메인 콘텐츠 */}
        <main className="flex-1 min-w-0">
          {/* 상단 탭 */}
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => setShowFavsOnly(false)}
              className={`text-sm font-semibold px-4 py-2 rounded-xl transition ${
                !showFavsOnly ? "bg-gray-900 text-white" : "bg-white text-gray-500 hover:bg-gray-100"
              }`}
            >
              전체 광고
            </button>
            <button
              onClick={() => setShowFavsOnly(true)}
              className={`text-sm font-semibold px-4 py-2 rounded-xl transition ${
                showFavsOnly ? "bg-gray-900 text-white" : "bg-white text-gray-500 hover:bg-gray-100"
              }`}
            >
              ❤️ 찜한 소재 ({favIds.size})
            </button>
            <span className="ml-auto text-xs text-gray-400">{filtered.length}개 광고</span>
          </div>

          {/* 갤러리 그리드 */}
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-medium">조건에 맞는 광고가 없어요</p>
              <p className="text-sm mt-1">필터를 초기화하거나 리서치를 먼저 실행해보세요</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((ad) => (
                <AdCard
                  key={ad.ad_id}
                  ad={ad}
                  isFav={favIds.has(ad.ad_id)}
                  onFavToggle={toggleFav}
                  onClick={() => setSelectedAd(ad)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* 광고 상세 모달 */}
      {selectedAd && (
        <AdModal ad={selectedAd} onClose={() => setSelectedAd(null)} />
      )}

      {/* 수집 안내 모달 */}
      {showCollect && <CollectModal onClose={() => setShowCollect(false)} />}
    </div>
  );
}
