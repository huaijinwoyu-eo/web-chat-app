/**
 * Created by 18730 on 2016/11/7.
 */
//create IO
var io = require('../../app/io');
//引入mongoose
var mongoose = require("mongoose");
//引入userModel
require("../models/model-user");
var Users = mongoose.model("Users");

io.on('connection', function(socket){
    console.log('a user connected');
    console.log(socket.id);
    socket.on("login",function (data) {
        Users.findOne({username:data},function (err, doc) {
            if(err){
                console.log(err);
            }else if(doc){
                doc.socket_id = socket.id;
                doc.save(function (err) {
                    if(err) return console.log(err);
                })
            }
        })
    });
    socket.on("adding you",function (obj) {
         Users.findOne({username:obj.username},function (err, doc) {
             if(err){
                 console.log(err);
             }else if(doc){
                 Users.findOne({username:obj.baseUsername},function (err, user) {
                     if(err){
                         console.log(err);
                     }else if(user){
                         doc.addFriendOfRequire({
                             username:user.username,
                             UserPhoto:user.UserPhoto,
                             id:user.id,
                             isAdd:true
                         });
                         doc.save(function (err) {
                             if(err) return console.log(err);
                             //如果用户登录，提示刷新。
                             if(doc.socket_id){
                                 io.sockets.sockets[doc.socket_id].emit("someOne is adding you",doc.requireAddFriendList.length);
                             }
                         });
                     }
                 });
             }
         });
    });
    socket.on("disconnect",function () {
        Users.findOne({socket_id:socket.id},function (err, doc) {
            if(err){
                console.log(err);
            }else if(doc){
                doc.socket_id = "";
                doc.save(function (err) {
                    if(err) return console.log(err);
                });
            }
        });
        console.log("user disconnect");
    })
});