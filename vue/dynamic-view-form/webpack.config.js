const webpack = require('webpack')
const path = require('path')

// const HtmlWebpackPlugin = require('html-webpack-plugin');

const VueLoaderPlugin = require('vue-loader/lib/plugin-webpack4');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'dynamic-view-form.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: 'inline-source-map',
    plugins: [
        // new HtmlWebpackPlugin({
        //     filename: 'index.html',
        //     template: 'src/index.html',
        // }),
        new VueLoaderPlugin()
    ],
    module: {
        rules: [
            {
                test: /.vue$/,
                loader: 'vue-loader'
            },
        ],
    },
    // devServer: {
    //     // open: true, // 自动打开浏览器
    //     hot: true, // 开启热更新
    //     compress: true, // gzip
    //     port: 8080, // 服务端口
    //     // contentBase: './src' // 服务根目录
    // },
};