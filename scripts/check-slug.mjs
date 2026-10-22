#!/usr/bin/env node
// 新工具 slug 检查（规则见 agents.md「新工具资料夹（slug）命名」，2026-10-17 老师定，只管新工具）。
// 用法：npm run slug -- tahun2-mt-wang-practice     （只检查，不建档）
// npm run new 开工时也会先跑这里：有「错误」就不建档，「提醒」照样建但要看一眼。
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const PLAY_WORDS = ["practice", "quiz", "duel", "explore", "build", "lab", "write"];
// slug 科目缩写：mz＝Hub muzik；pj、pk＝Hub pjpk／pk；跨科目写 all；其余与 Hub 科目码相同
export const SUBJECT_CODES = ["bc", "bm", "bi", "mt", "dst", "am", "sains", "sejarah", "rbt", "islam", "moral", "seni", "mz", "pj", "pk", "all"];
// 会过期的词（月份、学期）。整段相等才算；华文科的拼音可能撞到 mei／jun／mac／dis，bc 不比这几个
const EXPIRING = ["januari", "februari", "mac", "april", "mei", "jun", "julai", "ogos", "september", "oktober", "november", "disember",
  "january", "february", "march", "may", "june", "july", "august", "october", "december",
  "jan", "feb", "mar", "apr", "jul", "aug", "ogo", "sep", "sept", "okt", "oct", "nov", "dis", "dec",
  "penggal", "semester", "sem", "term"];
const PINYIN_CLASH = ["mei", "jun", "mac", "dis", "mar"];

export function existingSlugs() {
  const set = new Set(fs.readdirSync(root).filter((d) => /^tahun/.test(d)));
  try {
    const hub = fs.readFileSync(path.join(root, "..", "kongsi-idea", "data", "tools.js"), "utf8");
    for (const m of hub.matchAll(/slug:\s*"([^"]+)"/g)) set.add(m[1]);
  } catch {}
  return set;
}

export function checkSlug(slug, existing = existingSlugs()) {
  const errors = [];
  const warnings = [];
  const others = [...existing].filter((s) => s !== slug);

  const m = /^tahun(\d)(?:to(\d))?-([a-z]+)-([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(slug || "");
  if (!m) {
    errors.push("格式不对：要写 tahun{年级}-{科目}-{单元关键词}[-{玩法词}]，只用小写英文字母、数字和 -，例如 tahun2-mt-wang、tahun4to6-bi-xxx。");
    return { errors, warnings };
  }
  const [, g1, g2, subj, rest] = m;
  if (+g1 < 1 || +g1 > 6 || (g2 && (+g2 < 1 || +g2 > 6 || +g2 <= +g1))) errors.push(`年级「${g2 ? g1 + "to" + g2 : g1}」不对：只能 1–6，跨年级写 tahun4to6（前小后大）。`);
  if (!SUBJECT_CODES.includes(subj)) errors.push(`科目缩写「${subj}」不在名单：${SUBJECT_CODES.join("、")}（音乐写 mz，体育 pj，健康 pk，跨科目 all）。`);

  const parts = rest.split("-");
  for (const p of parts) {
    if (EXPIRING.includes(p) && !(subj === "bc" && PINYIN_CLASH.includes(p))) errors.push(`「${p}」是月份／学期这类会过期的词，slug 不放（展示名也不放）。`);
    if (/^\d+to\d+$/.test(p)) continue; // 课本范围，如 12to22
    if (/^\d+$/.test(p) || /[a-z]\d+$/.test(p)) errors.push(`「${p}」带数字后缀（像 -2、liangci2）。同单元同玩法再来一个，改用更细的 DSKP 子项词或课本范围（如 12to22）。`);
  }

  const prefix = `tahun${g1}${g2 ? "to" + g2 : ""}-${subj}`;
  const unit = parts[0];
  const base = `${prefix}-${unit}`;
  const sameUnit = others.filter((s) => s === base || s.startsWith(base + "-"));

  if (unit === "fuxi") {
    // 复习卷例外（2026-10-19）：第三层固定 fuxi，后面接单元关键词
    if (parts.length < 2) errors.push("复习卷要写成 fuxi-{单元关键词}，例如 tahun1-mt-fuxi-pecahan-masa。");
    if (parts.slice(1).some((p) => PLAY_WORDS.includes(p))) warnings.push("复习卷后面接的是单元关键词，不是玩法词。");
    warnings.push("复习卷上架时要加 collection／setLabel，放进同年级同科目的复习卷那一组。");
    return { errors, warnings };
  }

  if (parts.length === 1) {
    if (sameUnit.length) errors.push(`同单元已经有工具（${sameUnit.join("、")}），新工具要加第四层玩法词：${PLAY_WORDS.join("／")}。`);
  } else {
    const fourth = parts[1];
    if (PLAY_WORDS.includes(fourth)) {
      if (!sameUnit.length) warnings.push(`「${base}」这个单元还没有工具，照规则用三层 ${base} 就好，玩法词是同单元已有工具时才加。（若同单元的旧工具用了别的关键词，就留着玩法词。）`);
    } else if (!/^\d+to\d+$/.test(fourth)) {
      const samePlay = sameUnit.filter((s) => PLAY_WORDS.includes(s.slice(base.length + 1)));
      warnings.push(`第四层「${fourth}」不是玩法词（${PLAY_WORDS.join("／")}）。只有同单元同玩法已经有工具时，才改用更细的 DSKP 子项词或课本范围。${samePlay.length ? `同单元现有：${samePlay.join("、")}。` : "同单元目前没有用玩法词的工具，先确认是不是该用玩法词。"}`);
    }
    if (parts.length > 2 && !parts.slice(2).every((p) => /^\d+to\d+$/.test(p))) warnings.push("超过四层了，确认真的需要。");
  }
  return { errors, warnings };
}

export function printResult(slug, { errors, warnings }) {
  for (const e of errors) console.error(`❌ ${e}`);
  for (const w of warnings) console.warn(`⚠️  ${w}`);
  if (!errors.length && !warnings.length) console.log(`✅ ${slug} 符合 slug 规则（单元关键词是不是 DSKP 用词，脚本查不了，自己对一下）。`);
  else if (!errors.length) console.log(`slug 可以用，但请看一下上面的提醒。`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const slug = process.argv[2];
  if (!slug) {
    console.error("用法：npm run slug -- tahun{年级}-{科目}-{单元关键词}[-{玩法词}]");
    process.exit(1);
  }
  const result = checkSlug(slug);
  if (existingSlugs().has(slug)) result.errors.unshift("这个 slug 已经有了（本机资料夹或 Hub 登记）。");
  printResult(slug, result);
  process.exit(result.errors.length ? 1 : 0);
}
