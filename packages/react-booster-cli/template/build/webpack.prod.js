const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
const path = require('path');
const glob = require('glob');

module.exports = {
    mode: 'production',
    plugins: [
    // css文件单独抽离
        new MiniCssExtractPlugin({
            filename: 'css/[name]_[contenthash:8].css',
        }),
        // 擦除无用的css代码
        new PurgeCSSPlugin({
            paths: glob.sync(`${path.join(__dirname, '../src')}/**/*`, { nodir: true }),
        }),
    ],
    optimization: {
        minimizer: [
            // '...', // 继承默认的压缩器，比如压缩js的terser-webpack-plugin
            new TerserWebpackPlugin({
                parallel: true, // 多进程并行压缩
                extractComments: false, // 不将注释提取到单独的文件,类似于 xxx.js.LICENSE.txt
                terserOptions: { // 在生产环境不打印console
                  compress: { drop_console: true,drop_debugger: true },
                },
            }),
            // 压缩css
            new CssMinimizerPlugin(),
        ],
    },
};
