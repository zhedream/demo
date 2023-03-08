// rollup.config.js
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

let plugins = [
  resolve(),
  commonjs(),
  typescript(),
];


function getFileConfig(name) {
  return {
    input: `./src/${name}.ts`,
    output: {
      file: `./dist/${name}.js`,
      format: "umd",
      name: name,
      sourcemap: true,
    },
    plugins: plugins
  };
}


let files = ["Painter", "addImageLayer", "util", "DataUtil"];

export default files.map(getFileConfig);

// export default [
//   {
//     input: "./src/Painter.ts",
//     output: {
//       file: "./dist/Painter.js",
//       format: "umd",
//       name: "Painter",
//       sourcemap: true,
//     },
//     plugins: plugins
//   },
//
// ];
