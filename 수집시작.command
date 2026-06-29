#!/bin/bash
# 이 파일을 더블클릭하면 광고·트렌드·콘텐츠를 자동 수집하고 웹사이트에 반영합니다

cd "$(dirname "$0")"

# 터미널 창 열기
osascript -e 'tell app "Terminal" to activate'

echo ""
echo "╔════════════════════════════════════════╗"
echo "║   뷰티·패션 탐색기 — 수집 시작          ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Python 가상환경 및 의존성
if [ ! -d ".venv" ]; then
  echo "📦 처음 실행 — 필요한 패키지 설치 중..."
  python3 -m venv .venv
  source .venv/bin/activate
  pip install pytrends requests beautifulsoup4 -q
else
  source .venv/bin/activate 2>/dev/null || true
fi

bash scripts/collect_and_push.sh

echo ""
echo "창을 닫으셔도 됩니다."
read -p "아무 키나 누르면 닫힙니다..." -n1
