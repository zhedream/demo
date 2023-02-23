
# Rollup

```
使用 Rollup 打包 CommonJS + ES6 + TypeScript
```
安装依赖
```bash 安装依赖
yarn add rollup rollup-plugin-typescript2 @rollup/plugin-commonjs @rollup/plugin-node-resolve -D

yarn add typescript -D

```

rollup.config.js
```js rollup.config.js
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const typescript = require("rollup-plugin-typescript2");

module.exports = {
  input: "./src/index.js",
  output: {
    file: "./dist/bundle.js",
    format: "umd",
    name: "bundle", // umd 模式下必须指定 name
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
  ]
};

```

tsconfig.json
```json tsconfig.json

{
  "compilerOptions": {
    "sourceMap": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "lib": [
      "DOM",
      "ES2016"
    ],
    "skipLibCheck": true,
    "target": "ES5",
    "allowJs": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  },
  "include": [
    "./src/**/*"
  ],
  "exclude": [
    "node_modules"
  ]
}
```
