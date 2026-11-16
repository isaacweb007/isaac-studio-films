#!/usr/bin/env bash
# Render each language deck to a 1920x1080 landscape PDF (waits for all fonts/images).
# Usage: ./build-pdf.sh [ko|en|vi ...]   (needs a static server on :8787 → python3 -m http.server 8787)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p pdf
node tools/build-pdf.js "${@:-ko}"
for lang in "${@:-ko}"; do echo "pdf/isaac-studio-slate-$lang.pdf  $(du -h "pdf/isaac-studio-slate-$lang.pdf" | cut -f1)"; done
