# Teaching Tools 交接档

> 开工先读 `PROGRESS.md`；只有确定要继续某个工具后，才进入该目录读取 `handoff.md` 和源码。

## ⏯️ 目前做到哪

已建立全部教学工具的统一状态系统：

- `PROGRESS.md`：给人和 Agent 查询的完整总览，涵盖全部工具、年级、科目、DSKP、开发状态、品质状态、Hub 同步、已知问题与下一步。
- `tools-status.json`：人工维护满意度、已知问题和下一步。
- `scripts/sync-tools-status.mjs`：扫描所有 `tahun*` 目录，并读取 Hub 的 `TOOLS`、`DSKP_INDEX` 和覆盖表。
- `npm run status:sync`：同时生成 `PROGRESS.md`、`README.md` 和 `../kongsi-idea/docs/tools-status.md`。

已用临时工具目录验证自动发现：新增目录后两个状态表会自动出现该工具；删除后重新同步会恢复真实数据。

## 🚦 目前状态

- 本机工具目录：17
- 已上架：16
- 开发中：1（`tahun1-bc-chongzu`）
- 明确需优化：1（`tahun1-bc-liangci`）
- 尚待记录明确满意度：15
- 工具级 `handoff.md`：目前仅 `tahun2-mt-wang` 已有，其余工具待有实际维护需求时补

状态同步脚本已通过语法检查和真实生成测试。半成品只会进入内部状态总览，不会自动公开上架到 Hub。

## ➡️ 下一步

1. 决定 `tahun1-bc-chongzu` 是继续完成还是暂停／放弃；若继续，先补该工具的 `handoff.md`。
2. 修正 `tahun1-bc-liangci` 的 DSKP 引用和 changelog 顺序，再测试 Hub 搜索与详情页。
3. 工具实际课堂使用后，将 `tools-status.json` 中的“待评估”逐项改成“满意／待观察／需优化”。

## ⚠️ 注意事项

- 不要直接手改 `PROGRESS.md`、`README.md` 或 Hub 的 `docs/tools-status.md`；修改来源资料后运行 `npm run status:sync`。
- 同步状态不等于发布。公开上架仍须完成 DSKP 核对、测试、部署、截图和 Hub `TOOLS` 登记。
- `.DS_Store` 不属于专案资料，不要提交。

## 🕐 最后更新

- 时间：2026-07-24
- 更新者：Codex @ mr007s-Macbook-Air.local
- Git push：待推
