# 从零制作 Portfolio — 过程教程

持续记录，项目结束后统一整理交付。

## 1. 准备开发环境

安装 VS Code（编辑文件）、Node.js（运行本地工具）、Git（记录版本和同步）。本次已通过用户普通 Windows 终端截图确认 Node.js v24.19.0 与 Git 2.55.0.windows.3，VS Code 1.137.0 已在本机确认。

## 2. 获取项目

GitHub 仓库为 zhongyc519/yuchen-portfolio。VS Code 的 Git: Clone 遇到 Empty reply from server；浏览器可访问，所以用户改用绿色 Code → Download ZIP → 全部提取，并在 VS Code 打开文件夹。

ZIP 下载不包含 Git 历史，也不会自动同步更改。后续仍需单独恢复版本管理与 GitHub 同步。

## 3. 放入协作目录

最初解压在桌面的 yuchen-portfolio-main。助手只能在特定工作目录写入，因此复制到了当前 outputs/yuchen-portfolio；桌面原文件保留。后续只修改当前副本。

## 4. 先做能打开的 V0.1

原方案是 React + Vite。当前会话无法获取 npm 依赖，申请联网提权也被自动权限审核拒绝，因此先交付无需依赖下载的 HTML/CSS/JavaScript 本地版，之后再迁移。

页面分为个人定位、关于、能力、案例、作品选集、AI Lab、经历、简历与联系方式。所有没有事实材料的区块都明确标注待补充，没有编造职业记录或客户成果。首页抽象造型与作品占位图用 CSS 绘制。

英文默认，中文按钮可切换文案。案例卡片展示 Context → Contribution → Insight → Execution 的结构。作品区按类别筛选。Talk to Yuchen 先提供页面导览，不调用模型。

## 5. 运行与验证

直接在浏览器打开 index.html；或者在 VS Code 的“终端 → 新建终端”输入 node server.mjs，访问 http://127.0.0.1:4173 。关闭服务按 Ctrl+C。

验证记录：Node HTTP 测试通过（首页与查询字符串、缺失资源、路径越界和错误编码）；脚本语法检查通过。在真实浏览器检查了桌面首页、390px 宽度中英文手机布局、语言切换、单项作品筛选、案例弹窗和 Escape 关闭导览。浏览器记录未发现 error 级日志。当前桌面和390px布局无横向溢出。

## 6. 下一轮

先由 Yuchen 评价整体视觉，再提供确认后的 CV、个人照片与首个项目材料。补齐内容，之后恢复 React/Vite 与 GitHub 同步，再安排部署与发布检查。

## 7. 尝试第二个视觉方向

用户提供 Motion Sites 的 EMBER.dsgn 截图，要求研究并试一版。保留 index.html 为绿色 A 版；创建 ember.html 作为 B 版，共用已有内容与交互，单独添加 ember.css 和 ember-content.js。

B 版采用浅灰背景、左侧磨砂、超大姓名与原创岩石/橙色玻璃画面。图像由内置 imagegen 生成，保存到 assets/ember-study.png，再用 CSS 做轻微漂浮，并为减少动态偏好关闭动画。

导航按职业作品集信息顺序调整：关于、能力、作品、AI 实验室、简历/联系。研究来源、设计判断、生成提示词详见 EMBER_STUDY.md。
