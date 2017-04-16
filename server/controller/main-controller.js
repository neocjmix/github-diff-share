var express = require('express');
var httpService = require('../service/http-service');






module.exports = express.Router()
    .get('/load', function (req, res, next) {
        httpService.get(req.query.url)
            .then(
                data=>res.send(data),
                err=>{
                    res.locals.message = err.message;
                    res.locals.error = req.app.get('env') === 'development' ? err : {};
                    res.status(err.status || 404);
                    res.send('error');
                });
    });