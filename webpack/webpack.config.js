const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Copy = require('copy-webpack-plugin');
const UglifyJsPlugin=require('uglifyjs-webpack-plugin');

const mpadir = path.resolve(__dirname, '../src/mpa_modules');
const entries = fs.readdirSync(mpadir)
    .filter( entry => fs.statSync(path.join(mpadir, entry)).isDirectory());
const featuredir = path.resolve(__dirname,'../src/feature_modules');
const featureEntries = fs.existsSync(featuredir) && fs.readdirSync(featuredir)
    .filter( entry => fs.statSync(path.join(featuredir, entry)).isDirectory());

let entry = {}, plugins = [], copys = [];
entry['babel'] = 'babel-polyfill';
entry['common'] = path.resolve(__dirname,'../src/common/index.js');
entries.forEach((item) => {
    let sub = `${mpadir}/${item}`;
    entry[item] = `${sub}/index.js`;
    plugins.push(new HtmlWebpackPlugin({
        template : `${sub}/index.html`,
        filename: `${item}/index.html`,
        chunks: ['vendor','babel','common',item],
        inject: true
    }));
    copys.push({
        from: `${sub}/**/*.json`,
        to: `[2]/[4]/[name].[ext]`,
        test:/mpa_modules(\/|\\)(.*)(\/|\\)(i18n)(\/|\\).*\.json$/
    });
});

/* const dllPath = path.resolve(__dirname,'../dll');
const dllEntries = fs.existsSync(dllPath) && fs.readdirSync(dllPath);
dllEntries.forEach((item) => {
    let jsonReg = /.*manifest\.json$/;
    if(jsonReg.test(item)){
        plugins.push(new webpack.DllReferencePlugin({
            manifest: require(`../dll/${item}`)
        }));
    }
}); */

featureEntries && featureEntries.forEach((item) => {
    let i18n = `${featuredir}/${item}/src/i18n`;
    if(fs.existsSync(i18n)){
        copys.push({
            from: i18n,
            to: `${item}/[1]`,
            toType: 'template',
            test: /^.+src[\\/](.*)$/
        });
    }
    entry[`${item}`] = `${featuredir}/${item}/src/index.js`;
});
/* copys.push({
    from: path.resolve(__dirname,'../dll/*.js'),
    to: ''
}); */

plugins.push(new Copy(copys));
// const vendorReg = /[\\/]node_modules[\\/](logic-component)[\\/]/;
let config = {
    mode: "production",
    entry: entry,
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name]/index.js'
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
                        presets: ['es2015', 'react', 'stage-0'],
                    }
                },
                exclude: /node_modules/
            },
            {
                oneOf: [
                    {
                        test: /\.(png|jpg|gif)$/,
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 8192,
                            name: '/fcpage/assets/[name].[hash:8].[ext]'
                        }
                    },
                    {
                        test: /\.(eot|woff|woff2|otf|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                        loader: require.resolve('file-loader'),
                        options: {
                            name: '/assets/[name].[hash:8].[ext]'
                        }
                    },
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
                            }
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
                            name: '/static/media/[name].[hash:8].[ext]',
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
    plugins: plugins
}

module.exports = config;