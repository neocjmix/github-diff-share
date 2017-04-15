var config = require((process.env.NODE_ENV === 'production') ? './config' : './config.dev');
var http = require('http');
var httpProxy = require('http-proxy');
var routes = {};
routes[config.hostName+config.serverRoot] = '127.0.0.1:'+config.serverPort;
routes[config.hostName+config.clientRoot] = '127.0.0.1:'+config.clientPort;

httpProxy.createServer({
    hostnameOnly: true,
    router: routes
}).listen(config.proxyPort);
