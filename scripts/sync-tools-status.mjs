import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const teachingRoot = path.resolve(scriptDir, "..");
const hubRoot = path.resolve(teachingRoot, "../kongsi-idea");
const appPath = path.join(hubRoot, "app.js");
const dskpPath = path.join(hubRoot, "data/dskp-index.js");
const coveragePath = path.join(hubRoot, "docs/published-tools-coverage.md");
const overridesPath = path.join(teachingRoot, "tools-status.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function extractArrayConstant(file, constantName) {
  const source = fs.readFileSync(file, "utf8");
  const marker = `const ${constantName} =`;
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) throw new Error(`在 ${file} 找不到 ${marker}`);

  const arrayStart = source.indexOf("[", markerIndex + marker.length);
  if (arrayStart < 0) throw new Error(`在 ${file} 找不到 ${constantName} 的数组`);

  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let i = arrayStart; i < source.length; i += 1) {
    const char = source[i];
    const next = source[i + 1];

    if (lineComment) {
      if (char === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        i += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }
    if (char === "/" && next === "/") {
      lineComment = true;
      i += 1;
      continue;
    }
    if (char === "/" && next === "*") {
      blockComment = true;
      i += 1;
      continue;
    }
    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "[") depth += 1;
    if (char === "]") {
      depth -= 1;
      if (depth === 0) {
        return vm.runInNewContext(`(${source.slice(arrayStart, i + 1)})`, Object.create(null));
      }
    }
  }
  throw new Error(`${constantName} 数组没有正确结束`);
}

function safeCell(value) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value).replaceAll("|", "／").replaceAll("\n", "<br>");
}

function latestGitDate(directory) {
  if (!fs.existsSync(path.join(directory, ".git"))) return null;
  try {
    return execFileSync("git", ["-C", directory, "log", "-1", "--format=%cs"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim() || null;
  } catch {
    return null;
  }
}

function inferFromSlug(slug) {
  const match = slug.match(/^tahun(\d+)-([a-z]+)-(.+)$/);
  return match
    ? { tahun: Number(match[1]), subjek: match[2] }
    : { tahun: null, subjek: null };
}

function resolveDskp(tool, dskpIndex) {
  if (!tool?.standards?.length) {
    return { label: "待核对", valid: false, reason: "没有 DSKP 引用" };
  }

  const labels = [];
  for (const standard of tool.standards) {
    const record = dskpIndex.find(
      (item) =>
        item.curriculum === standard.curriculum &&
        item.tahun === tool.tahun &&
        item.subjek === tool.subjek,
    );
    const unit = record?.units.find((item) => item.code === standard.unitCode);
    if (!record || !unit) {
      return {
        label: `⚠️ 引用异常：${standard.unitCode} — ${(standard.objectiveCodes || []).join("/")}`,
        valid: false,
        reason: `DSKP_INDEX 找不到单元 ${standard.unitCode}`,
      };
    }
    const missing = (standard.objectiveCodes || []).filter(
      (code) => !unit.objectives.some((objective) => objective.code === code),
    );
    if (missing.length) {
      return {
        label: `⚠️ 引用异常：${unit.code} ${unit.title_zh} — ${missing.join("/")}`,
        valid: false,
        reason: `DSKP_INDEX 找不到学习目标 ${missing.join(", ")}`,
      };
    }
    labels.push(
      `${unit.code} ${unit.title_zh} — ${(standard.objectiveCodes || []).join("/")}`,
    );
  }
  return { label: labels.join("；"), valid: true, reason: null };
}

function renderReadme(publishedTools) {
  const rows = publishedTools
    .map(
      (tool) =>
        `| \`${tool.slug}\` | ${safeCell(tool.title)} | \`${tool.slug}/\`${tool.slug === "tahun2-mt-wang" ? "（互动网页在 `app/`）" : ""} | ${safeCell(tool.url)} |`,
    )
    .join("\n");

  return `# Teaching Tools：本机工具清单

> 本文件由 \`npm run status:sync\` 自动生成，请不要直接手改表格。
> 查询全部工具的开发状态、DSKP、满意度、已知问题与下一步，请看 [PROGRESS.md](PROGRESS.md)。

所有工具均独立维护、独立 Git、独立 Vercel 部署；平台入口与课程索引在 [课堂点子铺 Hub](../kongsi-idea/)。

| slug | 工具 | 本机路径 | 网址 |
|---|---|---|---|
${rows}
`;
}

function renderProgress(records, subjects, coverageText, generatedAt) {
  const published = records.filter((record) => record.lifecycle === "已上架");
  const developing = records.filter((record) => record.lifecycle === "开发中");
  const paused = records.filter((record) => record.lifecycle === "暂停");
  const needsWork = records.filter((record) => record.quality === "需优化");
  const pendingReview = records.filter((record) => record.quality === "待评估");
  const missingHandoff = records.filter((record) => !record.hasHandoff);
  const hubMismatch = records.filter(
    (record) =>
      record.lifecycle === "已上架" &&
      (!record.inCoverage || !record.dskp.valid),
  );

  const actionRecords = records.filter(
    (record) =>
      record.lifecycle !== "已上架" ||
      record.quality === "需优化" ||
      (record.lifecycle === "已上架" && (!record.inCoverage || !record.dskp.valid)),
  );

  const actionRows = actionRecords.length
    ? actionRecords
        .map(
          (record) =>
            `| \`${record.slug}\` | ${record.lifecycle} | ${record.quality} | ${safeCell(record.knownIssues.join("；"))} | ${safeCell(record.nextStep)} |`,
        )
        .join("\n")
    : "| — | — | — | 目前没有已登记的待处理项目 | — |";

  const lifecycleOrder = { 开发中: 0, 暂停: 1, 已上架: 2, 已归档: 3 };
  const rows = [...records]
    .sort(
      (a, b) =>
        (lifecycleOrder[a.lifecycle] ?? 9) - (lifecycleOrder[b.lifecycle] ?? 9) ||
        (a.tahun ?? 99) - (b.tahun ?? 99) ||
        String(a.subjek).localeCompare(String(b.subjek)) ||
        a.slug.localeCompare(b.slug),
    )
    .map((record) => {
      const hubState =
        record.lifecycle === "已上架"
          ? record.inCoverage && record.dskp.valid
            ? "已同步"
            : "资料异常"
          : record.hubTool
            ? "Hub 已有登记"
            : "未上架，不需同步";
      return `| \`${record.slug}\` | ${safeCell(record.title)} | ${record.tahun ? `Tahun ${record.tahun}` : "—"} | ${safeCell(record.subjectTitle)} | ${safeCell(record.dskp.label)} | ${record.lifecycle} | ${record.quality} | ${safeCell(record.version)} | ${hubState} | ${record.hasHandoff ? "有" : "无"} | ${safeCell(record.knownIssues.join("；"))} | ${safeCell(record.nextStep)} | ${safeCell(record.lastUpdated)} |`;
    })
    .join("\n");

  const coverageRows = [1, 2, 3, 4, 5, 6]
    .map((tahun) => {
      const groups = subjects
        .map((subject) => {
          const tools = published.filter(
            (record) => record.tahun === tahun && record.subjek === subject.code,
          );
          return tools.length
            ? `${subject.title_zh} ${tools.length} 个（${tools.map((tool) => tool.title).join("、")}）`
            : null;
        })
        .filter(Boolean);
      return `| Tahun ${tahun} | ${groups.length ? groups.join("；") : "目前没有已上架工具"} |`;
    })
    .join("\n");

  const coverageCount = records.filter(
    (record) => record.lifecycle === "已上架" && record.inCoverage,
  ).length;

  return `# Teaching Tools 全部工具状态总览

> **这是查询全部工具状态的唯一入口。**
> 本文件由 \`npm run status:sync\` 根据本机工具目录、\`tools-status.json\`、Hub 的 \`TOOLS\` 与 \`DSKP_INDEX\` 自动生成，请不要直接修改表格。
> 要改变满意度、已知问题或下一步，请编辑 [tools-status.json](tools-status.json)，然后重新同步。

## 一眼看懂目前状态

- 本机工具目录：**${records.length}**
- 已上架：**${published.length}**
- 开发中：**${developing.length}**
- 暂停：**${paused.length}**
- 已明确需要优化：**${needsWork.length}**
- 尚待逐项评估满意度：**${pendingReview.length}**
- 缺少工具级 \`handoff.md\`：**${missingHandoff.length}**
- 已上架但 Hub/DSKP 登记异常：**${hubMismatch.length}**
- Hub 已上架覆盖表登记：**${coverageCount}/${published.length}**

> “待评估”不等于满意，只表示目前还没有正式记录你的判断。每次实际使用或想到不满意之处，都应更新 \`tools-status.json\`。

## 下一步从哪里开始

| slug | 开发状态 | 品质状态 | 已知问题／卡点 | 下一步 |
|---|---|---|---|---|
${actionRows}

## 全部工具主表

| slug | 名称 | 年级 | 科目 | DSKP 涵盖 | 开发状态 | 品质状态 | 版本 | Hub 同步 | handoff | 已知问题／不满意 | 下一步 | 最后更新 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
${rows}

## 年级 × 科目快速覆盖

| 年级 | 已上架工具 |
|---|---|
${coverageRows}

## 快速查询方法

- 问“现在该继续哪个工具”：先看“下一步从哪里开始”。
- 问“一年级有什么工具”：看“年级 × 科目快速覆盖”，需要 DSKP 细节再看主表。
- 问“哪些工具还不满意”：筛选主表的“品质状态＝需优化／待观察／待评估”。
- 问“哪些做到一半”：筛选“开发状态＝开发中／暂停”。
- 只有真正继续修改某个工具时，才进入该目录读取 \`handoff.md\` 和源码。

## 状态怎样自动同步

1. 新建、修改、暂停、恢复、测试或上架任何工具后，运行：

   \`\`\`bash
   cd /Users/yquanloo/Documents/my-agent/teaching-tools
   npm run status:sync
   \`\`\`

2. 脚本会自动扫描所有 \`tahun*\` 目录；新目录即使尚未登记 Hub，也会进入本表并标成“开发中／待评估”。
3. 同时更新：
   - 本文件；
   - \`teaching-tools/README.md\` 已上架清单；
   - \`kongsi-idea/docs/tools-status.md\` Hub 端状态镜像。
4. 把工具真正发布到 Hub 仍然需要人工确认教学质量、DSKP、网址与截图；同步脚本不会擅自发布半成品。

## 资料职责

- \`tools-status.json\`：满意度、已知问题、下一步等人工判断。
- \`kongsi-idea/app.js\` 的 \`TOOLS\`：Hub 实际发布资料。
- \`kongsi-idea/data/dskp-index.js\`：DSKP 正式索引。
- \`kongsi-idea/docs/published-tools-coverage.md\`：已上架覆盖分析；当前脚本只检查是否有登记，不覆盖其中的人工分析文字。
- 单个工具的 \`handoff.md\`：正在开发或需要继续处理时的详细交接。

## 最后同步

- 时间：${generatedAt}
- Hub 覆盖文件可读取：${coverageText ? "是" : "否"}
`;
}

function renderHubMirror(progressContent) {
  return progressContent
    .replace(
      "# Teaching Tools 全部工具状态总览",
      "# 课堂点子铺：全部教学工具状态镜像",
    )
    .replace(
      "> **这是查询全部工具状态的唯一入口。**",
      "> 本文件由 `../teaching-tools/PROGRESS.md` 的同一同步流程自动生成；权威入口仍是 `teaching-tools/PROGRESS.md`。",
    )
    .replaceAll(
      "[tools-status.json](tools-status.json)",
      "[tools-status.json](../../teaching-tools/tools-status.json)",
    );
}

const statusConfig = readJson(overridesPath);
const overrides = statusConfig.tools || {};
const hubTools = extractArrayConstant(appPath, "TOOLS");
const subjects = extractArrayConstant(appPath, "SUBJECTS");
const dskpIndex = extractArrayConstant(dskpPath, "DSKP_INDEX");
const coverageText = fs.existsSync(coveragePath)
  ? fs.readFileSync(coveragePath, "utf8")
  : "";

const subjectByCode = Object.fromEntries(subjects.map((subject) => [subject.code, subject]));
const hubBySlug = new Map(hubTools.map((tool) => [tool.slug, tool]));
const directories = fs
  .readdirSync(teachingRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && /^tahun\d+-[a-z]+-.+/.test(entry.name))
  .map((entry) => entry.name);

const records = directories.map((slug) => {
  const directory = path.join(teachingRoot, slug);
  const hubTool = hubBySlug.get(slug) || null;
  const override = overrides[slug] || {};
  const inferred = inferFromSlug(slug);
  const tahun = hubTool?.tahun ?? inferred.tahun;
  const subjek = hubTool?.subjek ?? inferred.subjek;
  const latestChangelogDate = hubTool?.changelog?.length
    ? [...hubTool.changelog].map((item) => item.date).sort().at(-1)
    : null;

  return {
    slug,
    directory,
    hubTool,
    title: override.title || hubTool?.title_zh || slug,
    tahun,
    subjek,
    subjectTitle: subjectByCode[subjek]?.title_zh || subjek || "待补",
    lifecycle:
      override.lifecycle ||
      (hubTool?.status === "published" && hubTool?.url ? "已上架" : "开发中"),
    quality: override.quality || "待评估",
    version: hubTool?.version || "—",
    url: hubTool?.url || "",
    knownIssues: Array.isArray(override.knownIssues) ? override.knownIssues : [],
    nextStep: override.nextStep || "补充状态与下一步",
    lastUpdated:
      override.lastUpdated ||
      latestChangelogDate ||
      latestGitDate(directory) ||
      "待补",
    hasHandoff: fs.existsSync(path.join(directory, "handoff.md")),
    hasAgents: fs.existsSync(path.join(directory, "agents.md")),
    hasGit: fs.existsSync(path.join(directory, ".git")),
    inCoverage: coverageText.includes(`\`${slug}\``),
    dskp: resolveDskp(hubTool, dskpIndex),
  };
});

const untrackedOverrides = Object.keys(overrides).filter(
  (slug) => !directories.includes(slug),
);
if (untrackedOverrides.length) {
  console.warn(`警告：tools-status.json 有不存在的目录：${untrackedOverrides.join(", ")}`);
}

const untrackedHubTools = hubTools.filter((tool) => !directories.includes(tool.slug));
if (untrackedHubTools.length) {
  console.warn(`警告：Hub 有登记但本机没有目录：${untrackedHubTools.map((tool) => tool.slug).join(", ")}`);
}

const generatedAt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kuala_Lumpur",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
}).format(new Date());

const progressContent = renderProgress(records, subjects, coverageText, generatedAt);
const publishedRecords = records
  .filter((record) => record.lifecycle === "已上架")
  .sort(
    (a, b) =>
      (a.tahun ?? 99) - (b.tahun ?? 99) ||
      String(a.subjek).localeCompare(String(b.subjek)) ||
      a.slug.localeCompare(b.slug),
  );

fs.writeFileSync(path.join(teachingRoot, "PROGRESS.md"), progressContent);
fs.writeFileSync(path.join(teachingRoot, "README.md"), renderReadme(publishedRecords));
fs.writeFileSync(
  path.join(hubRoot, "docs/tools-status.md"),
  renderHubMirror(progressContent),
);

console.log(`已同步 ${records.length} 个本机工具：${publishedRecords.length} 个已上架。`);
console.log("已更新 teaching-tools/PROGRESS.md");
console.log("已更新 teaching-tools/README.md");
console.log("已更新 kongsi-idea/docs/tools-status.md");
