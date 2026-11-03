# 奇妙数学乐园

一年级下册与二年级衔接数学互动页面。原始下载文件已原样保存为 `index.html`，当前使用原生 HTML、CSS、JavaScript，无前端框架。

线上地址：https://starzhang-math-wonderland.netlify.app

Netlify 管理：https://app.netlify.com/projects/starzhang-math-wonderland

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
