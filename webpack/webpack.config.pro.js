const path = require('path');
const Clean = require('clean-webpack-plugin');
var baseWebpackConfig = require('./webpack.config');

baseWebpackConfig.plugins.unshift(new Clean(['dist'], {
    root: path.resolve(__dirname, '../'),
    verbose:  true,
    dry:      false
}));
baseWebpackConfig.mode = 'production';
module.exports = baseWebpackConfig;