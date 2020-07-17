const path = require('path')

const VueLoaderPlugin = require('vue-loader/lib/plugin-webpack4');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'dynamic-view-form.js',
        path: path.resolve(__dirname, '..', './dist'), // 解析成绝对路径
    },
    devtool: 'inline-source-map',
    plugins: [
        new VueLoaderPlugin()
    ],
    module: {
        rules: [
            {
                test: /.vue$/,
                loader: 'vue-loader'
            },
        ],
    }
};