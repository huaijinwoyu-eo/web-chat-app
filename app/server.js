/*引入app，创造http server对象*/

var http = require("http");
var app = require("../app");

var server_io = http.Server(app);

module.exports = server_io;