# _retro：做工具的磨合记录

这里存的是**经验的累积**，不是规则。规则在 `~/.claude/skills/newtool/SKILL.md` 和 `../agents.md`；这里是它们的来源和证据。平时开工**不用读**，想知道"流程是怎么一步步磨出来的"、或要决定某条规则该不该改时才翻。

## 怎么产生

收工时 `shutdown` 的 L1.6 步骤会写一份，一次一个文件，命名 `YYYY-MM-DD-主题.md`。本次对话没有磨合（只是问问题、没被纠正、没做决定）就不写。

## 每份的格式（20–35 行，写不满就别凑）

```
# 日期 主题
## 一句话：做了什么、走到哪（上线／未上线）
## 流程怎么跑的：过了哪几个关口、用了谁（Opus／Sonnet／cx）、来回大约几轮、卡在哪
## 被纠正的：老师原话 → 根因（标「推断」或「已查证」）→ 已回写到哪（或「未回写，候选」）
## 老师拍板的：含「刻意不做」的
## 做对了的：老师明确认可的做法
## 下次可前置／可省的
```

## 晋升与淘汰

- 同一类纠正在**两份以上**出现，或一次纠正后明显做对了 → 晋升进 skill／agents.md（先找旧条目改写，不新增）。
- 条目被写进 skill 后，在这里的原条目标「已晋升 → 位置」，不删。
- 累积到 5 份左右，做一次合订：找跨工具的共同模式，把 skill 里堆成流水账的条目提炼成原则。

## 索引

| 日期 | 主题 | 备注 |
|---|---|---|
| 2026-10-03 ~ 10-10 | [一周回填](2026-10-10-一周回填.md) | 从 11 个 session 里老师本人的讯息整理 |
| 2026-10-10 | [建立复盘机制](2026-10-10-建立复盘机制.md) | 本机制的诞生记录；第一份"收工时写"的 |
| 2026-10-11 | [tahun6 Question Tags](2026-10-11-tahun6-question-tags.md) | 范围被老师纠正、人名性别；候选规则未晋升 |
| 2026-10-11 | [tahun2 The Dressing Game](2026-10-11-tahun2-the-dressing-game.md) | 转盘／玩法被纠正、年级没问；候选：关口①问年级 |
| 2026-10-11 | [tahun1 软糖回声乐园](2026-10-11-tahun1-mz-irama.md) | 预备/人声/扶梯被纠正；候选：跟拍不放人声、可换角色文案用「我」、署名只在 Hub |
| 2026-10-11 | [tahun2 醒狮节奏瀑布](2026-10-11-tahun2-mz-irama.md) | 钹锣改录音、名称去掉 tarian singa、verify 太慢（已晋升 CLAUDE.md） |
| 2026-10-12 | tahun2-bc-biaodian | 无纠正；cx-draw 并行会串图（已晋升 → 10-17 修 `.ops/cx-draw.sh` 按 thread_id 收图） |
| 2026-10-12 | [tahun1 一年级10月数学练习](2026-10-12-tahun1-mt-latihan-oktober.md) | 一年级10月数学练习：关口②被老师跳过直接发布；两个 Sonnet 并行 |
| 2026-10-12 | tahun1-bi-fruitveg | 许愿池做工具；拍板「做好写信通知许愿老师」 |
| 2026-10-12 | [tahun5 数据侦探局](2026-10-12-tahun5-mt-data.md) | 许愿池第一个走完整流程：DSKP 漏补、署名、信件链接被纠正；已晋升 agents.md 第 2、10–12 条 |
| 2026-10-13 | tahun1-bc-fuxi-oktober | 手机窄屏版面返工 4 轮；候选规则：窄屏逐题溢出检查 |
| 2026-10-13 | tahun2-bm-kataarah | Hub 部署覆盖事故（候选晋升） |
| 2026-10-13 | [tahun2 Dressing v2](2026-10-13-tahun2-dressing-v2.md) | 没先读聊天记录就重写被打断；放弃真穿搭改 3 张整图；候选：「先对照原版再动手」第二次出现 |
| 2026-10-14 | [tahun1 网课同步作答](2026-10-14-tahun1-all-online.md) | 名单隐私不写死、墙只显示10人、emoji、时≠点；已晋升 newtool §2/§3 |
| 2026-10-14 | [tahun1 Kata Arah](2026-10-14-tahun1-bm-kataarah.md) | 视觉连否三轮才定 Q 版＋45 度 2.5D；已晋升 newtool §3；竖屏返工两轮 |
| 2026-10-15 | [tahun3 座位小侦探](2026-10-15-tahun3-mt-koordinat.md) | 许愿池 Tahun 3 数学；为什么不要名字、UI 太平／太满／字体、「行」读 háng、黑板折行；候选：「行」读音、首版 brief 带执行品质层 |
| 2026-10-15 | [tahun1 找对小帮手](2026-10-15-tahun1-bc-xingsi.md) | 许愿池形似字；漏课本字族文、可点提示、定位说明被追问；候选：投影工具标配全屏 |
| 2026-10-14 | [英文封面 Year](2026-10-14-英文封面Year.md) | 英文科缩图写 Year N 不写 Tahun；iCloud 重复 ref 卡 push；候选：newtool 封面提示词分语言 |
| 2026-10-14 | [tahun2 dressing v2.1 修图](2026-10-14-tahun2-dressing-v2.1-修图.md) | Tahun→Year 漏了 Hub 旧缩图；「已上线」回报前要对线上 md5；候选未晋升 |
| 2026-10-15 | [tahun1 找谁来帮忙（pk-kecemasan）](2026-10-15-tahun1-pk-kecemasan.md) | 原稿「搬家」被纠正（已晋升 newtool §1）；PJ／PK 分科、晓伊淘汰与负语速、音档缓存陷阱；小镇探索第一期上线 |
| 2026-10-15 | tahun1-bc-fuxi-oktober-2 华文复习本（二） | 第二套换题；暴露：源码遗失、旧词残留、预览页规则晚发现；引擎化待决 |
| 2026-10-16 | [tahun2/tahun1 数学复习本](2026-10-16-tahun2-tahun1-mt-fuxi.md) | 乘法组×个、必须答完、?preview、测试过多 |
| 2026-10-17 | [tahun3 换算工坊](2026-10-17-tahun3-mt-sukatan.md) | 许愿池；兑换台左右、数位对齐、首次打开机械声被纠正；机械声已晋升 newtool＋agents.md |
| 2026-10-17 | [tahun1 撕日历：昨天今天明天](2026-10-17-tahun1-bc-shizi-explore.md) | 许愿池 #15；CSS 示意「都不好看」→ cx 概念图（已晋升 newtool 关口①）、屏幕大小（已晋升 §3 固定舞台）；「不需要和我讨论吗」候选 |
| 2026-10-17 | [tahun6 分数乘法格子板](2026-10-17-tahun6-mt-pecahan.md) | 许愿池 #6；「不需要和我讨论吗」第二次（已晋升 agents.md 许愿流程第 1 步）；分数要上下写（候选）；Hub 部署被别的会话覆盖 |
| 2026-10-17 | [tahun5 钱币小掌柜](2026-10-17-tahun5-mt-wang.md) | 许愿池 #16；「不需要和我讨论吗」第三次（规则已在）；Hub 干净 worktree 部署已晋升 agents.md 第 6 步；log-cost 找不到 teaching-tools 会话已修 |
| 2026-10-17 | [tahun2 拼字魔法锅](2026-10-17-tahun2-bc-xingsi.md) | 许愿池 #4；「不需要和我讨论吗」第四次（规则已在）；描字判定要测「涂满／只写一半」反例（候选） |
| 2026-10-17 | [tahun2 One or Many? Fruit Garden](2026-10-17-tahun2-bi-plural.md) | 许愿池 #12：一句话定 B＋A；无纠正；cx-draw 串图第二次 → 已修脚本 |
| 2026-10-17 | [tahun4 Syllable Sports Relay](2026-10-17-tahun4-bi-sports.md) | 许愿池 #10：一则讯息定 A＋B；无纠正；单音节 TTS 念歪靠 say 改写＋Whisper 回听（候选）；log-cost 缺 opus-5-5 单价 |
| 2026-10-17 | [tahun3 Wartawan Cilik: Kata Tanya](2026-10-17-tahun3-bm-katatanya.md) | 许愿池 #3：一次定 A＋B＋C、不需教具；无纠正；我把 secrets 档标签行印出（service_role 露出，规则已在）；worktree 部署后要先 pull 主目录再 check（候选） |
| 2026-10-18 | [tahun2 句子小火车 v1.2](2026-10-18-tahun2-bi-punctuation-v1-2.md) | Ming Zhu 老师抓错（逗号、Art）；发现者写进 changelog；Art 大写待老师定 |
| 2026-10-19 | [tahun1 分数与时刻复习加强本](2026-10-19-tahun1-mt-fuxi-pecahan-masa.md) | 照原复习卷错题出 20 题＋新成绩表；「slug 要用复习的」（已晋升 agents.md＋newtool）；印出 secrets 标签行第二次（已晋升 AGENTS §3.8） |
| 2026-10-20 | [tahun2 分离大法实验室](2026-10-20-tahun2-dst-campuran-lab.md) | 闯关入口没测出（测试没点卡片）、大小石头×细网筛不合理（候选）；封面一律 draw 生成（已晋升 newtool＋agents.md）；og 分享图补齐 57 个；回了英文被纠正 |
| 2026-10-21 | [tahun1 一起玩冲格](2026-10-21-tahun1-pj-congkak.md) | 零件硬拉、语音不同步、第一次引导（已晋升）；候选：问题当场修、分层选择分步、图标配字 |
| 2026-10-22 | [tahun2 心愿瓶看图写话](2026-10-22-tahun2-bc-kantu.md) | PPT→Meet 全课网页；四轮回馈（找一找、长句重叠、空格提示、楷体、因为不放句首）→ 已晋升 agents.md；候选：开工问署名、验收取最长组合 |
| 2026-10-22 | [tahun1 答案藏在哪里？](2026-10-22-tahun1-bc-lijie.md) | 草稿→正式工具；slug 用理解、照原设计（已晋升 AGENTS §3.2）、阅读题不弹转横（memory）；候选：记成绩工具验收实写一笔 |
| 2026-10-20 | [tahun1 天平工坊](2026-10-20-tahun1-mt-jisim.md) | 第一个真物理工具；一年级操作太吃力→简化版；手机可变宽舞台（候选）；「先上线」用快照部署 |
| 2026-10-20 ~ 10-22 | [tahun2 零用钱跑腿日](2026-10-22-tahun2-mt-wang-practice.md) | 课堂热修 3 个 bug、跨天存钱漏设计、第 3 天没结局；金额朗读两次被抓（两／二、令念 lǐng）→ 已晋升 newtool 坑点；上架前没重读当天改的封面规则（memory 已有） |
| 2026-10-23 | [tahun2 竖式小码头](2026-10-23-tahun2-mt-bahagi.md) | 关口②修 8 处；draw 没合并对照图被问；引导手用图示（已晋升 newtool）；iCloud 收走 .git 卡 git |
