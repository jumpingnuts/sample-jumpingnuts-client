/*jslint node: true */
'use strict';
var express = require('express'),
    user = require('./routes/user'),
    server = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin ? req.headers.origin : '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    next();
  }
  
server.use(express.bodyParser());
server.use(allowCrossDomain);


server.get('/dummy/users/me', user.user_me);

server.use(function (req, res) {
    res.json({'ok': false, 'status': '404'});
});

module.exports = server;