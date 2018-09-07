const path = require('path');
const fs = require('fs');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Clean = require('clean-webpack-plugin');
const Copy = require('copy-webpack-plugin');

const mpadir = path.resolve(__dirname, '../src/mpa_modules');

const entries = fs.readdirSync(mpadir)
    .filter( entry => fs.statSync(path.join(mpadir, entry)).isDirectory());

const featuredir = path.resolve(__dirname,'../src/feature_modules');

const featureEntries = fs.existsSync(featuredir) && fs.readdirSync(featuredir)
    .filter( entry => fs.statSync(path.join(featuredir, entry)).isDirectory());

let entry = {}, plugins = [];

plugins.push(new Clean(['dist'], {
    root: path.resolve(__dirname, '../'),
    verbose:  true,
    dry:      false
}));
let copys = [];
featureEntries && featureEntries.forEach((item) => {
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

let config = {
    mode: "production",
    entry: entry,
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name]/[name]_[hash:8].js'
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
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                    },
                ]
            },
        ]
    },
    /*optimization: {
        splitChunks: {
            name: true,
            cacheGroups: {
                common: {
                    name: "common",
                    chunks: "initial",
                    minChunks: 4,
                }
            }
        }
    },*/
    plugins: plugins
}

module.exports = config;