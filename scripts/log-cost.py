#!/usr/bin/env python3
"""每次工具收工（含每一次调整）记一笔开发用量与费用，重新生成 teaching-tools/COST-LOG.md。

用法：
  python3 scripts/log-cost.py <slug> --what "这次做了什么" --actual <状态栏$> [--note "备注"] [--session <id>] [--dry]

- 老师规矩（2026-10-11）：每次收工都记；每次调整各记一笔；逐笔显示 token；最后给总花费。
- `--actual`：问老师要 Claude Code 状态栏上那个 💰 数字（**本会话累计值**）。它才是实际用量；
  脚本从 transcript 估的 $ 只是参考（output 计数偏低、子代理记录不全，会低估约两成）。
  同一会话多次记账：token 和 actual 都自动减掉该会话上次记的累计值，只记增量。
  没给 --actual 就用脚本估算值并标「≈估」。
- 数据存 COST-LOG.json（唯一来源），COST-LOG.md 每次整份重新生成，别手改 md。
- 默认取 ~/.claude/projects/-Users-yquanloo-Documents-my-agent/ 最新修改的会话（= 当前会话）；
  主对话＋子代理（<id>/subagents/*.jsonl）一起算，按 message id 去重。
- 费用是「按订阅实际消耗折算的 API 等价金额」，老师走订阅额度，不是实际扣款。cx 生图只记次数。
"""
import argparse, collections, datetime, glob, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.expanduser('~/.claude/projects/-Users-yquanloo-Documents-my-agent')
DATA = os.path.join(HERE, '..', 'COST-LOG.json')
MD = os.path.join(HERE, '..', 'COST-LOG.md')
CX_LOG = os.path.expanduser('~/Documents/my-agent/.ops/cx-usage.log')

# USD / 百万 token。来源 platform.claude.com/docs/en/models/sonnet-5-5/overview（2026-10-11 查）
# cache_write 用 1 小时 TTL 价（Claude Code 会话是 1h TTL）；5 分钟 TTL 价是 2.50。
PRICES = {'claude-sonnet-5-5': dict(input=2.0, output=10.0, cache_read=0.10, cache_write=4.0)}
PRICE_DATE = '2026-10-11'
FIELDS = {'input_tokens': 'input', 'output_tokens': 'output',
          'cache_creation_input_tokens': 'cache_write', 'cache_read_input_tokens': 'cache_read'}
KEYS = ('input', 'output', 'cache_write', 'cache_read', 'turns')


def scan(sid):
    files = [f'{PROJ}/{sid}.jsonl'] + glob.glob(f'{PROJ}/{sid}/subagents/*.jsonl')
    tot = collections.defaultdict(collections.Counter)
    seen = set()
    for f in files:
        if not os.path.exists(f): continue
        for line in open(f, encoding='utf-8'):
            try: d = json.loads(line)
            except Exception: continue
            m = d.get('message') or {}
            u = m.get('usage')
            if not u or m.get('role') != 'assistant' or m.get('model') == '<synthetic>': continue
            k = (m.get('id'), d.get('requestId'))
            if k in seen: continue
            seen.add(k)
            c = tot[m.get('model')]
            for src, dst in FIELDS.items(): c[dst] += u.get(src) or 0
            c['turns'] += 1
    cum = collections.Counter(); est = 0.0; unknown = []
    for model, c in tot.items():
        for k in KEYS: cum[k] += c[k]
        p = PRICES.get(model)
        if p: est += sum(c[k] * p[k] for k in p) / 1e6
        else: unknown.append(model)
    return dict(cum), est, unknown


def load():
    return json.load(open(DATA, encoding='utf-8')) if os.path.exists(DATA) else []


def n(x): return f'{x:,}'


def render(entries):
    out = ["# 工具开发 token 用量与费用记录", "",
           "老师规矩（2026-10-11）：**每次工具收工、每一次调整都记一笔**，逐笔显示 token，最后总花费在文末。",
           "记账命令：`python3 scripts/log-cost.py <slug> --what \"做了什么\" --actual <状态栏💰数字>`（规则见 `~/.claude/skills/newtool/SKILL.md`）。",
           "",
           "- **「采用 $」是实际花费**：以老师给的 Claude Code 状态栏 💰 数字为准（本会话累计，同会话多笔自动取增量）；没给时用脚本估算并标「≈估」。",
           f"- 脚本估算单价（USD／百万 token，{PRICE_DATE}）：Sonnet 5.5 输入 $2、输出 $10、缓存读 $0.10、缓存写(1h) $4。**估算偏低**：transcript 的输出 token 是流式中途计数、子代理记录不全，实际比估算高约两成。",
           "- 费用是 API 等价金额，老师走订阅额度，不是实际扣款。cx 生图（A 帐号额度）只记次数。",
           "- 「轮数／token」是该笔的增量；一个会话做了多个工具时，备注里写清楚归属。", ""]
    by = collections.OrderedDict()
    for e in entries: by.setdefault(e['slug'], []).append(e)
    grand = 0.0; gt = collections.Counter(); gcx = 0
    for slug, es in by.items():
        out += [f"## `{slug}`", "",
                "| # | 日期 | 做了什么 | 轮数 | 输入 | 输出(下限) | 缓存写 | 缓存读 | 脚本估算$ | 采用$ | cx 生图 | 备注 |",
                "|---|---|---|---|---|---|---|---|---|---|---|---|"]
        sub = 0.0; st = collections.Counter(); scx = 0
        for i, e in enumerate(es, 1):
            used = e['actual_usd'] if e.get('actual_usd') is not None else e['est_usd']
            mark = '' if e.get('actual_usd') is not None else '≈估 '
            sub += used; scx += e.get('cx_draws', 0)
            for k in KEYS: st[k] += e[k]
            out.append(f"| {i} | {e['date']} | {e['what']} | {n(e['turns'])} | {n(e['input'])} | {n(e['output'])} | {n(e['cache_write'])} | {n(e['cache_read'])} "
                       f"| ${e['est_usd']:.2f} | **{mark}${used:.2f}** | {e.get('cx_draws', 0)} | {e.get('note', '')} |")
        out += [f"| | | **小计（{len(es)} 笔）** | {n(st['turns'])} | {n(st['input'])} | {n(st['output'])} | {n(st['cache_write'])} | {n(st['cache_read'])} | | **${sub:.2f}** | {scx} | |", ""]
        grand += sub; gcx += scx
        for k in KEYS: gt[k] += st[k]
    out += ["---", "", "## 总花费", "",
            "| 工具数 | 笔数 | 轮数 | 输入 | 输出(下限) | 缓存写 | 缓存读 | cx 生图 | **总花费(USD)** |",
            "|---|---|---|---|---|---|---|---|---|",
            f"| {len(by)} | {len(entries)} | {n(gt['turns'])} | {n(gt['input'])} | {n(gt['output'])} | {n(gt['cache_write'])} | {n(gt['cache_read'])} | {gcx} | **${grand:.2f}** |", ""]
    open(MD, 'w', encoding='utf-8').write('\n'.join(out))
    return grand


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('slug'); ap.add_argument('--what', required=True)
    ap.add_argument('--actual', type=float, help='状态栏💰数字（本会话累计）')
    ap.add_argument('--note', default=''); ap.add_argument('--session'); ap.add_argument('--dry', action='store_true')
    a = ap.parse_args()
    sid = a.session or os.path.basename(max(glob.glob(PROJ + '/*.jsonl'), key=os.path.getmtime))[:-6]
    cum, est_cum, unknown = scan(sid)
    entries = load()
    prev = [e for e in entries if e.get('session') == sid]
    base = collections.Counter(); base_est = 0.0; base_act = 0.0
    for e in prev:
        for k in KEYS: base[k] += e[k]
        base_est += e['est_usd']
        if e.get('actual_usd') is not None: base_act += e['actual_usd']
    entry = {k: cum[k] - base[k] for k in KEYS}
    entry.update(date=datetime.date.today().isoformat(), slug=a.slug, what=a.what, session=sid,
                 est_usd=round(est_cum - base_est, 4), note=a.note + ('；有模型缺单价：' + ','.join(unknown) if unknown else ''))
    entry['actual_usd'] = round(a.actual - base_act, 4) if a.actual is not None else None
    cx = 0
    if os.path.exists(CX_LOG):
        cx = sum(1 for l in open(CX_LOG, encoding='utf-8') if 'cx-draw' in l and a.slug in l)
    entry['cx_draws'] = max(0, cx - sum(e.get('cx_draws', 0) for e in entries if e['slug'] == a.slug))
    print(json.dumps(entry, ensure_ascii=False, indent=1))
    if a.dry: return
    entries.append(entry)
    json.dump(entries, open(DATA, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f"已记账；总花费 ${render(entries):.2f}（见 COST-LOG.md）")


if __name__ == '__main__':
    main()
