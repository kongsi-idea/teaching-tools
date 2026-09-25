# Teaching Tools 交接档

> 开工先读 `PROGRESS.md`；只有确定要继续某个工具后，才进入该目录读取 `handoff.md` 和源码。

## ⏯️ 目前做到哪

**本次（2026-09-18～25）**：还没建工具代码，是「四年级历史集锦簿电子模拟器」的设计讨论 + 一次素材调研。定案六项范围决定（题目写死三个／不做图片上传自由字体改成预制贴纸+标题图拖拽缩放／不做站内搜索／不做存档改一键导出高清图／全四年级开放），把编辑器复杂度从「迷你 Canva」砍成「贴纸摆放器」。派 Codex（`cx.sh --tier work+`）分析了老师提供的 62 张历年学生实体作品截图，产出三主题（我的家庭／学校历史／冰河时代）各自的页面结构、插画元素清单、标题风格、版面规律。**详细脉络、六项决定的理由、调研报告路径、未决问题、下一步全部记在 [`_planning/tahun4-sj-jijinbu/规划笔记.md`](_planning/tahun4-sj-jijinbu/规划笔记.md)，这里不重复**——下次要接手这个工具，先读那份笔记。

09-11：13 个 `tahunN-科目-单元` 工具的 Vercel 项目从分裂的两个 Team 统一转移进 `kongsi-idea` 团队，域名未变（`tahun2-mt-wang` 的 GitHub 自动部署因此断线，待老师手动去 Dashboard 重连）。

上次（更早）：新增并上架 `tahun1-bc-juxing`（句型跳跳队，全平台第一个摄像头体感游戏），流程细节已合并进全局 skill `newtool`。

状态系统本身没变动：
- `PROGRESS.md`：给人和 Agent 查询的完整总览。
- `tools-status.json`：人工维护满意度、已知问题和下一步。
- `npm run status:sync`：同时生成 `PROGRESS.md`、`README.md` 和 `../kongsi-idea/docs/tools-status.md`。

## 🚦 目前状态

- 本机工具目录：18（已上架 17／开发中 1「`tahun1-bc-chongzu`，已确认搁置」／尚待记录明确满意度 16）
- 新增一个**规划中**项目（尚未计入上面数字，因为还没有 `tahun*` 代码资料夹）：`_planning/tahun4-sj-jijinbu/` — 四年级历史集锦簿电子模拟器，设计讨论阶段
- `tahun1-bc-juxing` 已核对课本内容，但**马来文官方 DSKP 用词还没查证**，暂未收录进 `kongsi-idea/data/dskp-index.js`

## ➡️ 下一步

**四年级历史集锦簿（本次新增，最优先）**：
1. 等老师补充更多学生实体作品照片（陆续放进 `~/Documents/工作档案/学生作品参考/历史集锦簿-20260918/`）。
2. 跟老师一起定案三主题的页面结构（页数/顺序）+ 插画/标题元素最终清单——尤其要问清楚「正式研究栏位（内容标准/研究目的/研究目标/研究方式）要不要强制做成独立页」这个矛盾点（真实学生作品都没做，但评分标准要求）。
3. 清单点头后才派工生成实际插画素材 + 抠图，再进 `newtool` 标准流程正式建立 `tahun4-sj-jijinbu/` 工具资料夹。

**既有工具（延续中）**：
4. 收集 `tahun1-bc-juxing` 课堂实测反馈，尤其 3 人以上摄像头侦测的实际稳定性。
5. 查证 DSKP 5.4/5.4.1 的官方马来文用词，核对过再补进 `kongsi-idea/data/dskp-index.js`。
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

- 时间：2026-09-25
- 更新者：Claude Sonnet 5 @ MacBook Air M3
- Git push：✅ 已推（`8ea6aa5`）
