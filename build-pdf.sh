#!/usr/bin/env bash
# Render each language deck to a 1920x1080 landscape PDF with headless Chrome.
# Usage: ./build-pdf.sh [ko|en|vi ...]   (needs a static server on :8787 → python3 -m http.server 8787)
set -euo pipefail
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
BASE="${BASE:-http://127.0.0.1:8787}"
mkdir -p pdf
for lang in "${@:-ko}"; do
  if [ "$lang" = "ko" ]; then page="index.html"; else page="$lang.html"; fi
  "$CHROME" --headless=new --disable-gpu --window-size=1920,1080 --force-device-scale-factor=1 \
    --no-pdf-header-footer --run-all-compositor-stages-before-draw --virtual-time-budget=20000 \
    --print-to-pdf="$PWD/pdf/isaac-studio-slate-$lang.pdf" "$BASE/$page?print=1" 2>/dev/null || true  # chrome exits non-zero after a successful print
  echo "pdf/isaac-studio-slate-$lang.pdf  $(du -h "pdf/isaac-studio-slate-$lang.pdf" | cut -f1)"
done
