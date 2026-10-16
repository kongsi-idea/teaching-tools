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
  console.error('用法：npm run new -- tahun{年级}-{科目}-{单元关键词}[-{玩法词}] "工具中文名"');
  console.error("slug 规则（2026-10-17，只管新工具）：单元关键词取 DSKP 用词；同单元已有工具才加玩法词 practice/quiz/duel/explore/build/lab/write；不放月份，不用数字后缀；详见 agents.md「新工具资料夹（slug）命名」。");
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

## 📋 上架前要备齐（Hub 登记在 kongsi-idea/data/tools.js，规则见 teaching-tools/agents.md）
- [ ] \`standards\` 能解析出主题（主题标在 dskp-index.js 节点上，同一内容跨年级同一个词；综合复习等例外才用 \`topicOverride\`）
- [ ] \`modes\`（全班投影／上台对战／各自练习／回家练习，1–3 个，第一个是主要方式）
- [ ] 缩略图 4 张：封面（看得到教的内容）→ 玩法 → 答对／答错反馈 → 老师端；按 4:3 截
- [ ] 展示名带内容词，同年级套路词不重复；slug／展示名不放月份
- [ ] 复习卷：\`collection\`／\`setLabel\` 并登记 TOOL_COLLECTIONS
- [ ] 要老师后台：data/teacher/{slug}.js ＋ TEACHER_TOOLS（不再复制 *-admin.html）

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
