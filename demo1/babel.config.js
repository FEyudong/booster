// 区分开发or生产
const isDev = process.env.NODE_ENV === 'development'; // https://webpack.docschina.org/api/cli/#node-env

module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: '3.18.2',
            },
        ],
        '@babel/preset-react',
        '@babel/preset-typescript',
    ],
    plugins: [
        isDev && 'react-refresh/babel',
        [
            'babel-plugin-import',
            {
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: 'css', // `style: true` 会加载 less 文件
            },
        ],
    ].filter(Boolean),
};
