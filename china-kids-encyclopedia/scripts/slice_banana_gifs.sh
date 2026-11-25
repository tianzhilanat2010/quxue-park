#!/usr/bin/env bash
# 一键将 Nano Banana 生成的全部 12 组 2×2 四格序列图切分为高清流畅循环 GIF 动图
# 用法：将对话中生成的 2×2 序列图保存到 assets/banana/ 目录（按下方文件名命名），然后运行：
#   ./scripts/slice_banana_gifs.sh

set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BANANA_DIR="$ROOT_DIR/assets/banana"
GIF_DIR="$ROOT_DIR/assets/gifs"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

mkdir -p "$BANANA_DIR" "$GIF_DIR"

slice_sheet() {
  local sheet="$1"
  local out_gif="$2"
  local fps="${3:-3}"
  if [[ ! -f "$sheet" ]]; then
    echo "跳过（未找到）：$(basename "$sheet")"
    return
  fi
  echo "正在将 $(basename "$sheet") 切分合成为 $(basename "$out_gif") ..."
  # 自动切除中间与边缘白边（每格取 45% 居中区域）
  ffmpeg -y -v error -i "$sheet" -vf "crop=iw*0.45:ih*0.45:iw*0.025:ih*0.025,scale=480:480" "$TMP_DIR/f1.png"
  ffmpeg -y -v error -i "$sheet" -vf "crop=iw*0.45:ih*0.45:iw*0.525:ih*0.025,scale=480:480" "$TMP_DIR/f2.png"
  ffmpeg -y -v error -i "$sheet" -vf "crop=iw*0.45:ih*0.45:iw*0.025:ih*0.525,scale=480:480" "$TMP_DIR/f3.png"
  ffmpeg -y -v error -i "$sheet" -vf "crop=iw*0.45:ih*0.45:iw*0.525:ih*0.525,scale=480:480" "$TMP_DIR/f4.png"
  ffmpeg -y -v error -framerate "$fps" -i "$TMP_DIR/f%d.png" \
    -vf "split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer" \
    -loop 0 "$out_gif"
  echo "完成：$out_gif"
}

# 《地球家园》6 组
slice_sheet "$BANANA_DIR/earth-spin-sheet.jpg"      "$GIF_DIR/earth-spin.gif"      2
slice_sheet "$BANANA_DIR/volcano-sheet.jpg"         "$GIF_DIR/volcano-erupt.gif"   2.5
slice_sheet "$BANANA_DIR/leaf-factory-sheet.jpg"    "$GIF_DIR/leaf-factory.gif"    2.2
slice_sheet "$BANANA_DIR/dino-sheet.jpg"            "$GIF_DIR/dino-walk.gif"       3.5
slice_sheet "$BANANA_DIR/butterfly-sheet.jpg"       "$GIF_DIR/butterfly-fly.gif"   4
slice_sheet "$BANANA_DIR/water-snowflake-sheet.jpg" "$GIF_DIR/water-snowflake.gif" 2

# 《科学技术》3 组
slice_sheet "$BANANA_DIR/solar-system-sheet.jpg"    "$GIF_DIR/solar-system.gif"    2.5
slice_sheet "$BANANA_DIR/rocket-sheet.jpg"          "$GIF_DIR/rocket-launch.gif"   2.5
slice_sheet "$BANANA_DIR/human-heart-sheet.jpg"     "$GIF_DIR/human-heart.gif"     3.5

# 《人类社会》1 组
slice_sheet "$BANANA_DIR/great-wall-sheet.jpg"      "$GIF_DIR/great-wall.gif"      2

# 《文化生活》2 组
slice_sheet "$BANANA_DIR/peking-opera-sheet.jpg"    "$GIF_DIR/peking-opera.gif"    1.8
slice_sheet "$BANANA_DIR/highspeed-train-sheet.jpg" "$GIF_DIR/highspeed-train.gif" 3.5

echo "全部处理完成！刷新网页即可看到最新手绘 GIF 动图。"
