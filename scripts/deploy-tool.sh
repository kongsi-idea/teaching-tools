#!/bin/zsh
# 一键部署单个工具：push → 生产部署 → 确认 {slug}.vercel.app 真的指向新部署 → 线上验收
# 用法：npm run deploy -- <slug>
# 定位：GitHub Actions（.github/workflows/deploy.yml）失灵时的后备。已启用 Actions 的工具，平时 git push 即可，不必跑这支。
set -e
slug=$1
[ -n "$slug" ] || { echo "用法：npm run deploy -- <slug>"; exit 1; }
root=$(cd "$(dirname "$0")/.." && pwd)
dir="$root/$slug"
[ -d "$dir" ] || dir="$HOME/Documents/my-projects/$slug"
[ -d "$dir" ] || { [ "$slug" = "tahun1to6-drone" ] && dir="$HOME/Documents/my-projects/drone-soccer"; }   # drone 的资料夹名不同
[ -d "$dir" ] || { echo "找不到 $slug 的资料夹"; exit 1; }
cd "$dir"
grep -q 'track-use.js' index.html || { echo "❌ index.html 缺 track-use.js（使用次数统计），先补上再部署"; exit 1; }
if [ -n "$(git status --porcelain)" ]; then echo "⚠️ 有未提交的改动（会一起被部署）："; git status --short | head -8; fi
git log @{u}..HEAD --oneline | grep -q . && { echo "→ git push"; git push -q; }
echo "→ vercel deploy --prod"
out=$(vercel deploy --prod --yes --scope kongsi-idea 2>&1)
url=$(echo "$out" | grep -o "https://$(cat .vercel/project.json | python3 -c 'import json,sys;print(json.load(sys.stdin)["projectName"])')-[a-z0-9]*-kongsi-idea.vercel.app" | head -1)
[ -n "$url" ] || { echo "$out" | tail -8; echo "❌ 没拿到部署网址"; exit 1; }
echo "→ 新部署 $url"
# 手动别名不会自动跟着走；每次都确认并补切
vercel alias set "$url" "$slug.vercel.app" --scope kongsi-idea 2>&1 | tail -1
sleep 3
echo "→ 线上验收"
cd "$root" && npm run --silent check -- "$slug" 2>&1 | tail -6
