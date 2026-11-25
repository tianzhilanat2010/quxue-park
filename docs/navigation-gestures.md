# 全站左右滑动防误触

2026-11-14 本地更新，尚未部署。首页 `index.html`（含数学、语文、英语、答题和阅读弹窗）与独立游戏 `games/cyberhop.html` 共用 `assets/navigation-guard.css` 和 `assets/navigation-guard.js`。

CSS 关闭横向边界滚动导航，允许纵向触摸滚动和双指缩放。脚本在捕获阶段拦截横向 wheel 和单指横向 touchmove；Ctrl/Command 缩放、纵向滚动、输入控件触摸及点击不作拦截。古诗标签、题号条等横向容器在本容器内消费位移，到左右边界后停止，不再把位移交给浏览器。页面内返回按钮仍能使用。没有添加或循环修改浏览器历史记录。

定向验证：`node --test scripts/navigation-guard.test.mjs`，7 项通过，覆盖左右 wheel、纵向和缩放保留、横向容器两端、滚动单位、不可取消事件、触摸方向与多指、输入控件及两个页面的加载入口。HTML/JS/CSS 语法、差异空白检查和本地资源 200 响应通过。

本地 Safari 检查：首页及游戏左右方向滚动后仍停留原页面；游戏返回首页按钮、首页学科入口和古诗弹窗可正常操作。没有用自动化检查真实手机系统边缘手势，也未运行全量测试。

浏览器限制：该保护针对网页可收到、可取消的手势事件。Safari 对 `overscroll-behavior` 历史导航的支持仍有[公开兼容问题](https://bugs.webkit.org/show_bug.cgi?id=240183)，系统先接管的边缘手势不能保证由网页完全关闭。非被动 wheel 拦截补充 CSS 防护，具体事件能力见 [MDN wheel 文档](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event)。没有修改用户系统或浏览器的全局设置。

本地预览：<http://localhost:5205/>。
