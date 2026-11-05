# 熊猫成长乐园

一年级下册与二年级衔接数学互动页面。基于原始数学题库增加冒险乐园首页，使用原生 HTML、CSS、JavaScript。原数学题库与动画课堂仍从首页进入。

线上地址：https://math-wonderland.netlify.app

Netlify 管理：https://app.netlify.com/projects/math-wonderland

## 开始开发

需要 Node.js 22.13 或更高版本（推荐 Node.js 22）。

```sh
nvm use
npm ci
npm run dev
```

打开 http://localhost:5173，修改 `index.html` 后刷新页面即可。后续图片、音频等独立资源放在 `assets/` 下，构建时会一并复制。

## 构建与预览

```sh
npm run build
npm run preview
```

构建结果位于 `dist/`，Netlify 只发布这个目录，不会发布 Git 元数据与项目配置。

## 部署到 Netlify

已提供 `netlify.toml`，构建命令为 `npm run build`，发布目录为 `dist`。

首次在新电脑上操作：

```sh
npx netlify login
npx netlify link
```

后续更新：

```sh
npm run deploy
```

`.netlify/` 只保存本机的站点关联，不提交到 Git。登录凭据不写入项目。

## Git 迭代

```sh
git status
git add index.html README.md
git commit -m "描述本次修改"
npm run deploy
```

仅添加实际存在且本次修改的文件。当前是本地 Git 仓库；如以后连接 GitHub/GitLab，可在 Netlify 导入远程仓库，启用 push 后自动部署。本地提交本身不会自动发布。

## 当前页面的依赖与数据

- Tailwind CSS 使用 CDN，字体使用 Google Fonts，需要网络访问；后续可再改为本地资源。
- 学习进度使用浏览器本地存储，不会跨设备同步。从本地文件迁移到网站后，原本地进度不会自动带过去。
- 初次上线保持原页面逻辑与样式。

## 冒险首页与趣味游戏（2026-11-05）

- `assets/park.css`：首页布局、卡片、手机适配。
- `assets/park.js`：每日任务、本地学习报告、成长徽章。
- `games/cyberhop.html`：从 `index-v6.html` 导入的星际数学跳跃游戏，增加返回乐园入口。
- 首页“数学闯关”进入原题库，“每日挑战”生成 5 道综合题，“动画课堂”进入原讲解页面。
- 语文乐园为即将开放入口；星星奖励展示累计成就，不提供兑换商店。
- 每日进度按设备日期统计当天交卷时已作答的题数。游戏得分独立于学习星星，不自动兑换。
- 构建会将 `assets/`、`games/` 一起发布到 `dist/`。游戏仍依赖原文件的 Three.js 与 Tailwind CDN。

验收：页面及游戏脚本语法、唯一 DOM ID、本地页面路由、桌面与 390px 手机首页、游戏加载/答题加分/返回首页、五题挑战与成长图鉴。未运行全量题库测试。

站点展示名称统一为“熊猫成长乐园”，栏目包括数学、语文（即将开放）与趣味游戏。当前访问地址仍为 https://math-wonderland.netlify.app 。

## 首页视觉更新（2026-11-05）

- 移除与大卡片重复的顶部导航，进入练习后显示“返回乐园”。已有未交卷题目可从横幅继续。
- 新版欢迎区使用 ChatGPT 网页生成并导出的角色动画，游戏卡片使用同系列插画，来源记录：`docs/visual-assets.md`。
- 点击“暂停动画”会切换角色静态封面并暂停局部星光动画；偏好保存在当前浏览器，默认尊重系统减少动态效果设置。
