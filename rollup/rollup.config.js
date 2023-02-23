import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "./src/index.js",
  output: {
    file: "./dist/bundle.js",
    format: "umd",
    name: "bundle",
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
  ]
};


// node 12.x 开始支持 ES 模块, 可以使用 .mjs 后缀, 或者在 package.json 中添加 type: "module"

// const commonjs = require("@rollup/plugin-commonjs");
// const resolve = require("@rollup/plugin-node-resolve");
// const typescript = require("rollup-plugin-typescript2");

// module.exports = {
//   input: "./src/index.js",
//   output: {
//     file: "./dist/bundle.js",
//     format: "umd",
//     name: "bundle",
//
//   },
//   plugins: [
//     resolve(),
//     commonjs(),
//     typescript(),
//   ]
// };
