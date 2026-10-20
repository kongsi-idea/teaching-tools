#!/usr/bin/env python3
"""绿幕素材表 → 去背、切成一张张物件图。

用法（在 teaching-tools/ 跑；numpy 在使用者 site-packages，所以不要加 -I）：python3 scripts/cut-sheet.py <素材表.png> <输出资料夹> <前缀> [--grow 8] [--min 400]
输出：<前缀>-01.png …（按行、再按列排序），另出一张 <前缀>-_contact.png 对照图（编号＋棋盘底）。
"""
import sys, argparse
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ap = argparse.ArgumentParser()
ap.add_argument("src"); ap.add_argument("out"); ap.add_argument("prefix")
ap.add_argument("--grow", type=int, default=8, help="把相邻碎块并成同一件的膨胀像素")
ap.add_argument("--min", type=int, default=400, help="小于这个面积的碎块丢掉")
ap.add_argument("--glass", type=float, default=1.0, help="透明物件用 >1（例 1.6），半透明处更透")
a = ap.parse_args()

im = np.asarray(Image.open(a.src).convert("RGB")).astype(np.float32)
H, W = im.shape[:2]
# 绿幕底色：取四角 40×40 的中位数（不假设刚好是 #00FF00）
c = 40
corners = np.concatenate([im[:c, :c].reshape(-1, 3), im[:c, -c:].reshape(-1, 3),
                          im[-c:, :c].reshape(-1, 3), im[-c:, -c:].reshape(-1, 3)])
G = np.median(corners, axis=0)
r, g, b = im[..., 0], im[..., 1], im[..., 2]
# 绿幕强度：绿比红蓝高多少，跟底色的强度比 → 底色的比例
key = g - np.maximum(r, b)
kbg = G[1] - max(G[0], G[2])
t = np.clip(key / kbg, 0, 1)
t = np.where(t < 0.08, 0, np.where(t > 0.92, 1, (t - 0.08) / 0.84))
alpha = 1 - t
if a.glass != 1.0:            # 透明物件：让半透明处更透
    alpha = np.where(alpha < 0.98, alpha ** a.glass, alpha)
# 还原前景色：观察色 = α·前景 + (1-α)·底色 → 前景 = (观察 - (1-α)·底色) / α
a3 = np.maximum(alpha, 1e-3)[..., None]
fg = np.clip((im - (1 - a3) * G) / a3, 0, 255)
# 剩下的绿边再压一次
fg[..., 1] = np.where(alpha < 0.999, np.minimum(fg[..., 1], np.maximum(fg[..., 0], fg[..., 2]) + 12), fg[..., 1])
rgba = np.dstack([fg, alpha * 255]).astype(np.uint8)

solid = alpha > 0.15
grown = ndimage.binary_dilation(solid, iterations=a.grow)
lab, n = ndimage.label(grown)
boxes = []
for i, sl in enumerate(ndimage.find_objects(lab), 1):
    part = (lab[sl] == i) & solid[sl]
    if part.sum() < a.min:
        continue
    boxes.append((sl, i))

# 按行排序：中心 y 相差不到 1/12 图高算同一行
def key_of(item):
    sl, _ = item
    cy = (sl[0].start + sl[0].stop) / 2
    cx = (sl[1].start + sl[1].stop) / 2
    return (round(cy / (H / 12)), cx)
boxes.sort(key=key_of)

out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
thumbs = []
for k, (sl, i) in enumerate(boxes, 1):
    y0, y1 = max(sl[0].start - 4, 0), min(sl[0].stop + 4, H)
    x0, x1 = max(sl[1].start - 4, 0), min(sl[1].stop + 4, W)
    crop = rgba[y0:y1, x0:x1].copy()
    keep = (lab[y0:y1, x0:x1] == i)
    crop[..., 3] = np.where(keep, crop[..., 3], 0)
    img = Image.fromarray(crop, "RGBA")
    name = f"{a.prefix}-{k:02d}.png"
    img.save(out / name)
    thumbs.append((name, img))
    print(f"{name}  {img.width}x{img.height}  @({x0},{y0})")

# 对照图
cell = 220
cols = 6
rows = (len(thumbs) + cols - 1) // cols
sheet = Image.new("RGBA", (cols * cell, rows * (cell + 24)), (255, 255, 255, 255))
d = ImageDraw.Draw(sheet)
for j, (name, img) in enumerate(thumbs):
    cx, cy = (j % cols) * cell, (j // cols) * (cell + 24)
    for yy in range(0, cell, 16):
        for xx in range(0, cell, 16):
            if (xx // 16 + yy // 16) % 2:
                d.rectangle([cx + xx, cy + yy, cx + xx + 15, cy + yy + 15], fill=(225, 225, 225, 255))
    t = img.copy(); t.thumbnail((cell - 10, cell - 10))
    sheet.alpha_composite(t, (cx + (cell - t.width) // 2, cy + (cell - t.height) // 2))
    d.text((cx + 6, cy + cell + 4), name, fill=(0, 0, 0, 255))
sheet.convert("RGB").save(out / f"{a.prefix}-_contact.png")
print(f"共 {len(thumbs)} 件")
