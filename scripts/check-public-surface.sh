#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

BLOCKED_REGEX='AGENT_CONTEXT|Codex|OpenAI|ChatGPT|AI[ -]generated|(^|[^[:alnum:]_])GPT([^[:alnum:]_]|$)'

matches=0
found_files=0
while IFS= read -r file; do
  found_files=1
  if rg -n -i --pcre2 "$BLOCKED_REGEX" "$file" >/tmp/astro-sdk-public-scan.out 2>/dev/null; then
    echo "Blocked public-surface marker found in $file"
    cat /tmp/astro-sdk-public-scan.out
    matches=1
  fi
done <<EOF
$(git ls-files \
  '*.md' '*.html' '*.htm' '*.yaml' '*.yml' '*.json' '*.js' '*.ts' '*.css' '*.txt' \
  ':!:docs/assets/*.woff2' \
  ':!:docs/*.png' \
  ':!:docs/*.svg')
EOF

rm -f /tmp/astro-sdk-public-scan.out

if ((found_files == 0)); then
  echo "No tracked public text files found."
  exit 0
fi

if ((matches)); then
  exit 1
fi

echo "Public surface check passed."
