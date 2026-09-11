# Teaching Tools 交接档

> 开工先读 `PROGRESS.md`；只有确定要继续某个工具后，才进入该目录读取 `handoff.md` 和源码。

## ⏯️ 目前做到哪

**本次（2026-09-11，从 `kongsi-idea/` 那边的对话带出来的）**：发现历史上 13 个 `tahunN-科目-单元` 工具的 Vercel 项目意外分裂在两个 Team——`kongsi-idea` 团队里是乱码域名分身，`mr007's projects`（老师口中「yquan77」）才是干净域名的正版。已用 Vercel API 的 project-transfer 把正版全部转移进 `kongsi-idea` 团队、删掉分身，域名一个没变，逐一 curl 验证过。`tahun2-mt-wang` 转移后 GitHub 自动部署断线了（老师需要自己去 Dashboard 重连，这步要 OAuth 没法远端代做）。详见 `agents.md` 新增的 Vercel Team 那条，跟 `../kongsi-idea/handoff.md` 本次条目。这次没有碰任何工具的源码/内容。

上次：新增并上架了 `tahun1-bc-juxing`（句型跳跳队）——全平台第一个摄像头体感游戏，DSKP 5.4.1 陈述/疑问/祈使/感叹句功能。完整走完新工具流程：诊断缺口（PROGRESS.md 发现华文 5.4.1 是空白）→ 核对课本内容（发现 DSKP 术语与课本实际教法有落差）→ EnterPlanMode 走一轮（涉及摄像头隐私红线、MediaPipe 技术选型）→ 视觉风格抽新方向（运动会信号旗风）→ 开发（Vite+React+MediaPipe PoseLandmarker）→ 本机实测确认 → 部署上架（Vercel + Hub 登记）。过程中把这套流程的通用部分合并进全局 skill `~/.claude/skills/newtool`（原本另外建了一份项目级重复 skill，发现冲突后已删除，只留 newtool 一份权威版本）。

状态系统本身没变动：
- `PROGRESS.md`：给人和 Agent 查询的完整总览。
- `tools-status.json`：人工维护满意度、已知问题和下一步。
- `npm run status:sync`：同时生成 `PROGRESS.md`、`README.md` 和 `../kongsi-idea/docs/tools-status.md`，本次新工具上架已跑过。

## 🚦 目前状态

- 本机工具目录：18
- 已上架：17（新增 `tahun1-bc-juxing`）
- 开发中：1（`tahun1-bc-chongzu`，已确认搁置）
- 尚待记录明确满意度：16
- `tahun1-bc-juxing` 已核对课本内容，但**马来文官方 DSKP 用词还没查证**，暂未收录进 `kongsi-idea/data/dskp-index.js`（见该工具自己的 `handoff.md`）

## ➡️ 下一步

1. 收集 `tahun1-bc-juxing` 课堂实测反馈，尤其 3 人以上摄像头侦测的实际稳定性（换 CPU delegate 后待课堂验证）。
2. 查证 DSKP 5.4/5.4.1 的官方马来文用词，核对过再补进 `kongsi-idea/data/dskp-index.js`。
3. 决定 `tahun1-bc-chongzu` 是继续完成还是暂停／放弃；若继续，先补该工具的 `handoff.md`。
4. 工具实际课堂使用后，将 `tools-status.json` 中的“待评估”逐项改成“满意／待观察／需优化”。
5. **`tahun2-mt-wang` 的 GitHub 自动部署已断线**（09-11 Vercel Team 转移的代价），老师之后碰这个工具、发现 push 没自动上线，提醒他去 Dashboard 重连 Git。
6. 以后新建 `tahunN-*` 工具，`vercel` 部署记得 `--scope kongsi-idea`，避免又散到别的 team 去（见 `agents.md`）。

## ⚠️ 注意事项

- 不要直接手改 `PROGRESS.md`、`README.md` 或 Hub 的 `docs/tools-status.md`；修改来源资料后运行 `npm run status:sync`。
- 同步状态不等于发布。公开上架仍须完成 DSKP 核对、测试、部署、截图和 Hub `TOOLS` 登记。
- `.DS_Store` 不属于专案资料，不要提交。
- **Vercel 项目跨 Team 转移会断 GitHub 自动部署**（除非目标 team 刚好已经有同一个 GitHub 凭证）；转移前先查该工具的 `link` 字段是不是 `github` 类型，有的话转移后要提醒老师手动重连。

## 🕐 最后更新

- 时间：2026-09-11
- 更新者：Claude Sonnet 5 @ MacBook Air M3
- Git push：✅ 已推（见下方 commit）
