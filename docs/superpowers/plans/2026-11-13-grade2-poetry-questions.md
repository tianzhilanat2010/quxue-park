# 二年级古诗题目范围与基础题库 Implementation Plan

**Goal:** 按用户确认，默认练二年级上下册 14 首，所有诗句题及选项均来自此范围，避免旧错题带回课外诗句。

**Architecture:** 以现有 `POEM_LIBRARY` 为正文来源，新增独立题库模块，每首提供诗句接龙、字词理解、简单诗意三类题，共 42 题。专项卷、综合卷、画卷微课共用生成器；旧错题进入练习前更新为当前课内题。

**Tech Stack:** 原生 JavaScript、现有 HTML/Canvas、Node 定向测试、Netlify。

- [x] 先添加范围回归测试，确认旧题库含课外选项且缺少 42 道基础题的覆盖。
- [x] 新增 `assets/poetry-questions.js`，接入 `index.html`，保持每轮篇目均衡，修正《敕勒歌》正文和拼音不一致。
- [x] 更新旧错题重练及页面说明；测试专项、综合、分册和旧题迁移。
- [x] 运行古诗相关测试、查看实际题目页面、部署并核对线上版本。只做定向验证，不运行全量测试。

结果：9 项题库与篇目定向测试通过，内联脚本及新模块语法检查通过；浏览器确认新版入口、简单诗意题及接龙题正常显示。Netlify 发布 `6af67a72ab9c598edb2cd04f`，线上页面和题库资源均返回 200，页面逻辑及题库文件与本地发布包一致。

涉及文件：`index.html`、`assets/poetry-questions.js`、`scripts/poetry-library.test.mjs`、`scripts/poetry-questions.test.mjs`、`docs/poetry-scenes.md`。
