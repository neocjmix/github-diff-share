var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: ['babel-polyfill', './app/index.js']
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    plugins: [new HtmlWebpackPlugin({
        template: './app/index.html'
    })],
    devtool: 'source-map',
    module: {
        loaders: [
            {test: /\.html$/, loader: 'raw-loader'},
            {test: /\.css$/, loader: 'style!css'},
            {test: /\.less$/, loader: 'style!css!less'},
            {test: /(\.js)|(\.test\.js)$/, exclude: /node_modules/, loader: 'babel-loader'}
        ]
    }
};
