var path = require('path');
var fs = require('fs');
var isProd = (process.env.NODE_ENV === 'production');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpackConfig = {
    entry:[
        'babel-polyfill', 
        path.resolve(__dirname, 'src/app/index.js')
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    plugins: [new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src/resources/index.html')
    })],
    resolve: {
        alias: {
            app: path.resolve(__dirname, 'src/app'),
            resources: path.resolve(__dirname, 'src/resources'),
            libraries: path.resolve(__dirname, 'src/libraries'),
            props: isProd
                ? path.resolve(__dirname, 'src/resources/props-prod')
                : path.resolve(__dirname, 'src/resources/props-dev')
        },
        extensions: [".js", ".json"]
    },
    devtool: 'source-map',
    module: {
        loaders: [{
                test: /\.html$/,
                loader: 'raw-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            },
            {
                test: /(\.js)|(\.test\.js)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.hbs$/,
                loader: 'handlebars-loader'
            }
        ]
    }
};

module.exports = webpackConfig;