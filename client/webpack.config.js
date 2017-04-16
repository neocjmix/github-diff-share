var path = require('path');
var fs = require('fs');
var configPath = (process.env.NODE_ENV === 'production') 
    ? path.resolve(__dirname,'../config')
    : path.resolve(__dirname,'../config.dev');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var config = require(configPath);
var webpackConfig = {
    entry:[
        'babel-polyfill', 
        path.resolve(__dirname, 'app/index.js')
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    plugins: [new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'resources/index.html')
    })],
    resolve: {
        alias: {
            app: path.resolve(__dirname, ' app'),
            resources: path.resolve(__dirname, 'resources'),
            libraries: path.resolve(__dirname, 'libraries'),
            config:  configPath
        },
        extensions: [".js", ".json"]
    },
    devtool: 'source-map',
    devServer: {
        proxy: [{
            context: [config.serverRoot],
            target: 'http://localhost:'+config.serverPort,
            secure: false
        }]
    },
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
            }
        ]
    }
};

if(config.devServerReload){
    var devServerReload = path.resolve('..',config.devServerReload);
    fs.closeSync(fs.openSync(devServerReload, 'a'));
    webpackConfig.entry.push(devServerReload);
}

module.exports = webpackConfig;