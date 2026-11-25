# 网站统一语音配置

网站通过 `/.netlify/functions/speech` 调用 MiniMax；访客直接点击读题或朗诵，无需配置 Key。页面已移除语音设置按钮、表单和旧浏览器配置。原有“音效开/关”继续控制语音，关闭时也停止正在播放的 MiniMax 音频。

## 配置位置

- 本地私有 Key：项目根目录 `.env`，文件权限 600，已被 Git 忽略。
- 默认音色与模型：`config/speech.mjs`。中文为 `Chinese (Mandarin)_Wise_Women`（阅历姐姐），语速 0.95，用于自然清晰的女老师风格朗读；英文保留 `English_Graceful_Lady`，语速 0.9，并启用英文发音增强。模型 `speech-2.8-turbo`，PCM16 单声道 32 kHz，保留流式播放。
- `.env` 中的 `MINIMAX_VOICE_ID` 可以覆盖中文音色，`MINIMAX_ENGLISH_VOICE_ID` 可以独立覆盖英文音色；示例见 `.env.example`。两者都未设置时使用上述本地配置默认值。
- 线上 Key 与音色：Netlify 网站环境变量 `MINIMAX_API_KEY` / `MINIMAX_VOICE_ID` / `MINIMAX_ENGLISH_VOICE_ID`。私有 Key 不进入 HTML、前端 JS、静态构建目录或 Git。

## 本地与部署

使用 Node.js 22.13 或更高版本。

- `npm run dev`：自动读取本地 `.env`，本地开发服务器也提供相同的语音接口。
- `npm run configure:speech`：把本地 Key 与音色保存到已绑定 Netlify 网站，命令不打印值。
- `npm run deploy`：先同步语音配置，再构建并发布静态页面及 `netlify/functions/`，后续无需重复手动设置。

不直接双击 HTML 来测试服务端语音；请使用本地开发地址或正式网站。语音服务临时不可用时，页面自动回退浏览器语音。

接口只接受同源 JSON POST、服务端模型与音色、单次 1–800 字。前端英文请求携带 `language: "en"`，服务端选英文角色；`language: "zh"` 或未传时选中文角色。其他语言值会被拒绝。浏览器不能指定音色、Key 或模型。

英语读题、魔方馆单词/例句、角色鼓励和英语动画课堂共用英文朗读入口。英语课堂的步骤按钮显示“英文朗读”，按步骤朗读英文例词或例句；中文说明仍显示在画面中。服务失败时浏览器回退也优先选英语音色。

2026-11-14 本地验证：`node --test scripts/speech.test.mjs` 共 9 项通过，覆盖语言路由、中英独立配置、客户端实际请求、流式首块、英语步骤文本、回退英语音色、来源校验及错误脱敏。脚本语法与差异空白检查通过，未运行全量测试。

真实英文短句合成返回 200，音频约 3.49 秒，试听保存在 `design/source/speech/english-graceful-lady.wav`，内容为“Hello! Let's learn English together.”。浏览器检查英语课堂专用朗读按钮并点击试读；本地服务已重启至新版本，预览地址 <http://localhost:5205/>。按用户要求，本次没有部署或更新线上环境；以后执行原发布命令时会一并同步英文音色配置。

英文音色编号参考 [MiniMax 官方系统音色列表](https://platform.minimax.cn/docs/faq/system-voice-id)。

2026-11-14 中文女声更新（现已部署）：同步修改默认配置、本地 `.env` 中文覆盖项及 `.env.example`，避免旧“憨憨萌兽”覆盖新默认值。中英配置继续分开管理。数学、语文、古诗、动画和跳跳乐均使用相同的中文服务端音色；跳跳乐的读题和博士锦囊由原浏览器语音改为网站 MiniMax 接口。

原流式播放引擎移至 `assets/speech-client.js`，主站与游戏共用。游戏在换题、关闭音效及离开页面时停止朗读。中文回退保留正常音调并优先选设备上的普通话成年女声；设备无对应声线时由浏览器提供可用普通话语音。英文的角色、语速及回退选择保持原值。

定向验证：`node --test scripts/speech.test.mjs scripts/game-difficulty.test.mjs` 共 19 项通过，覆盖新中文默认值、英语配置独立、游戏真实请求与静音、减号读法及中文回退。共享脚本、两页内联脚本语法与差异空白检查通过，未运行全量测试或整站构建。真实中文短句合成返回 200，约 6.57 秒，文件 `design/source/speech/chinese-teacher.wav`。Safari 加载主站和跳跳乐、点击读题及切换游戏音效，页面入口正常。本地服务已重启至新配置，预览 <http://localhost:5205/>。

同日后续发布 `6af7f78c07018617c0b20c93` 已同步中文女声和原英文音色；正式中文接口实际请求返回 200、合成完整且音频非空，详见 [发布记录](releases/2026-11-14.md)。
