# Selected Work 后台使用指南

这个后台只管理网站里的 **Selected Work**。首页、About、Experience、How I Think & Make、AI Lab、Contact、导航、字体和动画不会由后台改动。

## 第一次设置

1. 在 [Sanity](https://www.sanity.io/) 登录或注册账户，新建一个项目和名为 `production` 的公开数据集。公开数据集让网站可以只读取已发布内容，不需要把私人 token 放进浏览器。
2. 在本机项目根目录复制 `.env.example` 的变量，并填入 Sanity 的 Project ID。`SANITY_STUDIO_PROJECT_ID` 给后台使用，`SANITY_PROJECT_ID` 给网站构建使用；两者通常相同。
3. 执行 `npm run studio:install`，然后执行 `npm run studio:dev`。终端显示的本地网址就是 Sanity Studio 管理后台。用拥有该 Sanity 项目权限的账户登录。
4. 执行 `npm run cms:seed` 重新生成当前内容快照，然后在 `studio` 目录使用 Sanity CLI 导入 `seed/selected-work.ndjson`。这会导入 5 个分类和 9 个现有项目，不需要从零重建文字和分组。
5. 迁移项目默认是 **Preview only**。这是为了防止尚未上传到 Sanity 的本地图片被误发布为空图。每条 **Imported Cover File / Imported Source File** 会告诉你应该上传哪个现有文件。

## 打开后台与日常编辑

执行 `npm run studio:dev`，在浏览器打开显示的网址。左侧进入 **Selected Work → Projects**。

### Create a project / 新建项目

点击 Projects 右上方的新建按钮，选择 Project。填写：

- **Project Title — English / Chinese**：English and Chinese 两种项目标题。
- **Project URL Slug**：点击 Generate，用于形成稳定项目标识。
- **Project Summary**：英文与中文简述。
- **Project Tag**、Year、Client / Project Label、My Contribution。
- **Category**、Featured Project、Project Order、Website Visibility。

Project Order 建议使用 `10, 20, 30, 40`。以后要在两个项目中间插入内容，可以使用 `15`，无需重新编号所有项目。

### Upload a cover / 上传封面

在 **Cover & Sections → Cover Image** 点击上传。可以 replace image，也可以使用 crop / hotspot 调整焦点。填写英文和中文 alt 文本，说明图里真正出现的内容。

### Detail sections / 项目详情段落

在 **Project Sections** 点击 Add item。每个段落都可填写 section number、English and Chinese label、heading、body text。段落数量不固定；可以拖动数组项来改变顺序，也可填写 Section Order 保持明确排序。

### 多图、reorder images 与 Image Layout

打开一个 detail section，在 **Images** 里连续上传图片。拖动图片即可 reorder images；每张图支持：

- English / Chinese alt
- English / Chinese caption
- **Image Layout**：AUTO、WIDE、STANDARD、PORTRAIT

通常保持 AUTO。网站会根据图片比例判断宽幅、标准或竖图；只有需要明确覆盖自动判断时才选择其他模式。图片在详情里保持自然比例，手机端自动排成单列。

### Reorder projects / 调整项目顺序

修改每个项目的 **Project Order**。数值越小，在网站里越靠前。分类也有 Category Order，过滤按钮沿用当前网站样式。

## Preview、Publish 与可见性

Sanity Studio 编辑器本身会立即显示 draft 内容，可在发布前检查每个字段与图片。当前静态网站不会在公共浏览器中读取草稿，这可避免暴露编辑凭据。

完成项目后：

1. 将 **Website Visibility** 设为 **Public on website**。
2. 点击 **Publish**。网站只请求 Sanity 的 published 视图。
3. 如果暂时不想公开，将可见性改为 **Preview only** 或 **Hidden**，再 Publish。这样文档仍保留在后台，但不会出现在网站。

若要 hide a project，可按上一步使用 Hidden。若要 delete a project，打开项目菜单并选择 Delete；删除前建议先确认项目不再需要。若要复制现有项目，使用文档菜单内置的 Duplicate，再修改 slug、内容和 Project Order。

## 网站如何获取内容

访客打开页面时，本地项目内容会先立即显示。随后网站从 Sanity 的公开 CDN 请求已发布项目。成功取得至少一个公开项目时，Selected Work 原位更新；网络错误、Sanity 暂时不可用、配置缺失或返回空数据时，页面安静地保留本地内容，不向访客显示技术错误。

卡片请求适合缩略图的尺寸，详情宽图请求更大的尺寸，并让 Sanity CDN 自动选择格式与质量。非首张详情图使用 lazy loading。

## Vercel 配置

在 Vercel 项目的 Settings → Environment Variables 添加：

- `SANITY_PROJECT_ID`
- `SANITY_DATASET`，通常为 `production`
- `SANITY_API_VERSION`，当前为 `2026-09-21`

这些是公开读取配置，不是密码。不要在 Vercel 或代码中设置浏览器 token。保存后重新部署，构建程序会生成 `dist/cms-config.js`。

在 Sanity 项目的 API / CORS 设置中加入正式网站域名和本地开发网址。生产数据集必须允许公共读取，否则纯静态网站无法安全地在浏览器端获取内容。

## 发布 Sanity Studio

本机确认后台可用后，执行 `npm run studio:build`。要获得独立后台网址，执行 `npm run studio:deploy`，登录 Sanity 并选择 Studio hostname。这个操作需要项目所有者本人完成一次账户授权。以后可以通过该网址登录后台。
