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
    },
    chainWebpack: config => {
        config.plugin('html').tap(options => {
            if (process.env.NODE_ENV === 'production') {
                options[0].minify.removeComments = false;
            }
            return options
        })
    }
};
