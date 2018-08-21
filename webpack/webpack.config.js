const path = require('path');
const fs = require('fs');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const mpadir = path.resolve(__dirname, '../src/mpa_modules');

const entries = fs.readdirSync(mpadir)
    .filter( entry => fs.statSync(path.join(mpadir, entry)).isDirectory());

let entry = {}, plugins = [];
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
                        presets: ['es2015', 'react', 'stage-0'],
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
    plugins: plugins
}