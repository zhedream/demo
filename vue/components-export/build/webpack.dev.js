const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const VueLoaderPlugin = require("vue-loader/lib/plugin-webpack4");

module.exports = {
  mode: "development",
  entry: "./src/dev.js",
  output: {
    filename: "dev.js",
    path: path.resolve(__dirname, "..", "./dist"), // 解析成绝对路径
  },
  devtool: "inline-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/dev.html",
    }),
    new VueLoaderPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"], // 处理css > 应用 css
      },
      // {
      //   test: /\.less$/,
      //   use: ["style-loader", "css-loader", "less-loader"], // 处理css > 应用 css
      // },
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
        test: /.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        // include: [path.resolve(__dirname, "src")],
        // loader: "babel-loader",
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@vue/babel-preset-jsx"],
            // plugins: [
            //   [
            //     "component",
            //     {
            //       libraryName: "element-ui",
            //       styleLibraryName: "theme-chalk",
            //     },
            //   ],
            // ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".vue", ".less", ".sass", ".scss"],
    alias: {
      // 'vue': 'vue/dist/vue.esm.js',
      "@": path.resolve(__dirname, "..", "./src"),
    },
  },
  devServer: {
    // open: true, // 自动打开浏览器
    hot: true, // 开启热更新
    compress: true, // gzip
    port: 8080, // 服务端口
    // contentBase: './example' // 服务根目录
  },
};
