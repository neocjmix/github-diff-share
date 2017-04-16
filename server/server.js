#!/usr/bin/env node

var express = require('express');
var http = require('http');
var path = require('path');
var logger = require('morgan');
var debug = require('debug')('server:server');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('./config');
var index = require('./app/index');
var frank = require('./app/frank');

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

var port = normalizePort(process.env.PORT || config.serverPort);
var app = express();
app.set('port', port);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*
// uncomment if use
// var favicon = require('serve-favicon');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
*/

// routing
app.use(config.serverRoot, express.Router()
  .get('/', index)
  .get('/frank', frank));

// error handlers
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.send('error');
});

var server = http.createServer(app);

server.on('listening', function() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
});

server.on('error', function(error) {
  if (error.syscall !== 'listen') throw error;

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.listen(port);