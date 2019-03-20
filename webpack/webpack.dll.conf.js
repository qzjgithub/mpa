const AssetsPlugin = require('assets-webpack-plugin');
const UglifyJsPlugin=require('uglifyjs-webpack-plugin');
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

const path = require('path')
const webpack = require('webpack')
module.exports = {
  entry: {
    vendor: vendors,
    echarts: ['echarts'],
  },
  output: {
    path: path.join(__dirname, '../dll'),
    filename: 'dll.[name].js',
    library: '[name]'
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
      path: path.join(__dirname, '../', 'dll/[name]-manifest.json'),
      name: '[name]'
    }),
      new AssetsPlugin({
          filename: 'dll/bundle-config.json',
          path: './'
      })
  ]
}