#!/bin/zsh
# 把 deploy.yml 放进指定工具的仓库并 push。用法：scripts/add-actions.sh <slug>...  （没给 slug 就是全部已部署工具）
# 只在 VERCEL_TOKEN 已存进 GitHub 组织 Secret 后才跑，否则每次 push 都会红灯。
root=$(cd "$(dirname "$0")/.." && pwd)
tpl="$root/scripts/deploy.yml.template"
slugs=("$@"); [ ${#slugs[@]} -gt 0 ] || slugs=($(cd $root; ls -d tahun*/ | tr -d / ; echo tahun1to6-drone))
for slug in $slugs; do
  d="$root/$slug"; [ -d "$d" ] || d="$HOME/Documents/my-projects/$slug"; [ "$slug" = tahun1to6-drone ] && d="$HOME/Documents/my-projects/drone-soccer"
  [ -f "$d/.vercel/project.json" ] || { echo "$slug SKIP 没部署过"; continue; }
  [ -f "$d/.github/workflows/deploy.yml" ] && { echo "$slug SKIP 已有"; continue; }
  org=$(python3 -c "import json;print(json.load(open('$d/.vercel/project.json'))['orgId'])")
  pid=$(python3 -c "import json;print(json.load(open('$d/.vercel/project.json'))['projectId'])")
  mkdir -p "$d/.github/workflows"
  sed "s/__ORG_ID__/$org/; s/__PROJECT_ID__/$pid/" "$tpl" > "$d/.github/workflows/deploy.yml"
  (cd $d; git add .github/workflows/deploy.yml && git commit -q -m "ci: push 到 main 自动部署（GitHub Actions）

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" && git push -q 2>&1 | tail -1; echo "$slug ok")
done
