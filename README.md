# 语境通 - 网络用语与成语转换器

AI 驱动的网络用语与成语双向转换工具，让传统与潮流无缝对接。

## 功能特点

- 网络用语转成语：将流行网络用语转换为相应的传统成语
- 成语转网络用语：将古典成语转换为现代网络表达
- 深色模式支持
- 一键复制结果
- 结果可直接用作下次输入

## 技术栈

- Vue 3 + TypeScript
- Tailwind CSS v4
- shadcn-vue 组件库
- Vite

## 开始使用

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 启动 API 代理服务器
pnpm server
```

## 项目结构

```
src/
├── components/ui/     # shadcn-vue UI 组件
├── composables/       # Vue composables
├── features/          # 功能模块
│   └── converter/     # 转换器功能
└── lib/               # 工具函数
```
