const webpack = require('webpack');
module.exports = {
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
