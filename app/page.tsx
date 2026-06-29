"use client";

import { useState, useMemo } from "react";
import type { Ad, AdsData, TrendsData, ContentData, ReferenceAccount } from "@/lib/types";
import adsDataRaw from "@/data/ads.json";
import trendsDataRaw from "@/data/trends.json";
import contentDataRaw from "@/data/content.json";

// 광고소재 컴포넌트
import AdCard from "@/components/AdCard";
import AdModal from "@/components/AdModal";
import Sidebar from "@/components/Sidebar";
import CollectModal from "@/components/CollectModal";

// 트렌드 컴포넌트
import SeasonCalendar from "@/components/trends/SeasonCalendar";
import TrendKeywords from "@/components/trends/TrendKeywords";
import TrendSourceCard from "@/components/trends/TrendSourceCard";

// 콘텐츠 컴포넌트
import AccountCard from "@/components/content/AccountCard";
import AddAccountModal from "@/components/content/AddAccountModal";

const adsData = adsDataRaw as AdsData;
const trendsData = trendsDataRaw as TrendsData;
const contentData = contentDataRaw as ContentData;

type Tab = "ads" | "content" | "trends";
type AdSubTab = "전체" | "패션" | "뷰티";
type ContentSubTab = "전체" | "패션" | "뷰티";

interface Filters {
  search: string;
  brands: string[];
  categories: string[];
  status: "all" | "active" | "inactive";
  media: "all" | "image" | "video";
  minDays: number;
}

const DEFAULT_FILTERS: Filters = {
  search: "", brands: [], categories: [], status: "all", media: "all", minDays: 0,
};

const AD_CATEGORIES: Record<AdSubTab, string[]> = {
  "전체": [],
  "패션": ["패션플랫폼", "SPA패션"],
  "뷰티": ["뷰티플랫폼", "스킨케어", "메이크업", "럭셔리뷰티"],
};

export default function Home() {
  const [tab, setTab] = useState<Tab>("ads");
  const [adSubTab, setAdSubTab] = useState<AdSubTab>("전체");
  const [contentSubTab, setContentSubTab] = useState<ContentSubTab>("전체");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [showCollect, setShowCollect] = useState(false);
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);

  const [favIds, setFavIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try { return new Set(JSON.parse(localStorage.getItem("fav_ads") || "[]")); }
    catch { return new Set(); }
  });

  const [accounts, setAccounts] = useState<ReferenceAccount[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("ref_accounts") || "[]"); }
    catch { return []; }
  });

  const saveAccounts = (list: ReferenceAccount[]) => {
    setAccounts(list);
    localStorage.setItem("ref_accounts", JSON.stringify(list));
  };

  const allAds = adsData.ads;

  const brandList = useMemo(() => [...new Set(allAds.map((a) => a.page_name))].sort(), [allAds]);
  const categoryList = useMemo(() => [...new Set(allAds.map((a) => a.category).filter(Boolean))].sort(), [allAds]);

  const filteredAds = useMemo(() => {
    let ads = showFavsOnly ? allAds.filter((a) => favIds.has(a.ad_id)) : allAds;

    if (adSubTab !== "전체") {
      const cats = AD_CATEGORIES[adSubTab];
      ads = ads.filter((a) => cats.includes(a.category));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      ads = ads.filter((a) => a.caption?.toLowerCase().includes(q) || a.page_name?.toLowerCase().includes(q));
    }
    if (filters.brands.length) ads = ads.filter((a) => filters.brands.includes(a.page_name));
    if (filters.status === "active") ads = ads.filter((a) => a.is_active);
    if (filters.status === "inactive") ads = ads.filter((a) => !a.is_active);
    if (filters.media === "image") ads = ads.filter((a) => !a.has_video);
    if (filters.media === "video") ads = ads.filter((a) => a.has_video);
    if (filters.minDays > 0) ads = ads.filter((a) => (a.active_days ?? 0) >= filters.minDays);
    return ads;
  }, [allAds, adSubTab, filters, favIds, showFavsOnly]);

  const toggleFav = (id: string) => {
    setFavIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("fav_ads", JSON.stringify([...next]));
      return next;
    });
  };

  const lastUpdated = (() => {
    const src = tab === "trends" ? trendsData.last_updated : tab === "content" ? contentData.last_updated : adsData.last_updated;
    if (!src) return "정보 없음";
    const diff = Math.round((Date.now() - new Date(src).getTime()) / 60000);
    if (diff < 60) return `${diff}분 전`;
    if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`;
    return `${Math.floor(diff / 1440)}일 전`;
  })();

  const filteredAccounts = accounts.filter(
    (a) => contentSubTab === "전체" || a.category === contentSubTab
  );

  const contentItems = useMemo(() => {
    const all = [...contentData.youtube.fashion, ...contentData.youtube.beauty];
    if (contentSubTab === "전체") return all;
    return all.filter((v) => v.category === contentSubTab);
  }, [contentSubTab]);

  return (
    <div className="min-h-screen">
      {/* 상단 네비게이션 */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <h1 className="font-black text-lg text-gray-900">
            광고<span className="text-brand">레퍼</span>
          </h1>
          <nav className="flex gap-1">
            {([["ads", "광고소재"], ["content", "콘텐츠"], ["trends", "트렌드"]] as [Tab, string][]).map(([t, label]) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition ${
                  tab === t ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-gray-400">마지막 수집: {lastUpdated}</span>
            <button
              onClick={() => setShowCollect(true)}
              className="px-4 py-1.5 rounded-xl bg-brand text-white text-sm font-bold hover:opacity-90 transition"
            >
              ⚡ 리서치 시작
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">

        {/* ── 광고소재 탭 ── */}
        {tab === "ads" && (
          <div className="flex gap-6 items-start">
            <Sidebar
              filters={filters} onChange={setFilters}
              brandList={brandList} categoryList={categoryList}
              totalCount={allAds.length} filteredCount={filteredAds.length}
              lastUpdated={lastUpdated}
              onCollect={() => setShowCollect(true)} collecting={false}
            />
            <div className="flex-1 min-w-0">
              {/* 서브탭 */}
              <div className="flex items-center gap-2 mb-5">
                {(["전체", "패션", "뷰티"] as AdSubTab[]).map((t) => (
                  <button key={t} onClick={() => setAdSubTab(t)}
                    className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition ${
                      adSubTab === t ? "bg-gray-900 text-white" : "bg-white text-gray-500 hover:bg-gray-100"
                    }`}
                  >{t}</button>
                ))}
                <div className="flex gap-2 ml-4">
                  <button onClick={() => setShowFavsOnly(false)}
                    className={`text-sm px-3 py-1.5 rounded-xl transition ${!showFavsOnly ? "bg-brand text-white" : "bg-white text-gray-400 hover:bg-gray-100"}`}
                  >전체 광고</button>
                  <button onClick={() => setShowFavsOnly(true)}
                    className={`text-sm px-3 py-1.5 rounded-xl transition ${showFavsOnly ? "bg-brand text-white" : "bg-white text-gray-400 hover:bg-gray-100"}`}
                  >❤️ 찜 ({favIds.size})</button>
                </div>
                <span className="ml-auto text-xs text-gray-400">{filteredAds.length}개</span>
              </div>

              {filteredAds.length === 0 ? (
                <div className="text-center py-24 text-gray-400">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="font-medium">조건에 맞는 광고가 없어요</p>
                  <p className="text-sm mt-1">리서치를 먼저 실행하거나 필터를 조정해보세요</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredAds.map((ad) => (
                    <AdCard key={ad.ad_id} ad={ad}
                      isFav={favIds.has(ad.ad_id)} onFavToggle={toggleFav}
                      onClick={() => setSelectedAd(ad)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 콘텐츠 탭 ── */}
        {tab === "content" && (
          <div className="flex flex-col gap-8">
            {/* 서브탭 */}
            <div className="flex items-center gap-2">
              {(["전체", "패션", "뷰티"] as ContentSubTab[]).map((t) => (
                <button key={t} onClick={() => setContentSubTab(t)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition ${
                    contentSubTab === t ? "bg-gray-900 text-white" : "bg-white text-gray-500 hover:bg-gray-100"
                  }`}
                >{t}</button>
              ))}
            </div>

            {/* 래퍼런스 계정 */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">📌 래퍼런스 계정</h2>
                <button
                  onClick={() => setShowAddAccount(true)}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl bg-brand text-white hover:opacity-90 transition"
                >
                  + 계정 추가
                </button>
              </div>
              {filteredAccounts.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow-sm">
                  <p className="text-3xl mb-2">📎</p>
                  <p className="font-medium text-sm">등록된 래퍼런스 계정이 없어요</p>
                  <p className="text-xs mt-1">인스타, 유튜브, 틱톡 계정을 추가해보세요</p>
                  <button
                    onClick={() => setShowAddAccount(true)}
                    className="mt-3 text-xs font-bold text-brand hover:underline"
                  >+ 첫 계정 추가하기</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {filteredAccounts.map((acc) => (
                    <AccountCard key={acc.id} account={acc}
                      onDelete={(id) => saveAccounts(accounts.filter((a) => a.id !== id))}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* 유튜브 인기 콘텐츠 */}
            <section>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                🔥 지금 뜨는 콘텐츠
              </h2>
              <div className="flex flex-col gap-3">
                {contentItems.map((v) => (
                  <a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer"
                    className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition"
                  >
                    <div className="w-24 h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 text-2xl">
                      {v.category === "뷰티" ? "💄" : "👗"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm line-clamp-2">{v.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{v.channel} · 조회 {v.views} · {v.published_at}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                      v.category === "뷰티" ? "bg-pink-50 text-pink-600" : "bg-blue-50 text-blue-600"
                    }`}>{v.category}</span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ── 트렌드 탭 ── */}
        {tab === "trends" && (
          <div className="flex flex-col gap-8">
            <SeasonCalendar events={trendsData.season_events} />
            <TrendKeywords keywords={trendsData.top_keywords} />
            <div>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                📡 소스별 트렌드
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(trendsData.sources).map(([key, source]) => (
                  <TrendSourceCard key={key} sourceKey={key} source={source} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {selectedAd && <AdModal ad={selectedAd} onClose={() => setSelectedAd(null)} />}
      {showCollect && <CollectModal onClose={() => setShowCollect(false)} />}
      {showAddAccount && (
        <AddAccountModal
          onAdd={(acc) => saveAccounts([...accounts, acc])}
          onClose={() => setShowAddAccount(false)}
        />
      )}
    </div>
  );
}
