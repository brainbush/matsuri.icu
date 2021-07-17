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
    pwa:{
        name:'ICU for Viewers',
        themeColor: "#212529",
        msTileColor: '#000000',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            swSrc: 'src/service-worker.js'
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
