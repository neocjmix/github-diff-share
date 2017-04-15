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
        template: path.resolve(__dirname, 'resources/index.html')
    })],
    resolve: {
        alias : {
             app: path.resolve(__dirname, ' app'),
             resources: path.resolve(__dirname, 'resources'),
             libraries: path.resolve(__dirname, 'libraries')
        },
        extensions: [".js", ".json"]
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {test: /\.html$/, loader: 'raw-loader'},
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
            {test: /(\.js)|(\.test\.js)$/, exclude: /node_modules/, loader: 'babel-loader'},
            {test: /\.json$/, loader: 'json-loader'}
        ]
    }
};
