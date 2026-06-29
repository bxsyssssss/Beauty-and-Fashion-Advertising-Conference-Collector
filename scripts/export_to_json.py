"""SQLite DB → ads.json 변환 스크립트.

워크샵 프로젝트의 ads.db를 읽어서 웹사이트용 ads.json을 만들어요.
실행: python scripts/export_to_json.py
"""
import json
import sqlite3
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "ads.db"
OUT_PATH = ROOT / "data" / "ads.json"

# 워크샵 config에서 카테고리 정보 읽기
CONFIG_PATH = ROOT / "config.json"


def get_category_map() -> dict[str, str]:
    """config.json에서 page_id → category 매핑 읽기."""
    if not CONFIG_PATH.exists():
        return {}
    try:
        cfg = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
        return {
            str(c.get("page_id", "")): c.get("category", "")
            for c in cfg.get("competitors", [])
            if c.get("page_id") and c.get("page_id") != "FILL_IN"
        }
    except Exception:
        return {}


def extract_media(raw_json_str: str) -> tuple[str, str | None]:
    """raw_json에서 thumbnail_url, video_url 추출."""
    thumbnail_url = ""
    video_url = None
    try:
        node = json.loads(raw_json_str) if raw_json_str else {}
        snapshot = node.get("snapshot") or {}
        videos = snapshot.get("videos") or []
        images = snapshot.get("images") or []

        if videos and isinstance(videos[0], dict):
            v = videos[0]
            thumbnail_url = v.get("video_preview_image_url") or ""
            video_url = v.get("video_hd_url") or v.get("video_sd_url") or None

        elif images and isinstance(images[0], dict):
            thumbnail_url = (
                images[0].get("original_image_url")
                or images[0].get("url")
                or ""
            )
    except Exception:
        pass
    return thumbnail_url, video_url


def main():
    if not DB_PATH.exists():
        print(f"❌ DB 파일 없음: {DB_PATH}")
        print("   워크샵 프로젝트에서 먼저 수집을 실행하세요.")
        sys.exit(1)

    category_map = get_category_map()

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        "SELECT * FROM ads ORDER BY start_date DESC, first_seen_at DESC"
    ).fetchall()
    conn.close()

    ads = []
    for r in rows:
        d = dict(r)
        thumbnail_url, video_url = extract_media(d.get("raw_json") or "")

        # media_paths에서 preview 이미지 경로 보조
        if not thumbnail_url:
            try:
                paths = json.loads(d.get("media_paths") or "[]")
                for p in paths:
                    if "preview_" in p or "image_" in p:
                        thumbnail_url = ""  # 로컬 경로는 웹에서 쓸 수 없음
                        break
            except Exception:
                pass

        page_id = str(d.get("page_id") or "")
        ads.append({
            "ad_id": str(d.get("ad_id") or ""),
            "page_id": page_id,
            "page_name": d.get("page_name") or "",
            "category": category_map.get(page_id, ""),
            "caption": d.get("caption") or "",
            "cta_text": d.get("cta_text") or "",
            "landing_url": d.get("landing_url") or "",
            "thumbnail_url": thumbnail_url,
            "video_url": video_url,
            "start_date": d.get("start_date"),
            "active_days": d.get("active_days"),
            "is_active": bool(d.get("is_active")),
            "has_video": bool(d.get("has_video")),
            "platforms": json.loads(d.get("platforms") or "[]"),
            "library_url": f"https://www.facebook.com/ads/library/?id={d.get('ad_id') or ''}",
        })

    result = {
        "last_updated": datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
        "ads": ads,
    }

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✅ 완료: {len(ads)}개 광고 → {OUT_PATH}")


if __name__ == "__main__":
    main()
