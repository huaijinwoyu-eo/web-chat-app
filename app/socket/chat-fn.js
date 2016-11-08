/**
 * Created by 18730 on 2016/11/7.
 */
//create IO
var io = require('../../app/io');

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on("disconnect",function () {
        console.log("user disconnect");
    })
});