const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Copy = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const copys = [],plugins = [];
copys.push({
    from : path.resolve(__dirname,'../src/i18n'),
    to: 'i18n'
});
/* const parentDllPath = path.resolve(__dirname,'../../../../dllchild');
const parentDllEntries = fs.existsSync(parentDllPath) && fs.readdirSync(parentDllPath);
parentDllEntries.forEach((item) => {
    let jsonReg = /.*manifest\.json$/;
    if(jsonReg.test(item)){
        console.log(item);
        plugins.push(new webpack.DllReferencePlugin({
            manifest: require(`../../../../dllchild/${item}`)
        }));
    }
}); */
/* const dllchild = path.resolve(__dirname,'../../../../dllchild/');
copys.push({
    from: path.resolve(dllchild,'*.js'),
    toType: 'template',
    to: `./dll/[1]`,
    test: /[\\/]dllchild[\\/](.*)$/,
    force: true
}); */
module.exports = {
    mode: "production",
    entry: {
        babel: 'babel-polyfill',
        common: path.resolve(__dirname,'../../../common/index.js'),
        index : path.resolve(__dirname, '../src/index.js')
    },//指定入口文件，程序从这里开始编译,__dirname当前所在目录, ../表示上一级目录, ./同级目录
    output: {
        path: path.resolve(__dirname, '../dist'), // 输出的路径
        filename: '[name].js'  // 打包后文件
    },
    resolve: {
        extensions: ['.js','.styl']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'react', 'stage-0'],
                    }
                },
                exclude: /node_modules/
            },
            {
                oneOf: [
                    {
                        test: /\.css$/,
                        use: [
                            require.resolve('style-loader'),
                            {
                                loader: require.resolve('css-loader')
                            },
                            {
                                loader: require.resolve('postcss-loader'),
                                options: {
                                    ident: 'postcss',
                                    plugins: () => [
                                        require('postcss-flexbugs-fixes'),
                                        autoprefixer({
                                            browsers: [
                                                '>1%',
                                                'last 4 versions',
                                                'Firefox ESR',
                                                'not ie < 9', // React doesn't support IE8 anyway
                                            ],
                                            flexbox: 'no-2009',
                                        }),
                                    ],
                                },
                            },
                        ]
                    },
                    {
                        test: /\.styl$/,
                        loaders: ['style-loader', 'css-loader', 'stylus-loader']
                    },
                    {
                        exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/,/\.styl$/],
                        loader: require.resolve('file-loader'),
                        options: {
                            name: 'static/media/[name].[hash:8].[ext]',
                            publicPath: ''
                        },
                    },
                ]
            },
        ]
    },
    optimization: {
        splitChunks: {
            name: true,
            cacheGroups: {
                logicComponent: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        },
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
            })
        ]
    },
    plugins: [
        ...plugins,
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname,'../src/index.html'),
            inject: true
        }),
        new Copy(copys)
    ]
}