var http = require("http");
var https = require("https");

module.exports = {
    get : function(url) {
        return new Promise(function(resolved, rejected){
            var protocol = url.match(/^https/g) ? https : http;
            var req = protocol.request(url, function(res){
                var output = '';
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    output += chunk;
                });
                res.on('end', function() {
                    resolved (output);
                });
            });

            req.on('error', function(err) {
                rejected(Error(err));
            });

            req.end();
        });
    }
}