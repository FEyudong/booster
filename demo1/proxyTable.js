// 这里配置代理
module.exports = {
    '/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' },
    },
};
