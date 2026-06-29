#!/bin/bash
# 전체 수집 → JSON 변환 → GitHub 푸시
# 실행: bash scripts/collect_and_push.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
WORKSHOP_DIR="$HOME/Downloads/class101-ref-collector-workshop"

echo ""
echo "═══════════════════════════════════════"
echo "  광고 레퍼런스 수집기 — 전체 수집 시작"
echo "═══════════════════════════════════════"
echo ""

# 1. Meta 광고 수집 (워크샵 스크래퍼)
echo "📢 [1/4] Meta 광고 수집 중..."
if [ -d "$WORKSHOP_DIR" ]; then
  cd "$WORKSHOP_DIR"
  source .venv/bin/activate 2>/dev/null || true
  python scraper/main.py --mode both
  cp data/ads.db "$ROOT/data/ads.db"
  deactivate 2>/dev/null || true
  echo "   ✅ 완료"
else
  echo "   ⚠️  워크샵 폴더 없음, 광고 수집 건너뜀"
fi

cd "$ROOT"

# 2. 광고 DB → JSON 변환
echo ""
echo "📦 [2/4] 광고 데이터 변환 중..."
python3 scripts/export_to_json.py
echo "   ✅ 완료"

# 3. 트렌드 수집
echo ""
echo "🔍 [3/4] 트렌드 수집 중..."
pip install pytrends requests beautifulsoup4 -q
python3 scripts/fetch_trends.py
echo "   ✅ 완료"

# 4. 콘텐츠 수집 (YouTube)
echo ""
echo "🎬 [4/4] 콘텐츠 수집 중..."
python3 scripts/fetch_content.py
echo "   ✅ 완료"

# GitHub 푸시
echo ""
echo "📤 GitHub 업로드 중..."
git add data/ads.json data/trends.json data/content.json
git diff --cached --quiet && echo "   변경사항 없음" && exit 0
git commit -m "수집 업데이트 $(date '+%Y-%m-%d %H:%M')"
git push origin main

echo ""
echo "═══════════════════════════════════════"
echo "  🎉 완료! 1~2분 후 웹사이트에 반영됩니다."
echo "  🔗 https://beauty-and-fashion-advertising-conf-gules.vercel.app"
echo "═══════════════════════════════════════"
echo ""
