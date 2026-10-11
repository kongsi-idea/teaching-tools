#!/usr/bin/env python3
"""收工时记录一个工具的开发 token 用量与 API 等价费用，追加到 teaching-tools/COST-LOG.md。

用法：python3 scripts/log-cost.py <slug> [--session <id>] [--note "备注"] [--dry]
- 默认取 ~/.claude/projects/-Users-yquanloo-Documents-my-agent/ 里最新修改的会话（= 当前会话）。
- 主对话 + 它派出的子代理（<id>/subagents/*.jsonl）一起算，按 message id 去重。
- 费用是「按 API 公开单价折算的等价金额」，老师实际走订阅额度，不是真的扣款。
- 单价改了只改下面 PRICES；每行记录里会写明用的单价日期，旧行不回算。
- ⚠️ transcript 里的 output_tokens 是流式输出中途的计数，常常偏低；cache 读写与 input 比较准。
  所以 output 费用只是下限，COST-LOG 里会标注。
"""
import argparse, collections, glob, json, os, re, sys, datetime

PROJ = os.path.expanduser('~/.claude/projects/-Users-yquanloo-Documents-my-agent')
LOG = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'COST-LOG.md')
CX_LOG = os.path.expanduser('~/Documents/my-agent/.ops/cx-usage.log')

# USD / 百万 token。来源 platform.claude.com/docs/en/models/sonnet-5-5/overview（2026-10-11 查）
# cache_write 用 1 小时 TTL 价（Claude Code 会话是 1h TTL）；5 分钟 TTL 价是 2.50。
PRICES = {
    'claude-sonnet-5-5': dict(input=2.0, output=10.0, cache_read=0.10, cache_write=4.0),
}
PRICE_DATE = '2026-10-11'
FIELDS = {'input_tokens': 'input', 'output_tokens': 'output',
          'cache_creation_input_tokens': 'cache_write', 'cache_read_input_tokens': 'cache_read'}

ap = argparse.ArgumentParser()
ap.add_argument('slug'); ap.add_argument('--session'); ap.add_argument('--note', default=''); ap.add_argument('--dry', action='store_true')
a = ap.parse_args()

if a.session:
    sid = a.session
else:
    main = max(glob.glob(PROJ + '/*.jsonl'), key=os.path.getmtime)
    sid = os.path.basename(main)[:-6]
files = [f'{PROJ}/{sid}.jsonl'] + glob.glob(f'{PROJ}/{sid}/subagents/*.jsonl')

tot = collections.defaultdict(collections.Counter)   # (角色, 模型) -> 计数
seen = set()
for f in files:
    role = 'sub' if '/subagents/' in f else 'main'
    for line in open(f, encoding='utf-8'):
        try: d = json.loads(line)
        except Exception: continue
        m = d.get('message') or {}
        u = m.get('usage')
        if not u or m.get('role') != 'assistant' or m.get('model') == '<synthetic>': continue
        k = (m.get('id'), d.get('requestId'))
        if k in seen: continue
        seen.add(k)
        c = tot[(role, m.get('model'))]
        for src, dst in FIELDS.items(): c[dst] += u.get(src) or 0
        c['turns'] += 1

def cost(model, c):
    p = PRICES.get(model)
    if not p: return None
    return sum(c[k] * p[k] for k in p) / 1e6

rows, usd, unknown = [], 0.0, []
sums = collections.Counter()
for (role, model), c in sorted(tot.items()):
    x = cost(model, c)
    if x is None: unknown.append(model)
    else: usd += x
    for k in ('input', 'output', 'cache_write', 'cache_read', 'turns'): sums[k] += c[k]
    rows.append(f"{role}/{model}: in {c['input']:,} · out {c['output']:,} · 缓存写 {c['cache_write']:,} · 缓存读 {c['cache_read']:,} · {c['turns']} 轮 → ${x:.2f}" if x is not None else f"{role}/{model}: 无单价")

cx_calls = 0
if os.path.exists(CX_LOG):
    cx_calls = sum(1 for l in open(CX_LOG, encoding='utf-8') if 'cx-draw' in l and a.slug in l)

today = datetime.date.today().isoformat()
line = (f"| {today} | `{a.slug}` | {sums['turns']} | {sums['input']:,} | {sums['output']:,} | {sums['cache_write']:,} | {sums['cache_read']:,} "
        f"| ≈${usd:.2f}{'（有模型缺单价：' + ','.join(unknown) + '）' if unknown else ''} | {cx_calls} | {a.note} |")

print('\n'.join(rows)); print(line)
if a.dry: sys.exit(0)

head = f"""# 工具开发 token 用量与费用记录

每个工具完成收工时由 `scripts/log-cost.py <slug>` 追加一行（规则见 `~/.claude/skills/newtool/SKILL.md`）。

- **费用是 API 等价估算**（按公开单价折算），老师实际走订阅额度，不是实际扣款。
- 单价（USD／百万 token，{PRICE_DATE}）：Sonnet 5.5 输入 $2、输出 $10、缓存读 $0.10、缓存写(1h) $4。换模型或单价变了改 `scripts/log-cost.py` 的 `PRICES`，旧行不回算。
- ⚠️ 输出 token 在 transcript 里是流式中途计数，通常偏低，所以「输出」栏和总额是**下限**；缓存栏比较准。
- 范围＝该会话主对话＋它派的子代理；**同一会话做了多个工具时，只能整段算在一起**，备注里写清楚。会话在记录之后还有收工本身的用量，没算进去。
- cx 生图次数不计金额（走 A 帐号额度），只记次数。

| 日期 | slug | 轮数 | 输入 | 输出 | 缓存写 | 缓存读 | 费用(USD) | cx 生图 | 备注 |
|---|---|---|---|---|---|---|---|---|---|
"""
if not os.path.exists(LOG): open(LOG, 'w', encoding='utf-8').write(head)
open(LOG, 'a', encoding='utf-8').write(line + '\n')
print('已追加到', os.path.normpath(LOG))
