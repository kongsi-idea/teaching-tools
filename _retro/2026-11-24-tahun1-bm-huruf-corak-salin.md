# 2026-11-24 tahun1-bm-huruf → Pan·Tu 决赛当天加 Corak／Salin
## 一句话：上台前几小时补 DSKP 4.1.1 Corak、4.1.3 Salin 两分页，加 Digital 简报 1A 看板按钮，修 Kandungan 回馈页，全部上线。
## 流程怎么跑的
- 主对话写派工包（`.ops/out/派工-2026-11-24-pantu-corak-salin.md`），Sonnet 子代理分两阶段做 Corak、Salin；主对话抽查截图、修小问题、部署 promote。
- 部署一律从 `git archive <commit>` 导出的资料夹推，避免把子代理做一半的档推上线。
- 上下文压缩一次（Salin 上线后）。
## 被纠正的
- 「corak button 你不要放在那边，找比较不显眼的地方」→ 原本照派工包做成首页大卡片；改成底部小字链接（推断：比赛展示重点仍是 A–Z，新分页是补 DSKP 覆盖，不该抢版面）。
- 「maklum balas 的部分为什么没办法看到全部老师的comment？」→ 11-23 版只拉 4 则且 4 行截断（已查证）→ 改显示全部（RPC 上限 40）＋自动卷动。
- 「corak 是什么corak？」→ 计划里只写了「8 种 corak」没列清单，老师得追问（已查证）。
- 自己抓到：Salin 选单卡片 Frasa／Ayat 没空格（harilahir）→ 逐词画 SVG。
## 老师拍板的
- 1A 看板照用、名字不模糊；Salin 一字一格自动给星；直接上线（只作展示）；拿掉「Pemerhatian awal」框。
- 刻意不做：Corak／Salin 进度进看板（要改 DB，赛后再说）。
## 做对了的
- 老师说「加快速度 马上要」「直接上线」——当天没有返工到需要回滚。
## 下次可前置／可省的
- 给老师看的计划要把清单项目列出来（8 种 corak 名称＋样子），不只写数量。
- 新功能入口先问「要不要显眼」，或预设放次要位置，比赛／展示场合尤其。
