// vue.config.js
module.exports = {
    devServer:{
        port: 8080,
        proxy: {
            '/': {
                target: 'http://localhost:8090',
                changeOrigin: true,
                ws: false,
                pathRewrite: {
                    '^/': ''
                }
            }
        }
    },
    // 选项...
    outputDir:'../../static'
};