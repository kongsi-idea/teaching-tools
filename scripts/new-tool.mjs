#!/usr/bin/env node
// 新工具开工：建目录、.gitignore、handoff.md、tools-status.json 登记，再跑 status:sync。
// 用法：npm run new -- tahun1-bc-xxx "工具中文名"
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [slug, title] = process.argv.slice(2);

if (!slug || !/^tahun[1-6]-[a-z]+-[a-z0-9-]+$/.test(slug) || !title) {
  console.error('用法：npm run new -- tahun{年级}-{科目}-{单元} "工具中文名"');
  process.exit(1);
}

const dir = path.join(root, slug);
if (fs.existsSync(dir)) {
  console.error(`已存在：${dir}`);
  process.exit(1);
}

const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kuala_Lumpur" }).format(new Date());

fs.mkdirSync(dir);
fs.writeFileSync(
  path.join(dir, ".gitignore"),
  ["node_modules/", "dist/", ".vercel/", ".DS_Store", ".env*", ".playwright-output/", ""].join("\n"),
);
fs.writeFileSync(
  path.join(dir, "handoff.md"),
  `# ${title} · 交接

## ⏯️ 目前做到哪
刚开工：方案待老师确认（教学目标／学生困难假设／核心玩法）。

## 🚦 目前状态
- 课本出处：待补（页码／单元）
- DSKP 对照：待补（只写本机官方 PDF 核对过的代码）

## ➡️ 下一步
1. 老师确认方案后动工。

## ⚠️ 注意事项
- 本机测试：\`python3 -m http.server 8791 --bind 127.0.0.1\`，开 http://127.0.0.1:8791（8765 常被 Hub 本机服务占用）

## 🕐 最后更新
${today}
`,
);

const statusPath = path.join(root, "tools-status.json");
const status = JSON.parse(fs.readFileSync(statusPath, "utf8"));
status.tools[slug] = {
  title,
  // 不写 lifecycle：同步脚本会按 Hub 登记自动判定「开发中／已上架」，上架后不用回来改
  quality: "未完成",
  knownIssues: [],
  nextStep: "等老师确认方案",
  lastUpdated: today,
};
fs.writeFileSync(statusPath, `${JSON.stringify(status, null, 2)}\n`);

execFileSync("node", [path.join(root, "scripts/sync-tools-status.mjs")], { stdio: "inherit" });
console.log(`\n已建立 ${slug}/（.gitignore、handoff.md），tools-status.json 已登记（quality=未完成，上架后改「待评估」）。`);
