# rxjs in typescript with webpack

在 typescript 中使用 rxjs 并用 webpack 打包.

作 rxjs 的使用 demo, 并记录一些坑.

yarn init

yarn add webpack webpack-cli -D // webpack 核心库 和  webpack 脚手架

yarn add webpack-dev-server html-webpack-plugin -D // 调式server 和 处理 html

yarn add typescript ts-loader -D // typescript 核心库 和 ts-loadder 用于处理打包 .ts 文件

yarn add rxjs -S // 本 demo 核心对象

在 package.json 配置

```json
"scripts": {
    "build": "webpack",
    "dev": "webpack-dev-server"
  },
```

新建 tsconfig.json  ts配置文件

# FQA

关于 tsconfig.json 的坑

```json
{
    "compilerOptions": {
        "outDir": "./dist/",
        "sourceMap": true,
        "noImplicitAny": true,
        "module": "commonjs", // 坑: 要填写 commonjs. 使用 es2016 等, 会提示 import 找不到
        "target": "es5",
        "allowJs": true
    }
}
```

关于 rxjs import 的坑

```ts

/* 
import { async } from 'rxjs/scheduler/async';
import { of } from 'rxjs/observable/of'; 
都不行提示找不到
*/

// 使用以下姿势,则成功
import { of, from, fromEvent, Observable, Observer, interval, Subject, pipe, ReplaySubject, asyncScheduler } from 'rxjs';
import { map, filter } from 'rxjs/operators'

// TS类型的坑, 类型的处理 这个是对 ts 类型处理 的不熟悉导致的 . 
map<number,string>(val=> ''+val) // 刚开始会不习惯, 不知道怎么处理, 在 vscode 中,多用鼠标, 移动上去看看提示.


// 拓展: 使用其他包, 在 ts 中可能也会有问题, 项目中的 rxjs 是自带 .d.ts 的 
// 有的包可能需要单独, 引入一个类似 @types/xxxx 的包, 比如: moment , 可以看看 node_modules 有没有 .d.ts 文件

```


