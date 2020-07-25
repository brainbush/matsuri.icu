const webpack = require('webpack');
module.exports = {
    productionSourceMap: process.env.NODE_ENV !== 'production',
    css: {
        loaderOptions: {
            sass: {
                sassOptions: {
                    includePaths: ['node_modules']
                }
            }
        }
    },
    configureWebpack: {
        plugins: [
            new webpack.ContextReplacementPlugin(
                /moment[/\\]locale$/,
                /zh-cn/,
            )
        ],
        optimization: {minimize: true}
    }
};
