const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const Copy = require('copy-webpack-plugin');

const port = 9090;

const mpadir = path.resolve(__dirname, '../src/mpa_modules');

const entries = fs.readdirSync(mpadir)
    .filter( entry => fs.statSync(path.join(mpadir, entry)).isDirectory());

const featuredir = path.resolve(__dirname,'../src/feature_modules');

const featureEntries = fs.readdirSync(featuredir)
    .filter( entry => fs.statSync(path.join(featuredir, entry)).isDirectory());

let entry = {}, plugins = [];
let copys = [];
featureEntries.forEach((item) => {
    copys.push({
        from: `${featuredir}/${item}/dist/*`,
        to: `${item}/[name].[ext]`,
        toType: 'template'
    });
});
plugins.push(new Copy(copys));

entries.forEach((item) => {
    entry[item] = `${mpadir}/${item}/index.js`;
    plugins.push(new HtmlWebpackPlugin({
        template : `${mpadir}/${item}/index.html`,
        filename: `${item}/index.html`,
        chunks: [item],
        inject: true
    }));
});

module.exports = {
    mode: "development",
    entry: entry,
    output: {
        path: path.resolve(__dirname, '../dist'), // 输出的路径
        filename: '[name]/[name]_[hash:8].js'  // 打包后文件
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
            },{
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
                        },
                    },
                ]
            }
        ]
    },
    plugins: [
        ...plugins,
        new webpack.HotModuleReplacementPlugin(),
        new OpenBrowserPlugin({ url: 'http://localhost:' + port})
    ],
    devServer: {
        // contentBase: path.resolve(__dirname, '../dist'), //默认会以根文件夹提供本地服务器，这里指定文件夹
        historyApiFallback: {
            index: '/index/index.html'
        }, //在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
        port: port, //如果省略，默认8080
        // index: 'index/index.html',
        publicPath: "/",
        inline: true,
        hot: true,
        /*proxy: [{
            context: ['/auth', '/api'],
            target: 'http://localhost:3000',
        }]*/
    }
}