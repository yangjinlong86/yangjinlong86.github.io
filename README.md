# Funny Eagle Blog

一个基于Gatsby构建的个人博客，采用黑客风格主题设计。

## 🎨 主题特性

- **黑客风格设计**：暗色背景搭配绿色主题
- **高科技动效**：代码雨、网格背景、脉冲效果
- **科幻字体**：集成Orbitron和Rajdhani字体
- **数字显示屏风格**：年份标题采用数字显示屏效果
- **优化阅读体验**：黑色背景代码块，易读的灰色正文

## 🚀 快速开始

### 环境要求

- Node.js (推荐16.x或更高版本)
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm start
```

开发服务器将启动在 http://localhost:8000

### 构建生产版本

```bash
npm run deploy
```

这会执行以下操作：
- 清理缓存 (`gatsby clean`)
- 构建项目 (`gatsby build`)
- 部署到GitHub Pages (`gh-pages -d public`)

## 📁 项目结构

```
src/
├── components/     # React组件
├── css/           # 样式文件
│   ├── global.scss        # 全局样式
│   ├── hacker-animate.scss # 黑客动效
│   └── tag.scss          # 标签样式
├── pages/         # 页面文件
└── templates/     # 页面模板
```

## 🎯 可用脚本

- `npm start` - 启动开发服务器
- `npm run ser` - 启动生产服务器预览
- `npm run deploy` - 构建并部署到GitHub Pages
- `npm run lint` - 代码检查
- `npm run format` - 代码格式化

## 🔧 自定义主题

主题样式主要在 `src/css/global.scss` 中定义，使用CSS变量系统：

```scss
:root {
  --backgroundColor: #0a0a0a;
  --textColor: #e8e8e8;
  --accentColor: #00ff41; // 黑客绿
  --linkColor: #00ff41;
}
```

## 🌐 在线访问

项目部署在：[https://yangjinlong86.github.io/](https://yangjinlong86.github.io/)

## 📄 许可证

MIT License
