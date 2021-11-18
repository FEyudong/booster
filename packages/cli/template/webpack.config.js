const { merge } = require('webpack-merge');
const baseConfig = require('./build/webpack.base');
const developmentConfig = require('./build/webpack.dev');
const productionConfig = require('./build/webpack.prod');

module.exports = (env, argv) => {
    switch (argv.nodeEnv) {
        case 'development':
            return merge(baseConfig, developmentConfig);
        case 'production':
            return merge(baseConfig, productionConfig);
        default:
            throw new Error('No matching configuration was found!');
    }
};
