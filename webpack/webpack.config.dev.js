const path = require('path');
const webpack = require('webpack');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.config');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

const port = 9090;

module.exports = merge(baseWebpackConfig,{
    mode: "development",
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new OpenBrowserPlugin({ url: 'http://localhost:' + port})
    ],
    devServer: {
        contentBase: path.resolve(__dirname, '../dist'), //默认会以根文件夹提供本地服务器，这里指定文件夹
        historyApiFallback:true,
            /*{
                rewrites:[
                    {from: /^\/windos/,to: '/windos/index.html'},
                    {from: /^\/fc-os/,to: '/fc-os/index.html'}
                ],
                index: '/windos/index/index.html'
            },*/
        //在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
        port: port, //如果省略，默认8080
        // index: '/windos',
        inline: true,
        hot: true,
        proxy: [{
            context: ['/scadaweb','/fcweb'],
            target: 'http://172.16.72.26:8701',
            // target: 'http://172.20.101.140:8701',
            // target: 'http://172.16.72.100:8701',
        }]
    }
})