export interface Ad {
  ad_id: string;
  page_id: string;
  page_name: string;
  category: string;
  caption: string;
  cta_text: string;
  landing_url: string;
  thumbnail_url: string;
  video_url: string | null;
  start_date: string | null;
  active_days: number | null;
  is_active: boolean;
  has_video: boolean;
  platforms: string[];
  library_url: string;
}

export interface AdsData {
  last_updated: string;
  ads: Ad[];
}
