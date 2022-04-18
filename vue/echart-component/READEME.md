# 如何用 webpack 打包 vue 组件

背景: 公司有个项目使用浏览器引包的形式, 所以打包一个 echart-component 组件

打包一个 vue2.0 echarts 组件, 使其作为 vue 插件引入.

可以在 浏览器 和 node 中打包使用

```bash
yarn add webpack@4.43.0 webpack-cli@3.3.12 -D # webpack 核心库 和 webpack 脚手架

yarn add webpack-dev-server@3.11.0 html-webpack-plugin@4.3.0 -D # 调式 server 和 处理 html

yarn add vue@2.6.11 vue-loader@^15.9.3 vue-template-compiler@2.6.11 -D # vue

yarn add style-loader@1.2.1 css-loader@3.6.0 less-loader@6.2.0 less -D

yarn add echarts -D
```

# 坑

现最新版 vue 为 3.0 webpack 为 5.0

本项目使用的是 vue2.6 和 webapck4.0

安装依赖需要指定本版. 否则会不兼容.

less 和 echarts 暂不影响, 使用最新版

# 目录结构

```bash
echart-component
├── READEME.md
├── build
│ ├── webpack.dev.js
│ └── webpack.prod.js
├── dist
├── example # 浏览器 demo
│ ├── index.html
│ └── reademe.md
├── package.json
├── src
│ ├── EchartComponent.vue # echart-component 组件
│ ├── dev.html
│ ├── dev.js # 调式入口
│ ├── devApp.vue
│ ├── index.js
│ └── template.html
├── webpack.config.js
├── yarn-error.log
└── yarn.lock
```

# 接口

## props

id? String : echarts dom id , 可选, 默认随机字符

clear? Boolean : 自动 setOption 前 clear 每次 setop 可选, 默认 true

theme? Object: 主题

events? Array: 事件列表, 可选, 默认 ,['click']

option Object: 必填

## 方法

getEchart , 获取 echarts 实例
