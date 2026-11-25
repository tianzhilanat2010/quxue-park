# 背景音乐

2026-11-10 将原来约 49 秒的合成短循环替换为两首完整器乐配乐。在页头的音乐下拉面板可选择：

- 阳光小径 · 轻快吉他：Kevin MacLeod 的 **Easy Lemon**，82 BPM，约 2 分 6 秒；文件为 `assets/audio/easy-lemon.mp3`。
- 诗意时光 · 轻柔钢琴：Kevin MacLeod 的 **Dream Culture**，70 BPM，约 3 分 34 秒；文件为 `assets/audio/dream-culture.mp3`。

音源来自作者的 [Incompetech 曲库](https://incompetech.com/music/royalty-free/pieces.json)，按 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 使用。音乐面板“配乐署名”、MP3 元数据及 `assets/audio/LICENSE.txt` 均保留作者和许可。处理为 128 kbps MP3、-20 LUFS 目标响度，并加入轻柔淡入淡出；保留完整曲目。原版文件保存在 `design/source/`，旧合成音乐留存作为历史素材。

首页、数学/语文练习及动画课堂共用页头音乐开关。首次访问默认关闭，点击后播放；曲目、播放偏好与音量保存在当前浏览器。切换曲目时保留音量和开启状态。返回访问时可在首次交互后恢复。原有音效和语音开关独立控制。跳岛游戏是独立页面，保留其原有游戏音效。

读题期间音乐降至所选音量的 18%，结束后恢复；隐藏页面或离开时暂停。系统阻止播放或加载失败时，可再次点击音乐按钮重试。没有把浏览器自动播放限制视为成功播放。

- 控制逻辑：`assets/music.js`，使用 HTML Audio 循环及 Web Audio GainNode 调节音量。
- 旧合成音乐脚本 `scripts/render-music.py` 只重制历史文件；普通网站构建不需要重新生成音频。
- 定向验证：`node --test scripts/music.test.mjs`，覆盖主动开启、音量保存、读题降低音量、后台暂停、播放失败、快速切换及曲目选择。
