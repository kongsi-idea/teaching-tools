#!/usr/bin/env node
// 上线后验收：检查「学生实际会点到」的那一端，而不是部署命令有没有成功。
// 用法：npm run check -- tahun1-bc-xxx      单个工具（工具网址＋资源＋线上 Hub 登记＋缩图＋本机登记）
//       npm run check -- --all              全部 Hub 工具网址与资源（定期健康检查）
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hubRoot = path.join(root, "../kongsi-idea");
const HUB = "https://kongsi-idea.vercel.app";
const arg = process.argv[2];
if (!arg) {
  console.error("用法：npm run check -- <slug> | --all");
  process.exit(1);
}

async function fetchStatus(url) {
  try {
    const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(15000) });
    return { status: res.status, text: res.ok ? await res.text() : "" };
  } catch (error) {
    return { status: `ERR ${error.cause?.code || error.name}`, text: "" };
  }
}

// 页面引用的本站资源（js/css/图片/音档）逐个确认 200
async function checkPage(url, hops = 0) {
  const base = url.endsWith(".html") ? url : `${url}/`;
  const page = await fetchStatus(base);
  if (page.status !== 200) return [`页面 ${page.status}：${url}`];
  // 入口只是跳转页（如钱币乐园 → app/index.html）时，跟过去查真正的页面
  const redirect = page.text.match(/http-equiv=["']refresh["'][^>]*url=([^"'>\s]+)/i)?.[1];
  if (redirect && hops < 2) {
    return checkPage(new URL(redirect, base).href.replace(/\/$/, ""), hops + 1);
  }
  const refs = new Set(
    [...page.text.matchAll(/(?:src|href)=["']([^"'#?]+\.(?:js|mjs|css|mp3|ogg|wav|png|jpe?g|svg|webp|json|glb|gltf))["']/g)]
      .map((m) => m[1])
      .filter((ref) => !/^https?:/.test(ref) || ref.startsWith(url)),
  );
  const problems = [];
  for (const ref of refs) {
    const { status } = await fetchStatus(new URL(ref, base).href);
    if (status !== 200) problems.push(`资源 ${status}：${ref}`);
  }
  return problems;
}

function hubBlock(source, slug) {
  const start = source.indexOf(`slug: "${slug}"`);
  if (start < 0) return null;
  const end = source.indexOf("slug: \"", start + 10);
  return source.slice(start, end < 0 ? undefined : end);
}

const localApp = fs.readFileSync(path.join(hubRoot, "app.js"), "utf8");
const problems = [];

if (arg === "--all") {
  const urls = [...new Set(localApp.match(/https:\/\/[a-z0-9-]+\.vercel\.app/g))].filter((u) => u !== HUB);
  for (const url of urls) {
    const found = await checkPage(url);
    console.log(`${found.length ? "❌" : "✅"} ${url}${found.length ? `\n   ${found.join("\n   ")}` : ""}`);
    problems.push(...found);
  }
} else {
  const slug = arg;
  const local = hubBlock(localApp, slug);
  if (!local) problems.push(`本机 kongsi-idea/app.js 没有 ${slug} 的 TOOLS 登记`);
  const url = local?.match(/url: "([^"]+)"/)?.[1] || `https://${slug}.vercel.app`;
  const version = local?.match(/version: "([^"]+)"/)?.[1];

  problems.push(...(await checkPage(url)));

  const liveApp = (await fetchStatus(`${HUB}/app.js`)).text;
  const live = hubBlock(liveApp, slug);
  if (!live) problems.push(`线上 Hub 还没有 ${slug}（Hub 没部署或 alias 没切）`);
  else if (version && !live.includes(`version: "${version}"`)) problems.push(`线上 Hub 版本不是本机的 ${version}`);

  for (const [, img] of (local || "").matchAll(/img: "([^"]+)"/g)) {
    const { status } = await fetchStatus(`${HUB}/${img}`);
    if (status !== 200) problems.push(`缩图 ${status}：${img}`);
  }

  const status = JSON.parse(fs.readFileSync(path.join(root, "tools-status.json"), "utf8")).tools[slug];
  if (!status) problems.push("tools-status.json 没有登记");
  else if (status.quality === "未完成") problems.push("tools-status.json 的 quality 还是「未完成」");
  if (!fs.readFileSync(path.join(hubRoot, "docs/published-tools-coverage.md"), "utf8").includes(`\`${slug}\``))
    problems.push("published-tools-coverage.md 没有这一行");
  if (!fs.existsSync(path.join(root, slug, "handoff.md"))) problems.push("工具目录没有 handoff.md");

  console.log(`工具网址：${url}　Hub 版本：${version || "—"}`);
}

if (problems.length) {
  console.log(`\n❌ ${problems.length} 个问题：\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log("\n✅ 全部通过");
