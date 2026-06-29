"use client";

interface Filters {
  search: string;
  brands: string[];
  categories: string[];
  status: "all" | "active" | "inactive";
  media: "all" | "image" | "video";
  minDays: number;
}

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  brandList: string[];
  categoryList: string[];
  totalCount: number;
  filteredCount: number;
  lastUpdated: string;
  onCollect: () => void;
  collecting: boolean;
}

export default function Sidebar({
  filters, onChange, brandList, categoryList,
  totalCount, filteredCount, lastUpdated, onCollect, collecting,
}: Props) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  const toggleArr = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  return (
    <aside className="w-64 shrink-0 flex flex-col gap-5 p-5 bg-white rounded-2xl shadow-sm h-fit sticky top-5">
      {/* 타이틀 */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 leading-tight">
          광고<br />
          <span className="text-brand">레퍼런스</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">뷰티·패션 광고 아카이브</p>
      </div>

      {/* 리서치 버튼 */}
      <button
        onClick={onCollect}
        disabled={collecting}
        className="w-full py-2.5 rounded-xl bg-brand text-white text-sm font-bold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {collecting ? "⏳ 수집 준비중..." : "⚡ 리서치 시작"}
      </button>

      {/* 수집 현황 */}
      <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 space-y-1">
        <p>전체 광고: <span className="font-semibold text-gray-700">{totalCount}개</span></p>
        <p>현재 필터: <span className="font-semibold text-gray-700">{filteredCount}개</span></p>
        <p className="text-gray-400">마지막 수집: {lastUpdated}</p>
      </div>

      <hr className="border-gray-100" />

      {/* 검색 */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">캡션 검색</p>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="키워드 입력..."
          className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand transition"
        />
      </div>

      {/* 활성 상태 */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">게재 상태</p>
        <div className="flex gap-2">
          {(["all", "active", "inactive"] as const).map((v) => (
            <button
              key={v}
              onClick={() => set({ status: v })}
              className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition ${
                filters.status === v
                  ? "bg-brand text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {v === "all" ? "전체" : v === "active" ? "활성" : "종료"}
            </button>
          ))}
        </div>
      </div>

      {/* 소재 유형 */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">소재 유형</p>
        <div className="flex gap-2">
          {(["all", "image", "video"] as const).map((v) => (
            <button
              key={v}
              onClick={() => set({ media: v })}
              className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition ${
                filters.media === v
                  ? "bg-brand text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {v === "all" ? "전체" : v === "image" ? "이미지" : "영상"}
            </button>
          ))}
        </div>
      </div>

      {/* 최소 게재일 */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">
          최소 게재일: <span className="text-brand font-bold">{filters.minDays}일+</span>
        </p>
        <input
          type="range"
          min={0} max={60} step={1}
          value={filters.minDays}
          onChange={(e) => set({ minDays: Number(e.target.value) })}
          className="w-full accent-brand"
        />
        <div className="flex justify-between text-xs text-gray-300 mt-1">
          <span>0일</span><span>60일</span>
        </div>
      </div>

      {/* 카테고리 */}
      {categoryList.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">카테고리</p>
          <div className="flex flex-wrap gap-1.5">
            {categoryList.map((c) => (
              <button
                key={c}
                onClick={() => set({ categories: toggleArr(filters.categories, c) })}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${
                  filters.categories.includes(c)
                    ? "bg-brand text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 브랜드 */}
      {brandList.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">브랜드</p>
          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
            {brandList.map((b) => (
              <label key={b} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-gray-900">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(b)}
                  onChange={() => set({ brands: toggleArr(filters.brands, b) })}
                  className="accent-brand"
                />
                {b}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 초기화 */}
      <button
        onClick={() => onChange({ search: "", brands: [], categories: [], status: "all", media: "all", minDays: 0 })}
        className="text-xs text-gray-400 hover:text-gray-600 transition text-center"
      >
        필터 초기화
      </button>
    </aside>
  );
}
