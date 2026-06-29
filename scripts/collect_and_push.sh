#!/bin/bash
# 광고 수집 → JSON 변환 → GitHub 푸시 자동화 스크립트
# 실행법: bash scripts/collect_and_push.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
WORKSHOP_DIR="$HOME/Downloads/class101-ref-collector-workshop"

echo "🚀 광고 수집 시작..."

# 워크샵 폴더에서 수집 실행
if [ -d "$WORKSHOP_DIR" ]; then
  cd "$WORKSHOP_DIR"
  source .venv/bin/activate 2>/dev/null || true
  python scraper/main.py --mode both
  echo "✅ 수집 완료"

  # ads.db를 웹 프로젝트의 data 폴더로 복사
  cp data/ads.db "$ROOT/data/ads.db"
  echo "📁 DB 복사 완료"
else
  echo "⚠️  워크샵 폴더가 없어요: $WORKSHOP_DIR"
  echo "   이미 이 폴더에 ads.db가 있다면 계속 진행됩니다."
fi

cd "$ROOT"

# JSON 변환
echo "📦 JSON 변환 중..."
python3 scripts/export_to_json.py

# GitHub 푸시
echo "📤 GitHub 업로드 중..."
git add data/ads.json
git diff --cached --quiet && echo "변경사항 없음" && exit 0
git commit -m "광고 수집 $(date '+%Y-%m-%d %H:%M')"
git push origin main

echo ""
echo "🎉 완료! 1~2분 후 웹사이트에 반영됩니다."
