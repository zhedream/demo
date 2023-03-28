import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default {
  // input: "./src/index.js",
  input: "./src/LidarImage/LidarImage.ts",
  output: {
    file: "./dist/LidarImage.js",
    format: "umd",
    name: "LidarImage",
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
  ]
};
