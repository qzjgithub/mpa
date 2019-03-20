const webpack = require('webpack');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.config');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

const port = 9099;
module.exports = merge(baseWebpackConfig,{
    mode: "development",
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new OpenBrowserPlugin({ url: 'http://localhost:' + port})
    ],
    devServer: {
        // contentBase: path.resolve(__dirname, '../dist'), //默认会以根文件夹提供本地服务器，这里指定文件夹
        historyApiFallback: true,
        port: port, //如果省略，默认8080
        publicPath: "/",
        inline: true,
        hot: true,
        /*proxy: [{
            context: ['/scadaweb','/fcweb'],
            target: 'http://172.16.72.26:8701',
        }]*/
    }
})