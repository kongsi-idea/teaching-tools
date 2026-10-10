# Teaching Tools 交接档

> 开工先读 `PROGRESS.md`；只有确定要继续某个工具后，才进入该目录读取 `handoff.md` 和源码。

## ⏯️ 目前做到哪

**2026-10-10：建立「磨合复盘」机制**
- 新增 `_retro/`（做工具的磨合记录，累积用、平时不读，说明见 `_retro/README.md`），含 10-03～10-10 一周回填。收工时 `shutdown` 的 L1.6 步骤会写新的一份。
- 因此改了 `~/.claude/skills/newtool/SKILL.md`（关口 ① 每次问使用场景、关口 ① 后的 Opus 规划→Sonnet 实作分工、交付前对照承诺清单、时刻写「5 时」、命名分两层）和 `agents.md`（slug／展示名规则）。`~/.claude/` 没有备份。
- 另装了 `UserPromptSubmit` hook（`~/.claude/hooks/shutdown-nudge.py`）：老师说收工类短句时提醒 agent 先读 shutdown skill。
- 工具清单以 `PROGRESS.md`（自动生成）为准；下面「目前状态」的数字已过期（10-09～10 新增体育打卡一／二年级、量词 liangci1、标点＋疑问词、课堂互动工具等）。
- **刻意没做**：newtool「视觉」一节按原则重整，等 `_retro/` 累到约 5 份再合订。

**2026-10-08：使用次数统计＋自动部署**
- 29 个工具入口 `index.html` 都带 `track-use.js`（规则见 `agents.md`），`npm run check` 会验。
- **push 到 main 即自动部署**：每个仓库有 `.github/workflows/deploy.yml`＋仓库级 `VERCEL_TOKEN`（token 在本机钥匙串 `vercel-actions / VERCEL_TOKEN_KONGSI`）。29 个仓库首轮运行全成功。后备：`npm run deploy -- <slug>`。新工具首次部署后要跑 `set-vercel-secret.py` ＋ `add-actions.sh`。
- `tahun2-mt-wang` 已改成与其他工具同规格；`tahun4-bc-bishun` 新建了 GitHub 私有仓库 `kongsi-idea/tahun4-bc-bishun`。
- 没做：`tahun1-mt-ruang`、`tahun1-bc-chongzu` 未部署、不在 hub，不在这次范围。
- `PROGRESS.md` 有未提交改动（自动生成，不是我改的）。

**本次（2026-10-02）**：优化全局 skill `newtool`（`~/.claude/skills/newtool/SKILL.md`，旧版备份在 `~/Documents/待删除/newtool-skill-backup-20261002/`），并新增两个脚本：`npm run new -- {slug} "中文名"`（开工脚手架）、`npm run check -- {slug|--all}`（上线后从学生那端验收）。把 juxing、tahun2-bc-bishun、tahun3-bc-bishun 登记为「待评估」。全站 `check --all` 全部通过；钱币乐园 404 已被另一个会话重新部署修好。脚本和 skill 的设计理由见 `agents.md`「两个脚本」一条与 SKILL.md 开头；新流程尚未在真实新工具上跑过一轮。

**四年级历史集锦簿电子模拟器**（09-18～25，设计讨论阶段，尚无代码）：详见 [`_planning/tahun4-sj-jijinbu/规划笔记.md`](_planning/tahun4-sj-jijinbu/规划笔记.md)，接手前先读那份。

09-11：13 个工具的 Vercel 项目统一转入 `kongsi-idea` 团队，当时 GitHub 自动部署断线；2026-10-08 已改用 GitHub Actions 取代（Vercel Git 集成对 Hobby＋私有组织仓库不可用）。

## 🚦 目前状态

- 本机工具目录：18（已上架 17／开发中 1「`tahun1-bc-chongzu`，已确认搁置」／尚待记录明确满意度 16）
- 新增一个**规划中**项目（尚未计入上面数字，因为还没有 `tahun*` 代码资料夹）：`_planning/tahun4-sj-jijinbu/` — 四年级历史集锦簿电子模拟器，设计讨论阶段
- `tahun1-bc-juxing` 已核对课本内容，但**马来文官方 DSKP 用词还没查证**，暂未收录进 `kongsi-idea/data/dskp-index.js`

## ➡️ 下一步

**四年级历史集锦簿（最优先）**：
1. 等老师补充更多学生实体作品照片（陆续放进 `~/Documents/工作档案/学生作品参考/历史集锦簿-20260918/`）。
2. 跟老师一起定案三主题的页面结构（页数/顺序）+ 插画/标题元素最终清单——尤其要问清楚「正式研究栏位（内容标准/研究目的/研究目标/研究方式）要不要强制做成独立页」这个矛盾点（真实学生作品都没做，但评分标准要求）。
3. 清单点头后才派工生成实际插画素材 + 抠图，再进 `newtool` 标准流程正式建立 `tahun4-sj-jijinbu/` 工具资料夹。

**既有工具（延续中）**：
4. 收集 `tahun1-bc-juxing` 课堂实测反馈，尤其 3 人以上摄像头侦测的实际稳定性。
5. 下次做新工具时用新流程（`npm run new` → 三关口 → `npm run check`），收工时 L1.6 写 `_retro/`；同类纠正累计两次再改 `newtool` SKILL.md。`_retro/` 累到约 5 份时做第一次合订。
5b. `tahun1to6-drone` Hub 有登记但本机 `teaching-tools/` 没有目录，查源码放哪、要不要纳管。
6. 查证 DSKP 5.4/5.4.1 的官方马来文用词，核对过再补进 `kongsi-idea/data/dskp-index.js`。
6. 决定 `tahun1-bc-chongzu` 是继续完成还是暂停／放弃。
7. 工具实际课堂使用后，将 `tools-status.json` 中的“待评估”逐项改成“满意／待观察／需优化”。
8. `tahun2-mt-wang` 的 GitHub 自动部署仍断线，老师碰到时提醒他去 Dashboard 重连。
9. 以后新建 `tahunN-*` 工具，`vercel` 部署记得 `--scope kongsi-idea`。

## ⚠️ 注意事项

- 不要直接手改 `PROGRESS.md`、`README.md` 或 Hub 的 `docs/tools-status.md`；修改来源资料后运行 `npm run status:sync`。
- 同步状态不等于发布。公开上架仍须完成 DSKP 核对、测试、部署、截图和 Hub `TOOLS` 登记。
- `.DS_Store` 不属于专案资料，不要提交。
- **Vercel 项目跨 Team 转移会断 GitHub 自动部署**（除非目标 team 刚好已经有同一个 GitHub 凭证）；转移前先查该工具的 `link` 字段是不是 `github` 类型，有的话转移后要提醒老师手动重连。

## 🕐 最后更新

- 时间：2026-10-10
- 更新者：Claude Sonnet 5.5 @ MacBook Air
- Git push：✅ 已推（2a2a4b6）
