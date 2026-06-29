export interface Ad {
  ad_id: string; page_id: string; page_name: string; category: string;
  caption: string; cta_text: string; landing_url: string; thumbnail_url: string;
  video_url: string | null; start_date: string | null; active_days: number | null;
  is_active: boolean; has_video: boolean; platforms: string[]; library_url: string;
}
export interface AdsData { last_updated: string; ads: Ad[]; }

export interface SeasonEvent { name: string; date: string; type: string; color: string; }
export interface TrendKeyword { rank: number; keyword: string; direction: "up" | "down"; sources: string[]; category: string; }
export interface TrendSourceItem { text: string; subtext: string; url: string; }
export interface TrendSource { name: string; emoji: string; color: string; description: string; items: TrendSourceItem[]; }
export interface TrendsData {
  last_updated: string; season_events: SeasonEvent[];
  top_keywords: TrendKeyword[]; sources: Record<string, TrendSource>;
}

export interface YoutubeItem {
  id: string; title: string; channel: string; thumbnail_url: string;
  views: string; published_at: string; url: string; category: string;
  platform?: string; region?: string;
}
export interface ContentData {
  last_updated: string;
  youtube: { fashion: YoutubeItem[]; beauty: YoutubeItem[] };
  mz_trending: { domestic: YoutubeItem[]; international: YoutubeItem[] };
}

export interface ReferenceAccount {
  id: string;
  platform: "instagram" | "youtube" | "tiktok" | "twitter" | "other";
  username: string; url: string;
  category: "패션" | "뷰티" | "전체";
  display_name: string; follower_count: string;
  last_post_date: string; added_at: string;
  memo?: string;
  region?: "국내" | "해외";
}
