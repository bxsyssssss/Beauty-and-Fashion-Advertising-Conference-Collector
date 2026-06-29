"""콘텐츠 자동 수집 스크립트.

수집 소스:
  - 유튜브 Data API v3 (패션·뷰티 인기 급상승)

API 키 발급: https://console.cloud.google.com
  → YouTube Data API v3 활성화 → API 키 발급

실행: python scripts/fetch_content.py
"""
from __future__ import annotations
import json
import os
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "content.json"

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")  # 환경변수 또는 직접 입력

FASHION_CHANNEL_KEYWORDS = ["패션 하울", "OOTD", "코디 추천", "무신사", "스타일링"]
BEAUTY_CHANNEL_KEYWORDS  = ["메이크업 튜토리얼", "스킨케어 루틴", "올리브영 추천", "뷰티 하울", "K-beauty"]


def fetch_youtube(query: str, category: str, max_results: int = 5) -> list[dict]:
    try:
        import requests
        url = "https://www.googleapis.com/youtube/v3/search"
        params = {
            "part": "snippet",
            "q": query,
            "type": "video",
            "order": "viewCount",
            "regionCode": "KR",
            "relevanceLanguage": "ko",
            "maxResults": max_results,
            "key": YOUTUBE_API_KEY,
        }
        resp = requests.get(url, params=params, timeout=10)
        if resp.status_code != 200:
            print(f"  YouTube API 오류: {resp.status_code}")
            return []
        items = []
        for item in resp.json().get("items", []):
            snip = item["snippet"]
            video_id = item["id"].get("videoId", "")
            items.append({
                "id": video_id,
                "title": snip.get("title", ""),
                "channel": snip.get("channelTitle", ""),
                "thumbnail_url": snip.get("thumbnails", {}).get("medium", {}).get("url", ""),
                "views": "수집 중",
                "published_at": snip.get("publishedAt", "")[:10],
                "url": f"https://www.youtube.com/watch?v={video_id}",
                "category": category,
            })
        return items
    except Exception as e:
        print(f"  YouTube 오류: {e}")
        return []


def fetch_all_youtube() -> dict:
    if not YOUTUBE_API_KEY:
        print("  ⚠️  YOUTUBE_API_KEY 없음 → 샘플 데이터 유지")
        return _youtube_fallback()

    print("  ▶ 패션 콘텐츠 수집 중...")
    fashion = []
    for kw in FASHION_CHANNEL_KEYWORDS[:2]:
        fashion.extend(fetch_youtube(kw, "패션", max_results=3))

    print("  💄 뷰티 콘텐츠 수집 중...")
    beauty = []
    for kw in BEAUTY_CHANNEL_KEYWORDS[:2]:
        beauty.extend(fetch_youtube(kw, "뷰티", max_results=3))

    return {"fashion": fashion[:6], "beauty": beauty[:6]}


def _youtube_fallback() -> dict:
    return {
        "fashion": [
            {
                "id": "sample_f1",
                "title": "2026 여름 패션 하울 | 무신사·H&M 쇼핑",
                "channel": "StyleByJinju",
                "thumbnail_url": "",
                "views": "128,000",
                "published_at": str(datetime.now().date()),
                "url": "https://youtube.com",
                "category": "패션",
            }
        ],
        "beauty": [
            {
                "id": "sample_b1",
                "title": "요즘 핫한 글로우 메이크업 풀 튜토리얼",
                "channel": "뷰티크리에이터민지",
                "thumbnail_url": "",
                "views": "234,000",
                "published_at": str(datetime.now().date()),
                "url": "https://youtube.com",
                "category": "뷰티",
            }
        ],
    }


def main():
    print("🎬 콘텐츠 수집 시작...")
    youtube = fetch_all_youtube()
    result = {
        "last_updated": datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
        "youtube": youtube,
    }
    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✅ 콘텐츠 수집 완료 → {OUT}")


if __name__ == "__main__":
    main()
