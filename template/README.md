# 项目

- 项目打开时，如果 vscode 编辑器右下角弹出建议安装扩展，请同意安装，具体安装的扩展在根目录下的.vscode/extensions.json。
- 必须使用 pnpm 作为依赖管理工具。
- 本项目的 vue 路由依赖于权限接口，请在后台配置权限，使用 url 获取 menuId 调接口获取 vue 路由（已配置接口调用）。

### 项目创建时候的本地环境：

能正常适配即可，不必完全相同。

- Node 版本：22.20.0
- pnpm 版本：10.20.0

### 本项目额外配置了：

- 强制使用 pnpm,https://juejin.cn/post/7505989436360261695
- 环境变量文件
- 七牛文件上传【@/utils/upload.ts】
- aieditor 富文本组件 【@/components/BaseEditor.vue】,不需要或使用其他富文本组件可删除
- ant-design-vue 的引入
- eslint和prettier
- visualizer 插件，用于开发时性能分析（pnpm report:master）
- 移除vue默认的初始文件和页面，新增reset.css
- 样式默认为 scss 的 vue 文件生成模板，在.vue文件中打出 'vue3' 即可生成（vscode编辑器可用）
- dayjs，默认语言已配置为中文
- 生产环境自动移除console
- topLevelAwait插件，避免在ts文件的顶级await打包时报错
- 路由模式和路径自定义（historyMode）
- 封装了 axios 网络请求
- husky, 在代码commit前会执行 lint 检查以及格式化，提高代码规范，确保提交代码格式统一

# Project Setup

### 安装依赖

```sh
pnpm install
```

### 项目启动（不同环境）

```sh
pnpm dev:local # 本地启动连后端人员本地，VITE_TARGET_URL填写后端人员的电脑ip及端口
pnpm dev:master # 本地启动连测试环境
pnpm dev:tencentCloud # 本地启动连腾讯云
```

### 打包构建(不同环境)

```sh
pnpm build:master # 打包测试环境
pnpm build:tencentCloud # 打包腾讯云环境
```

### 打包构建后分析

```sh
pnpm report:master # 打包测试环境并生成分析报告
pnpm report:tencentCloud # 打包腾讯云环境并生成分析报告
```

其他命令请自行查看package.json文件
