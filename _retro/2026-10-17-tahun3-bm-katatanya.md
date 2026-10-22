# 2026-10-17 tahun3-bm-katatanya（Wartawan Cilik: Kata Tanya）

## 一句话：做了什么、走到哪
许愿池 #3（三年级国文 Kata Tanya：听不懂概念、不愿参与问答、缺兴趣、程度差异大；大班、只有老师投影），一个对话（中间压缩一次）走完：v1.0 上线、Hub 上架、DSKP 新增 Tahun 3 BM、许愿单 shipped、Gmail 草稿一封（回在 10-09 追问信同一串）。

## 流程怎么跑的
- 老师开场交代：3 个方向各一张示意、挑定才动工；照标准流程到底；Gmail 每人一封不重建；改 kongsi-idea 前先 pull、只提交自己的档；做完开工包加 done-。
- 关口①：cx 生 3 张整画面概念图（A 小记者／B 两队计分／C 转盘）＋自己发现的问题一次讲。老师回：「1. 照你建议 2. 可以在解释你说明，但是如果没有工具颜色卡，普通老师也可以马上用 3. 放 4. OK」。
- 开发：主对话写 SPEC＋题库 `js/bank.js`（zoom 框画框核对），Sonnet 子代理照 SPEC 实作；verify 2 轮（Tahap 3 题卡挡住目标、转盘字倒置 → 修好，24 组合 0% 重叠）。
- 关口②：老师说「发布」。Hub 从干净 worktree 提交，rebase 时与别的会话（tahun4-bi-sports）在覆盖表矩阵冲突，手动合并两边。

## 被纠正的
无（老师没纠正）。

## 老师拍板的
- A 小记者场景为主＋B 两队计分＋C 转盘做第三关、三档难度。
- 不需要教具：举手指 1–4；颜色卡只当 Panduan 建议。
- 收 ke mana 与 -kah 形式。

## 做对了的
- 先查许愿老师学校是华小（开南），用 SJK 版 DSKP，不是 SK 版。
- DSKP 上架前再对一次官方 PDF，发现 1.2.3「Mengemukakan soalan」正好对应 Tahap 3，一并收进索引。

## 卡点／坑
- **我把 `.secrets.local.md` 的标签行印出来，service_role JWT 进了对话**（已查证）。规则早已在 AGENTS §3.8（不印任何内容），是执行没守住：只该用脚本按标签取值，连 grep 标签都不要。是否重设金钥等老师决定。（10-19 再犯一次 → 已晋升 AGENTS §3.8）
- 扫描版 DSKP／课本 PDF 没有文字层：用 tb.py build-ocr；python3 不能带 `-I`（fitz 找不到）。DSKP 网址直接 curl 拿到 HTML，要带 UA＋cookie jar。
- handoff 写「第 41 页」是印刷页，PDF 要＋12（这次差点对错页）。
- cx-draw 仍混入别的会话的图（10 张）；与 plural 会话修脚本的先后未查证（推断：本次生图在修之前）。
- 主目录 kongsi-idea 落后一个 commit 时 `npm run check` 报「没有登记」；check 读本机主目录，worktree 部署后要先 pull 主目录再 check。

## 下次可前置／可省的
- worktree 部署流程第 6 步补一句「部署后 pull 主目录再 check」（候选，第一次）。
