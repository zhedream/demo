const path = require('path')

const VueLoaderPlugin = require('vue-loader/lib/plugin-webpack4');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'echart-component.js',
        path: path.resolve(__dirname, '..', './dist'), // 解析成绝对路径
        library: 'echart-component',
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    externals: {
        vue: {
            root: 'Vue',
            commonjs: 'vue',
            commonjs2: 'vue',
            amd: 'vue'
        },
        echarts: 'echarts'
    },
    devtool: 'inline-source-map',
    plugins: [
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
    }
};