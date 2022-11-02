const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const VueLoaderPlugin = require("vue-loader/lib/plugin-webpack4");

module.exports = {
  mode: "production",
  // entry: "./src/components.global.js",
  entry: "./src/component.js",
  output: {
    filename: "components.global.js",
    path: path.resolve(__dirname, "..", "./dist"), // 解析成绝对路径
    library: "componentsGlobal",
    libraryTarget: "umd",
    umdNamedDefine: true,
  },
  externals: {
    vue: {
      root: "Vue",
      commonjs: "vue",
      commonjs2: "vue",
      amd: "vue",
    },
    "ant-design-vue": {
      root: "antd",
      commonjs: "ant-design-vue",
      commonjs2: "ant-design-vue",
      amd: "ant-design-vue",
    },
  },
  devtool: "inline-source-map",
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./example/index.html",
    }),
  ],
  resolve: {
    extensions: [".js", ".vue", ".less", ".sass", ".scss"],
    alias: {
      // 'vue': 'vue/dist/vue.esm.js',
      "@": path.resolve(__dirname, "..", "./src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"], // 处理css > 应用 css
      },
      {
        test: /(\.less)$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        use: ["style-loader", "css-loader", "sass-loader"], // 把 sass 转成 css , 解析 css , 应用 css
      },
      {
        test: /.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.(woff|woff2|eot|svg|ttf)$/,
        use: "file-loader", // file-loader 处理字体文件. (都是 file-loader 但一般习惯分开写)
      },
      {
        test: /\.(png|jpg|bmp|jpeg|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 5 * 1024, // 小于 5kb 转换成 base64(占空间) , 以减少 浏览器请求.
            outputPath: "images", // 放在 images 目录下
            name: "[name]-[hash:4].[ext]", // 自定义图片名
          },
        }, // 处理 图片文件 , 字体文件 , url-loader 基于 file-loader 封装, limit 是 ulr 的功能
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        // include: [''],
        // loader: "babel-loader",
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@vue/babel-preset-jsx"],
            plugins: [
              [
                "component", // import component
                {
                  libraryName: "element-ui",
                  styleLibraryName: "theme-chalk",
                },
                "element-ui",
              ],
              // [
              //   "import", // import component
              //   {
              //     libraryName: "ant-design-vue",
              //     // libraryDirectory: "lib",
              //     // styleLibraryDirectory: "packages/theme-chalk/src",
              //     style: "css",
              //   },
              //   "ant-design-vue",
              // ],
            ],
          },
        },
      },
    ],
  },
};
