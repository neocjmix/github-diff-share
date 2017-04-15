var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: ['babel-polyfill', path.resolve(__dirname, 'app/index.js')]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    plugins: [new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './resources/index.html')
    })],
    devtool: 'source-map',
    module: {
        loaders: [
            {test: /\.html$/, loader: 'raw-loader'},
            {test: /\.css$/, loader: 'style!css'},
            {test: /\.less$/, loader: 'style!css!less'},
            {test: /(\.js)|(\.test\.js)$/, exclude: /node_modules/, loader: 'babel-loader'},
            {test: /\.json$/, loader: 'json-loader'}
        ]
    }
};
