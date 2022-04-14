const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin');

const VueLoaderPlugin = require('vue-loader/lib/plugin-webpack4');

module.exports = {
  mode: 'development',
  entry: './src/dev.js',
  output: {
    filename: 'dev.js',
    path: path.resolve(__dirname, '..', './dist'), // 解析成绝对路径
  },
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/dev.html',
    }),
    new VueLoaderPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'] // 处理css > 应用 css
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'] // 处理css > 应用 css
      },
      {
        test: /.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      // 'vue': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, '..', './src')
    }
  },
  devServer: {
    // open: true, // 自动打开浏览器
    hot: true, // 开启热更新
    compress: true, // gzip
    port: 8080, // 服务端口
    // contentBase: './example' // 服务根目录
  },
};