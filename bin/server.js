/*引入app，创造http server对象*/

var http = require("http");
var app = require("../app");

var server = http.createServer(app);

module.exports = server;