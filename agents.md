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

- **署名规则（2026-10-09 老师定，全局）**：老师说这个工具是某位老师的，Hub `creator.name` 就只写那位老师的名字（如「陈晓琪老师」），`initial` 取姓；**不加「卢老师」，也不加「构想」「改编」等字样**。**工具页面（app 内页）一律不写任何名字**（2026-10-11 老师定：署名只放 Hub；连「卢老师」也不放；**只管新工具，已经写了名字的旧工具不回头改**）。没特别说是别人的，才用默认的「卢老师」。
- 新工具资料夹（slug）命名（2026-10-17 老师定，规格 `../kongsi-idea/docs/hub-reorg-2026-10.md` 第 1 节）：**只管新工具，已上线的 slug 不改**——Hub 网址、使用次数、喜欢数、转发出去的链接都绑 slug。标准三层 `tahun{年级}-{科目缩写}-{单元关键词}`，例如 `tahun2-mt-wang`。① 单元关键词取 DSKP 用词，语言跟该科 DSKP：华文用拼音，数学／科学／马来文等用马来文 DSKP 词，英文用英文。② **同单元已经有工具，新工具才加第四层「玩法词」**，只能从这张表选：`practice` 学生自己练习、闯关；`quiz` 全班抢答、测验；`duel` 两人／两组对战；`explore` 老师带着演示、探索；`build` 拼组、造句、动手做；`lab` 实验模拟；`write` 书写。③ 同单元同玩法又来一个：第四层改用更细的 DSKP 子项词或课本范围（如 `12to22`），**不用数字后缀（`-2`、`1`）**。④ **slug 与展示名都不放月份、学期等会过期的词**（如 `oktober`）。⑤ 跨年级写范围 `tahun4to6-…`；跨科目写 `all`（`tahun1-all-…`）。⑥ 科目缩写对照：slug `mz` ＝ Hub 科目码 `muzik`；`pj`、`pk` ＝ `pjpk`（`pk` 待拆）；其余同码。⑦ 展示名必须带内容词（「时刻大对决」的「时刻」），同一年级里同一个套路词（对决、侦探、探险……）不重复用。**slug 和展示名是两回事（2026-10-10 老师定）**：slug 只为分类，同系列各年级只差 `tahunN`（`tahun1-pj-pergerakan`、`tahun2-pj-pergerakan`）；展示名要吸引学生（动物模仿秀、蓝天操场），国文科目要带 DSKP 术语（pergerakan）才看得懂。**PJ 与 PK 是两个科目（2026-10-15 老师定）**：`pj`＝Pendidikan Jasmani 体育，`pk`＝Pendidikan Kesihatan 健康教育；两科共用同一份 DSKP（`资料库/DSKP资料/KSSR2017/Pendidikan-Jasmani-Kesihatan/`）和课本，但课时、老师与 Hub 科目各自独立。做健康教育的工具（急救、自身安全、饮食卫生等）slug 用 `pk`，例如 `tahun1-pk-kecemasan`，不要归进 `pj`／`pjpk`；DSKP 对照要取「Kesihatan」部分。Hub `SUBJECTS` 现只有 `pjpk`，上架第一个 `pk` 工具时要先拆出 `pk` 科目（改 Hub 代码，先说一声）。从已上线工具派生新年级时，不改原工具的外观与展示名。
- **做工具的磨合记录在 `_retro/`**（收工时由 `shutdown` 写）。平时不用读，要追某条规则的来历、或累计够了做合订时才翻。
- **一开始动工（哪怕只是先生成一个原型 index.html）就要做两件事**：① 在工具自己的资料夹建一份最简 `handoff.md`（状态／已知问题／下一步／最后更新时间）；② 在本目录运行 `npm run status:sync`。同步脚本会自动发现新的 `tahun*` 目录，并把它列入 [`PROGRESS.md`](PROGRESS.md)；不要直接手改生成表格。
- **两个脚本（2026-10-02）**：开工用 `npm run new -- {slug} "中文名"`（建目录＋`.gitignore`＋`handoff.md`＋`tools-status.json` 登记＋同步）；上线后用 `npm run check -- {slug}` 从学生那端验收（工具网址与资源 200、线上 Hub 版本、缩图、本机登记），`npm run check -- --all` 扫全部 Hub 工具网址。没通过 check 不说「已上线」。
- **每个工具的入口 `index.html` 必须带使用次数统计（2026-10-08 老师定，新工具建立时就写好）**：`</head>` 前加一行 `<script src="https://kongsi-idea.vercel.app/data/track-use.js" data-slug="{slug}" defer></script>`。原因：老师常把工具网址直接转发，只靠 Hub「开始使用」会漏掉这些使用。`data-slug` 必须等于 `{slug}.vercel.app` 的前缀，否则不计数；Hub 的链接带 `?kh=1`，脚本看到会跳过并清掉它，所以不会重复计。多页工具只放在学生会落地的入口页。`npm run check -- {slug}` 与 `--all` 会检查线上页面有没有这一行，缺了不算通过。
- **自动部署（2026-10-08）：push 到 `main` 就由 GitHub Actions 部署到 Vercel**（`.github/workflows/deploy.yml`，模板 `scripts/deploy.yml.template`）。原因：Vercel Hobby 套餐不能用 Git 集成连「组织的私有仓库」（409），GitHub 免费组织的 org secret 也不能给私有仓库用，所以 `VERCEL_TOKEN` 是**每个仓库各存一份**，token 本体在本机钥匙串（`-a vercel-actions -s VERCEL_TOKEN_KONGSI`，Vercel 团队 token，范围 kongsi-idea）。**新工具首次 `vercel deploy` 之后**：① `python3 -I scripts/set-vercel-secret.py <repo名>` ② `zsh scripts/add-actions.sh <slug>`（放工作流并 push）。之后平时只要 `git push`。Actions 失灵时的后备：`npm run deploy -- <slug>`（push＋部署＋补切别名＋线上验收）。⚠️ 项目域名必须是 `{slug}.vercel.app`（`vercel api /v9/projects/{slug}/domains` 查），否则自动部署不会更新这个网址；tahun2-mt-wang 曾因此漏过。Hub 本体 kongsi-idea 仍是手动三步，不走 Actions。token 过期或换人时重存钥匙串再跑一次 `set-vercel-secret.py`（可传多个 repo 名）。
- 工具做到一半要停工／换人接手：先把 `handoff.md` 更新成「卡在哪、下一步是什么」再收工，不要留空白状态。
- 工具的“满意／待评估／待观察／需优化／未完成”、已知问题与下一步统一维护在 [`tools-status.json`](tools-status.json)；`PROGRESS.md` 是给人和 Agent 快速查询的自动生成总览。
- 每个工具保持独立 Git 仓库与独立 Vercel 项目；GitHub org 使用 `kongsi-idea`，仓库名称等于 slug。
- **Vercel 项目一律部署到 `kongsi-idea` 这个 Vercel Team**（不是老师个人的 `mr007's projects` team，老师口中的「yquan77」）：2026-09-11 发现历史上有 13 个 `tahunN-科目-单元` 工具意外分裂两边（`kongsi-idea` 团队里是乱码域名分身，`mr007's projects` 才是干净域名的正版），已整理统一进 `kongsi-idea` 团队。新工具第一次 `vercel` 部署时要确认 `--scope kongsi-idea`，不要用默认 scope。
- 新工具的 `index.html`／`package.json`／`src/` 默认放在 slug 根目录；`tahun2-mt-wang` 曾是 `app/` 子目录的历史例外，2026-10-08 已改成和其他工具一样放根目录（`app/index.html` 只留作旧网址跳转）。若确实要用子资料夹，必须在该工具自己的 `agents.md` 写明原因与 Vercel 部署根目录。
- 工具应可单独开发、单独部署与单独回滚；不要引用 `kongsi-idea/` 的运行时代码。
- **班级名单工具必须沿用共用接入标准**：依序引用 `https://kongsi-idea.vercel.app/data/supabase-client.js` 与 `https://kongsi-idea.vercel.app/data/class-code-client.js`，使用 `await ClassCode.loadOrPrompt()` 取得名单。共用客户端提供错误代码持续重试与「换班级」按钮；不要在单个工具重新实现输入、记忆或换班逻辑。换班会验证新代码、保留其他网址参数并重新载入当前工具，确保上一班的学生／成绩／进度状态被清理。
- 按 DSKP 自主找题时，先提出「教学目标 + 学生困难假设 + 核心课堂玩法」给用户确认；**没有用户确认，不可直接生成或发布工具**。不能只因 DSKP 有一条标准就自动生成工具。
- 完成后：测试工具 → commit/push 自己的 Git 仓库 → 独立部署到 Vercel → 截图 → 回到 Hub 登记工具资料。
- **单个 `tahunN-*` 工具的 `vercel --prod`／alias 已在 guard 授权名单内**（2026-10-09 老师定：`guard-policy.json` 的 `deploy_allowlist` 用通配符 `tahun[1-6]-*`；此前 2026-09-17 磁力创造实验室发布时被挡，需老师本人跑）。老师在关口②说「可以发布」后，agent 自己部署到底，不再请老师跑命令。部署仍须带 `--scope kongsi-idea`，完成后跑 `npm run check -- {slug}`。
- **已上架工具每次上线新版本，Hub 必须同步更新，这是完成的一部分，不是可选收尾**（2026-09-17 老师定：浮沉实验室 v2.0 上线了 Hub 却还是 v1，被点名）。工具部署后、回报「已上线」之前，逐项做完：
  1. `kongsi-idea/data/tools.js` 该工具的 `version` 升版（2026-10-17 起登记在 `data/tools.js`，不在 `app.js`），`changelog` 在最前面加一条 `{ version, date: 上线当天日期, note: 这次改了什么 }`；`desc`／`keywords`／`teachingMode`／`prep` 若因改版失效，一并改写。
  2. 用 Playwright 操作**正式网址**重新截真实画面，放进 `kongsi-idea/assets/thumbs/{slug}/`（新档名带版本，如 `v2-1-xxx.png`），`thumbnails` 换成新图并写 label（新截的图照「上线」那步的缩略图规则：内容可见、顺序固定、4:3）；旧图搬 `~/Documents/待删除/`，不留失效引用。**Hub 自己的整理改版（首页、详情页、后台、登记搬位置）学生端没变，不升版、不写 changelog**（2026-10-17 老师定，记在 Hub commit 与 `kongsi-idea/agents.md`）。
  3. `kongsi-idea/docs/published-tools-coverage.md` 该行「优化备注」写上版本与日期，以及仍待改的点。
  4. `teaching-tools/tools-status.json` 更新 `version`／`lastUpdated`，跑 `npm run status:sync`。
  5. Hub commit＋push，按 `kongsi-idea/agents.md` 的部署三步（`vercel --prod` → `alias set kongsi-idea.vercel.app` → `curl` 线上 `data/tools.js` 确认新版本号与新缩图路径真的在）。没做完第 5 步，只能回报「工具已上线，Hub 未更新」。
- **有题库的练习／复习类工具，必须带「教师预览页」（2026-10-14 老师定）**：学生链接后面加 `?preview`，一页看全部题目（图、题干、选项并标出正确答案、解释、答错提示；有难度标记的可按大题／难度筛选）。只读，不选名字、不存档、不送出；普通网址不受影响。做法：抄 `tahun2-mt-fuxi-oktober/preview.js`（从 `window.__xxx` 取 `Bank`、`UI`，不改 `app.js`），`index.html` 在 `app.js` 后加 `<script src="preview.js"></script>`；Hub 条目的 `desc`／`prep` 提一句。上线前验：题卡数＝题数、360px 无横向滚动、图无破图、普通网址仍是封面。
- **数学题的两条硬规则（2026-10-16 老师定）**：① **乘法一律按「组数 × 每组个数」讲**：4 × 7 是 4 个 7（4 组、每组 7 个），解释、提示、朗读都不能写成「7 个 4」；出题与 `why`／`tagWhy` 写完要自查有没有反过来。② **学生必须把每一题都答完才能完成／交卷**：不给「跳过」「带着没答的题交卷」。逐题确认型工具（`app.js` 的 `finish()`）有未答题就退回第一个没答的；一次交卷型工具（如 `tahun1-mt-latihan-oktober`）有没答的就不显示「交卷」，只给「去做没做的题」。刷新后的续做也不能绕过（存档里 `phase=done` 但有没答的，要回到做题）。老师后台的「（没有作答）」只会出现在学生中途离开或纸本回填留空的情况。
- 不要把 API key、学生资料、学校机密资料写进源码或 commit。
- **预录语音要尽量多种人声（2026-10-15 老师定）**：学生在不同工具里听到的声音要有差别，不要全都是同一个晓晓（盘点：现有 16 份 `gen-voice.py` 用 `zh-CN-XiaoxiaoNeural`，只有 2 份用 Yunxia、2 份用 Xiaoyi，马来文几乎全是 Yasmin）。做法：① **一个工具里每个角色／NPC 各配一个声音**（男、女、童声分开），旁白用另一个；角色→声音映射写在该工具 `gen-voice.py` 顶部，并记进该工具 `handoff.md`。② **新工具的旁白声先看上面的盘点，挑最近没用过的**。**可用声音以 2026-10-15 老师逐个试听的结论为准**：普通话 6 个按角色派——Xiaoxiao（温柔老师／旁白）、Xiaoyi（活泼女孩角色；⚠️ 2026-10-15 老师听过「找谁来帮忙」里放慢 -10% 的晓伊说声音机械、淘汰；放慢语速本身会更机械，所有声音不要低于 0%，旁白一律改用 Xiaoxiao）、Yunxi（阳光男孩同学）、Yunxia（可爱小动物／小不点）、Yunjian（热血教练／大反派）、Yunyang（正式播报／规则说明）；台湾腔只有 `zh-TW-YunJheNeural` 原速可用（男老师／大人、正式）；马来文只有 Yasmin／Osman 原声（edge-tts 没有儿童声）；英文有多个 en-* 口音。③ **不要用 `--rate`／`--pitch` 把成人声改成「童声」**：老师试听过马来文调音版，说「都很奇怪」；要有老少区别就换声音或角色分配。④ **黑名单（老师试听否决）**：`zh-CN-liaoning-XiaobeiNeural`（强调绝不用）、`zh-CN-shaanxi-XiaoniNeural`、粤语 `zh-HK-*` 全部、`zh-TW-HsiaoChenNeural`、`zh-TW-HsiaoYuNeural`。⑤ 音档文件名规则不变，将来换成真人录音可直接替换。
- **预录 mp3 被浏览器自动播放限制挡下（`NotAllowedError`）时，不要退回 `speechSynthesis`**（2026-10-17 老师：首次打开是机械声、切页签后才正常）：显示「点一下画面，开启声音」，第一次点击补播同一个 mp3；只有音档缺了／坏了才用浏览器朗读。范本 `tahun3-mt-sukatan/app.js` 的 `Voice.waitGesture`。旧工具多半有同一个问题，未逐一检查。
- 工具若用 `speechSynthesis` 读汉字，**不要直接读孤立单字**——多音字（系/长/了/卷/省……）引擎会猜错读音，
  常常不是课本那一课教的。做法参考 `tahun1/2/3-bc-bishun`（2026-09-11）：`pypinyin` 解大多数字的默认读音，
  用 `jieba` 切该年级课本原文语料抓真实词语核对多音字（哪个字真的在课本里出现过不同读音，就要逐句对照课本
  原文判断这课教哪个），做成 `js/pinyin-data.js`（`{字: {py, word}}`）；朗读改成读「字，词」而非孤字，
  词的上下文能强制引擎读对音。画面同步标注拼音有额外教学价值，不是只为了修 bug。

## 从许愿池做工具的标准流程（2026-10-12 老师定，以「数据侦探局」tahun5-mt-data 为范本）

目标：许愿单进来，当天做出老师能用的第一版，缺的资料靠回信补，回信后再修订。顺序和并行点如下，下次照做，不重新讨论。

1. **读单、判断够不够**（几分钟）：对照 `kongsi-idea/docs/idea-wish-pool-spec.md` 3.3 的标准——开发者读完能不能知道怎么设计。分三类写给老师：够的／缺的／可以先做的。用语是「卡点」：工具要对着老师写的那个卡点做。**读完开工包先开口**：把理解、⚠️ 和要问的问题一次讲给老师，聊定方向才去翻资料、做示意（2026-10-17 两个许愿工具都被问「不需要和我讨论吗？」）。
2. **DSKP 对照是必做项，不能留空**（2026-10-12 老师指出 tahun5-mt-data 第一次上架漏了）：从 `资料库/DSKP资料/KSSR2017/{科目}/SJKC/TAHUN{n}.md` 取中文、`SK/TAHUN{n}.md` 取马来文原文，在 `kongsi-idea/data/dskp-index.js` 加「年级＋科目」记录（只收工具实际覆盖的单元／目标，`reviewed: false`，`sourceUrl` 用 `docs/dskp/` 里已有的官方网址，不编），工具 `standards` 引用它。上架前在 Hub 详情页确认看得到「对应 DSKP」。BI／BM 工具用原文（见 Hub 决定 26、27）。**同时要有主题（2026-10-17 老师定，Hub 决定 35）**：`standards` 必须能解析出主题——主题 `topic: { zh, bm }` 标在 `dskp-index.js` 的节点上（数学、科学、AM 等标在单元层；语文 bc／bm／bi 标在内容标准层），工具本身不手填；**同一内容跨年级必须用同一个 `zh` 词，加新词前先查索引里现有的主题词**；只有综合复习、跨科等跨很多单元的工具才例外，在工具上写 `topicOverride: { zh, bm }`。
3. **不为缺的资料停工**：先按已知做出可用的第一版（范围收窄，宁可少做一个概念也要能用）；每个错答案对应一种已知的错法；缺的资料同时发信问老师。
4. **建工具**：`npm run new -- tahun{n}-{科}-{关键词} "名称"` → 单文件或按需 → 本机验收交给 `verify`（压测逻辑 + 玩一遍 + 手机宽度 + 版面，限时 10 分钟，只列 3–5 条）。验收员发现的版面问题改完再复验一次。
5. **上线**（并行做）：`git init`＋`gh repo create kongsi-idea/{slug} --private --source=. --push` → `vercel deploy --prod --yes --scope kongsi-idea`（alias 自动带 `{slug}.vercel.app`）→ `python3 -I scripts/set-vercel-secret.py {slug}` → `zsh scripts/add-actions.sh {slug}`。缩略图交给 sonnet 子代理用 Playwright 对**正式网址**截，再跑 `kongsi-idea/scripts/build-thumbs.py`。**缩略图规则（2026-10-17 老师定，只管新工具，旧的不补）**：固定 4 张，顺序＝封面 → 核心玩法进行中 → 答对／答错的反馈 → 老师端（排行榜、`?preview` 预览页或后台）；**第 1 张必须看得到「教的内容」**——题目、字、图形实际出现在画面上，或用设计过的封面图并带主题词，**不能**用设定、选名字、登录、规则说明这类画面；按 4:3 截（如 1200×900），工具只适合宽画面时，重要内容放在中间 4:3 范围。
6. **Hub 上架**：`data/tools.js` 的 `TOOLS` 条目（必须有能解析出主题的 `standards`，例外才写 `topicOverride`，见第 2 步；**必须填 `modes`**，值只能是 `全班投影`／`上台对战`／`各自练习`／`回家练习`，1–3 个，第一个是卡片主要方式，依 `teachingMode` 判断）、`published-tools-coverage.md` 加行并更新矩阵、`tools-status.json` 改「待评估」后 `npm run status:sync`、Hub commit＋push 并确认线上 `data/tools.js` 有新条目。复习卷另要加 `collection`／`setLabel` 并登记 `TOOL_COLLECTIONS`；要老师后台的加 `data/teacher/{slug}.js`＋`TEACHER_TOOLS`（见下面「上架到课堂点子铺的回连清单」第 1 点）。
7. **做好就写信通知许愿老师（2026-10-12 老师定，每个许愿工具都要）**：用 Gmail 草稿（guard 不让自动寄出），由老师确认后自己按发送。信里必须有：已针对哪个卡点做了什么、工具链接、**明确欢迎老师用了之后回信提出要调整的地方**、不超过 4 个具体问题（真实错例＞其他）、署名怎么写。**交付慢了（许愿多、老师自己要上课／网课）就在信里诚恳道歉一句**，不找借口。**信在工具上线、Hub 能搜到之后才给草稿**，不要先寄再上线。
8. **回信后修订**：BOARD 记一行「等 {学校} 回信」；早上简报扫 Gmail 时看有没有来自该老师邮箱的回信；回信后按答案改题库／干扰项，Hub 升版、写 changelog。 老师用了之后回信要调整，也照这一条改，改完再回信告诉他改了什么。
8b. **做完要回许愿池更新进度（2026-10-12 老师定）**：工具上线（或老师回信后修订完）就把对应那张许愿单的状态、备注、关联工具改掉：状态 `shipped`（做不了就 `declined` 并写原因）、`linked_tool_slug` 填 slug、备注写版本与日期＋还在等什么。方法：老师在 `kongsi-idea/admin.html` 后台改；agent 没有管理员登录，用 psycopg2 直连改（密码读 `supabase/.secrets.local.md`，不印出来；先 `select` 用老师邮箱找到 id，再 `update wishes set status, review_note, linked_tool_slug`；只改这三栏，不动 schema）。不做完这步不算收尾。
9. **Hub 说明（desc）必须点出卡点**（2026-10-12）：开头一句「来自许愿池一位×年级老师的卡点：……」，说明这个工具是为了解决那个问题；工具首页的 lead 也写一句。**不写老师的名字和学校**（许愿默认不公开）。
10. **署名**：许愿表单现在有选填「想怎么署名」（存在 `classroom_context` 的 `署名：…` 一行，后台「班级情况」看得到）。有填就照填的写；**没填就写「一位×年级老师」（`initial: "师"`），不写「卢老师」、不写学校**（许愿默认不公开老师与学校）。「卢老师」只给卢老师自己主动做的工具。信里仍问一次署名，回信后再改。工具页面内不写人名。
11. **给老师的信**：链接一律写成裸域名（`kongsi-idea.vercel.app`、`tahun5-mt-data.vercel.app`），用 `htmlBody` 建草稿、`<a href="https://域名">域名</a>`，不要让 Gmail 套 `google.com/url?q=…` 转址、不要在正文里贴一长串。信里不用「回访」这类词，直接说「想请教几个问题」。
12. **发布前自查清单**（对照 Hub 上现有工具，不能比它们少）：缩略图 4 张＋label（顺序固定：封面／玩法／反馈／老师端；第 1 张看得到教的内容；4:3）；展示名带内容词、同年级套路词不重复；DSKP 对照＋能解析出主题的 `standards`（或 `topicOverride`）；`modes`；`prep`／`teachingMode`／`practiceSummary`；复习卷的 `collection`／`setLabel`；`changelog`；`track-use.js`；`npm run check`；coverage 表一行＋矩阵；`tools-status.json`；说明开头有卡点；署名；版权／课本出处若没有资料就在 handoff 写「待补」，不假装有。

时间参考（数据侦探局）：读单到本机原型约 40 分钟，验收两轮 10 分钟，部署＋上架＋信件约 30 分钟。

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

1. 在 `data/tools.js` 的 `TOOLS` 加入真实 `url`、标题、关键词、教学标签、作者、版本和 changelog（2026-10-17 起登记在 `data/tools.js`，不在 `app.js`）。另外必填三件事（Hub 决定 35—37）：① **`modes`**（四个固定值：`全班投影`／`上台对战`／`各自练习`／`回家练习`，1–3 个，第一个是卡片主要方式）；② **能解析出主题的 `standards`**，例外才用 `topicOverride`，主题词标在 `dskp-index.js` 节点上、跨年级同一内容同一个词；③ 若是复习卷，加 `collection`／`setLabel` 并登记 `TOOL_COLLECTIONS`，同年级同科目不要再各开一张卡。
   - **要老师后台**（成绩表、CSV）：加 `kongsi-idea/data/teacher/{slug}.js` 设定（成绩表名、栏位、题库网址、特殊显示），再在 `data/teacher/index.js` 的 `TEACHER_TOOLS` 加 slug；网址 `kongsi-idea.vercel.app/teacher.html?tool={slug}`。**不再复制整页 `*-admin.html`**，题库从工具线上网址读（2026-10-17 老师定）。
2. 将截图放到 `kongsi-idea/assets/thumbs/{slug}/`（4 张、顺序与 4:3 规则见上面「上线」那步），并为每张图写替代文字。
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
