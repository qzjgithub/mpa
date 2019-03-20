const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
var vendors = [
    'react',
    'react-dom',
    'react-redux',
    'react-router',
    'react-router-dom',
    'react-router-redux',
    'react-websocket',
    'redux',
    'redux-logger',
    'redux-thunk',
    'prop-types',
    'mpa-bridge',
    'mpa-bridge-dom',
    'history',
    'axios',
    'moment'
];
const webpack = require('webpack')
module.exports = {
    entry: {
        vendor: vendors,
        echarts: ['echarts']
    },
    output: {
        path: path.join(__dirname, '../../../../dllchild'),
        filename: 'dll.[name].js',
        library: '[name]'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react', 'stage-0'],
                    }
                },
                exclude: /node_modules/
            },
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    warnings: false,
                    parse: {},
                    compress: {},
                    mangle: true,
                    output: null,
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_fnames: false,
                }
            }),
        ]
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, '../', '../../../dllchild/[name]-manifest.json'),
            name: '[name]'
        })
    ]
}