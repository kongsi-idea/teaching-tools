# Teaching Tools（独立教学工具源码总目录）

> 本资料夹存放课堂点子铺旗下的**独立教学工具源代码**。每一个 slug 资料夹都是独立 Git 仓库、独立 Vercel 项目；不要把工具代码搬进 `../kongsi-idea/`。

## 这个资料夹是做什么的

- `kongsi-idea/` 是平台入口：工具目录、DSKP 学习目标搜索、点子许愿池、工具资料登记和缩略图。
- `teaching-tools/` 是每个实际教学工具的源码所在地：开发、测试、版本、Git 与 Vercel 部署都在各工具自己的 slug 资料夹中完成。
- Hub 只用外部网址打开工具；工具不依赖 Hub 的账号、反馈、喜欢数或统计逻辑。

## 开工前必读

1. **[整体进度总览 PROGRESS.md](PROGRESS.md)**——先看这份，知道现在有哪些工具卡在半路、该接着做哪个，不用重新翻全部代码。
2. 本档与目标工具资料夹内的 `agents.md`／`handoff.md`（若存在）。
3. [Hub 蓝图](../kongsi-idea/agents.md) 与 [Hub 交接记录](../kongsi-idea/handoff.md)，了解目前上架与部署状态。
4. **[已上架工具总览表](../kongsi-idea/docs/published-tools-coverage.md)**——这是全部已上架工具的权威查询表（slug／年级／科目／名称／对应 DSKP／网址／本机路径／优化备注），要查「某年级/科目有什么工具」「哪些工具还有待优化」都从这份表直接找答案，不用重新翻代码或问自己。
5. 要按课程自主生成新工具时，先查 `../kongsi-idea/docs/dskp/{tahun}/{subjek}.md` 的已核对摘要；扩充 DSKP 索引前再查术语核对文件：
   - `../kongsi-idea/docs/dskp-bm-glossary-mt-sains.md`
   - `../kongsi-idea/docs/dskp-bm-glossary-others.md`
6. 要让新工具能被「按学习目标找工具」找到，遵守 [DSKP 搜索实施规格](../kongsi-idea/docs/dskp-learning-objective-search.md)。
7. 若工具来自老师的课堂需求，先读 [点子许愿池规格](../kongsi-idea/docs/idea-wish-pool-spec.md)，把工具解决的问题、限制和课堂方式对应回来。

## 新建或修改工具的规则

- 新工具资料夹命名必须为 `tahun{年级}-{科目缩写}-{单元关键词}`，例如 `tahun2-mt-wang`。
- **一开始动工（哪怕只是先生成一个原型 index.html）就要做两件事**：① 在工具自己的资料夹建一份最简 `handoff.md`（状态／已知问题／下一步／最后更新时间）；② 在本目录运行 `npm run status:sync`。同步脚本会自动发现新的 `tahun*` 目录，并把它列入 [`PROGRESS.md`](PROGRESS.md)；不要直接手改生成表格。
- 工具做到一半要停工／换人接手：先把 `handoff.md` 更新成「卡在哪、下一步是什么」再收工，不要留空白状态。
- 工具的“满意／待评估／待观察／需优化／未完成”、已知问题与下一步统一维护在 [`tools-status.json`](tools-status.json)；`PROGRESS.md` 是给人和 Agent 快速查询的自动生成总览。
- 每个工具保持独立 Git 仓库与独立 Vercel 项目；GitHub org 使用 `kongsi-idea`，仓库名称等于 slug。
- 新工具的 `index.html`／`package.json`／`src/` 默认放在 slug 根目录；`tahun2-mt-wang/app/` 是为了保留既有素材相对路径的历史例外。若确实要用子资料夹，必须在该工具自己的 `agents.md` 写明原因与 Vercel 部署根目录。
- 工具应可单独开发、单独部署与单独回滚；不要引用 `kongsi-idea/` 的运行时代码。
- 按 DSKP 自主找题时，先提出「教学目标 + 学生困难假设 + 核心课堂玩法」给用户确认；**没有用户确认，不可直接生成或发布工具**。不能只因 DSKP 有一条标准就自动生成工具。
- 完成后：测试工具 → commit/push 自己的 Git 仓库 → 独立部署到 Vercel → 截图 → 回到 Hub 登记工具资料。
- 工具有老师反馈后的调整，必须更新工具的 `version` 与 `changelog`，并由 Hub 详情页呈现更新记录。
- 不要把 API key、学生资料、学校机密资料写进源码或 commit。

## 状态同步规则（每次 session 必做）

- 开工先读 [`PROGRESS.md`](PROGRESS.md)；只有确定要继续某个工具后，才进入该目录读 `handoff.md` 与源码。
- 新建、修改、暂停、恢复、测试、部署或上架任何工具后，收工前必须运行：

  ```bash
  cd /Users/yquanloo/Documents/my-agent/teaching-tools
  npm run status:sync
  ```

- 这个命令会同时更新 `PROGRESS.md`、`README.md` 与 `../kongsi-idea/docs/tools-status.md`，并检查 Hub/DSKP 登记是否异常。
- 新目录会自动进入总览，但同步不等于发布；半成品不会自动写进 Hub 的公开 `TOOLS`，发布仍须完成测试、DSKP 核对、截图和用户确认。

## 上架到课堂点子铺的回连清单

新工具上线后，必须回到 `../kongsi-idea/`：

1. 在 `app.js` 的 `TOOLS` 加入真实 `url`、标题、关键词、教学标签、作者、版本和 changelog。
2. 将截图放到 `kongsi-idea/assets/thumbs/{slug}/`，并为每张图写替代文字。
3. 只有实际核对过 DSKP，才在 `data/dskp-index.js` 与工具资料中加入目标引用；不能编造课程对照。
4. **更新 `docs/published-tools-coverage.md`**，加入 slug、年级、科目、名称、DSKP 对照、网址与本机源码路径这一整行，「优化备注」栏先填 `—`；这一步是强制的，不是可选——每个新工具都必须在这里留一行记录，之后才有单一入口可以查全部工具状态。
5. 部署 Hub 后，确认 Hub 卡片、详情页、外部网址和缩略图均正常。
6. 之后任何时候想到这个工具有什么该优化/不满意的地方，随时回来把 `published-tools-coverage.md` 对应那一行的「优化备注」栏更新——不用等收工或专门检讨才补。
7. 最后运行 `npm run status:sync`，让本目录总览、README 与 Hub 状态镜像保持一致。

## 目前工具位置

所有 `tahun.../` 子资料夹均为独立工具项目。钱币乐园已从原本的「二年级数学／互动学习软件」规范为：

```text
tahun2-mt-wang/        ← Git 与 Vercel 部署根目录
├── app/                ← 钱币乐园互动网页源码
├── unit4-money/        ← 钱币图片素材
├── DSKP-摘要.md
├── agents.md
└── handoff.md
```

对人类读者的完整工具清单见 [README.md](README.md)。
