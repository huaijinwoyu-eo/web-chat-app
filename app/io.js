//引入socket.io
var socket = require("socket.io");
var server = require("./server");

var io = socket(server);

module.exports = io;

