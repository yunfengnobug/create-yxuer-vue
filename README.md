# create-yxuer-vue

<div align="center">
  <h3>🚀 基于 Vue3 + TypeScript + Vite + Ant Design Vue 的企业级前端脚手架</h3>
  <p>快速创建高质量、可维护的 Vue 3 项目</p>
</div>

## ✨ 特性

- ⚡️ **Vue 3 + Vite** - 极速的开发体验和构建性能
- 🔷 **TypeScript** - 类型安全，提高代码质量
- 🎨 **Ant Design Vue** - 企业级 UI 组件库
- 📦 **Pinia** - 轻量级状态管理
- 🛣️ **Vue Router 4** - 支持 Hash 和 History 模式
- 🔧 **多环境配置** - 本地、测试、生产环境完整支持
- 📝 **代码规范** - ESLint + Prettier + Husky
- 🎯 **开箱即用** - 预置常用工具和配置

## 📦 内置功能

### 核心功能

- ✅ Axios 网络请求封装（支持拦截器、错误处理）
- ✅ 路由权限管理（基于后台接口）
- ✅ 环境变量配置（devlocal/devmaster/devtencentCloud/prodmaster/prodtencentCloud）
- ✅ 代理配置（自动代理多个后端接口路径）
- ✅ 日期处理（dayjs，已配置中文）
- ✅ 文件下载工具
- ✅ 样式重置（reset.css）

### 可选功能

- 🖊️ 富文本编辑器（AIEditor）
- 📤 文件上传工具（七牛云）
- 📸 图片预览组件

### 开发工具

- 📊 打包分析（visualizer）
- 🧹 自动移除 console（生产环境）
- 🔄 热更新和 DevTools
- 📏 强制使用 pnpm
- 🎨 Vue3 代码片段（vscode）

## 🚀 快速开始

### 使用 npm

```bash
npm create yxuer-vue@latest
```

### 使用 pnpm（推荐）

```bash
pnpm create yxuer-vue
```

### 使用 yarn

```bash
yarn create yxuer-vue
```

### 指定项目名称

```bash
npm create yxuer-vue@latest my-vue-app
pnpm create yxuer-vue my-vue-app
```

## 📋 创建流程

运行命令后，您将看到以下交互式提示：

1. **项目名称** - 输入您的项目名称（默认：yxuer-vue-project）
2. **目录处理** - 如果目录已存在，选择如何处理
3. **项目标题** - 设置浏览器标签页显示的标题（默认：智慧校园）
4. **应用 ID** - 设置应用标识（默认：YXUER_HOME）
5. **路由模式** - 选择 Hash 或 History 模式（推荐 Hash）
6. **富文本编辑器** - 是否需要 AIEditor
7. **文件上传** - 是否需要七牛云上传工具

## 🛠️ 项目配置

创建完成后，进入项目目录：

```bash
cd my-vue-app
```

### 安装依赖

```bash
pnpm install
```

### 配置环境变量

根据实际情况修改对应的 `.env.*` 文件：

- `.env` - 通用配置
- `.env.devlocal` - 本地开发（连接后端开发人员本地）
- `.env.devmaster` - 测试环境
- `.env.devtencentCloud` - 腾讯云开发环境
- `.env.prodmaster` - 生产环境（测试服）
- `.env.prodtencentCloud` - 生产环境（腾讯云）

### 开发运行

```bash
# 本地开发（连接后端本地）
pnpm dev:local

# 连接测试环境
pnpm dev:master

# 连接腾讯云
pnpm dev:tencentCloud
```

### 构建生产

```bash
# 打包到测试环境
pnpm build:master

# 打包到腾讯云
pnpm build:tencentCloud
```

### 打包分析

```bash
# 生成测试环境打包分析报告
pnpm report:master

# 生成腾讯云打包分析报告
pnpm report:tencentCloud
```

### 其他命令

```bash
# 类型检查
pnpm type-check

# 代码检查和修复
pnpm lint

# 代码格式化
pnpm format
```

## 📂 项目结构

```
my-vue-app/
├── build/              # 构建工具
│   └── utils.ts        # Vite 配置工具函数
├── public/             # 静态资源
│   └── favicon.ico
├── src/
│   ├── api/            # API 接口定义
│   │   └── index.ts
│   ├── assets/         # 资源文件
│   │   └── styles/
│   │       └── reset.css
│   ├── components/     # 公共组件
│   │   ├── BaseEditor.vue      # 富文本编辑器（可选）
│   │   └── ImagePreview.vue    # 图片预览
│   ├── router/         # 路由配置
│   │   └── index.ts
│   ├── stores/         # Pinia 状态管理
│   │   └── counter.ts
│   ├── utils/          # 工具函数
│   │   ├── dayjs.ts            # 日期处理
│   │   ├── download.ts         # 文件下载
│   │   ├── index.ts            # 通用工具
│   │   ├── request.ts          # Axios 封装
│   │   ├── request.doc.md      # 请求工具文档
│   │   └── upload.ts           # 文件上传（可选）
│   ├── views/          # 页面组件
│   │   └── layout/
│   │       └── index.vue
│   ├── App.vue         # 根组件
│   └── main.ts         # 入口文件
├── .env                # 通用环境变量
├── .env.devlocal       # 本地开发环境变量
├── .env.devmaster      # 测试环境变量
├── .env.devtencentCloud        # 腾讯云开发环境变量
├── .env.prodmaster     # 生产环境变量（测试服）
├── .env.prodtencentCloud       # 生产环境变量（腾讯云）
├── eslint.config.ts    # ESLint 配置
├── index.html          # HTML 模板
├── package.json
├── tsconfig.json       # TypeScript 配置
└── vite.config.ts      # Vite 配置
```

## 🔑 核心功能说明

### 路由权限管理

本项目的路由依赖于后台权限接口，使用 URL 参数 `menuId` 动态获取路由配置：

```typescript
// src/router/index.ts
// 已预置权限路由加载逻辑
```

### 网络请求

已封装 Axios，包含：
- 请求/响应拦截器
- 错误统一处理
- 自动 Token 处理
- 多环境 API 地址配置

详细使用方法见 `src/utils/request.doc.md`

### 多环境配置

通过 Vite 的 mode 实现多环境：

```javascript
// 在 package.json 中已配置多个启动命令
{
  "scripts": {
    "dev:local": "vite --mode devlocal",
    "dev:master": "vite --mode devmaster",
    "dev:tencentCloud": "vite --mode devtencentCloud",
    // ...
  }
}
```

### 代码规范

- **提交前自动检查** - Husky + lint-staged
- **自动格式化** - Prettier
- **代码质量检查** - ESLint

## ⚙️ 配置说明

### Node 版本要求

- Node.js: `^20.19.0 || >=22.12.0`
- pnpm: 建议使用最新版本

### VSCode 扩展推荐

项目创建后，VSCode 会自动提示安装推荐的扩展，请允许安装以获得最佳开发体验。

### 强制使用 pnpm

本项目配置了 `only-allow pnpm`，确保团队使用统一的包管理器。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License © 2024 王俊杰

## 💡 常见问题

### Q: 如何修改项目端口？

A: 在对应的 `.env.*` 文件中添加 `VITE_PORT=端口号`，或在 `vite.config.ts` 中配置 `server.port`。

### Q: 如何添加新的环境？

A:
1. 创建新的 `.env.环境名` 文件
2. 在 `package.json` 中添加对应的 scripts
3. 在 `vite.config.ts` 中添加对应的代理配置（如需要）

### Q: 路由不生效怎么办？

A: 确保已在后台配置好权限，并且 URL 中包含正确的 `menuId` 参数。

### Q: 如何自定义 Ant Design Vue 主题？

A: 参考 [Ant Design Vue 定制主题](https://antdv.com/docs/vue/customize-theme-cn) 文档，在 `vite.config.ts` 中配置。

## 📮 联系方式

- 作者：王俊杰
- 邮箱：1768669274@qq.com
- GitHub: [https://github.com/your-username/create-yxuer-vue](https://github.com/your-username/create-yxuer-vue)

---

<div align="center">
  如果这个项目对您有帮助，请给一个 ⭐️ Star 支持一下！
</div>
