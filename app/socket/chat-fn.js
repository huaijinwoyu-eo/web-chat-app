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
                doc.OnlineTag = true;
                for(var i in doc.FriendList){
                    Users.findOne({username:doc.FriendList[i].username},function (err,obj) {
                        if(err){
                            console.log(err);
                        }else if(obj){
                            for(var j in obj.FriendList){
                                if(obj.FriendList[j].username == doc.username){
                                    obj.FriendList[j].OnlineTag = true;
                                    break;
                                }
                            }
                            obj.save(function (err) {
                                if(err){
                                    console.log(err);
                                }
                                //如果用户登录，提示刷新。
                                if(obj.socket_id){
                                    io.sockets.sockets[obj.socket_id].emit("someone is online");
                                }
                            });
                        }
                    }.bind(doc));
                }

                doc.save(function (err) {
                    if(err) return console.log(err);
                })
            }
        })
    });
    //当前用户要添加谁谁谁，obj.username为对方名字。
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
                                 io.sockets.sockets[doc.socket_id].emit("AddingNumber",doc.requireAddFriendList.length);
                             }
                         }.bind(doc));
                     }
                 });
             }
         });
    });
    //有人加我，我的确认或者触发拒绝事件。
    socket.on("Accept",function (data) {
        Users.findOne({username:data.username},function (err, doc) {
            if(err){
                console.log(err);
                return false;
            }else if(doc){
                for(var i = 0; i<doc.TempFriendList.length; i++){
                    if(doc.TempFriendList[i].username == data.baseUsername){
                        doc.FriendList.push({
                            id:doc.TempFriendList[i].id,
                            username:doc.TempFriendList[i].username,
                            UserPhoto:doc.TempFriendList[i].UserPhoto,
                            UserText:"对方同意添加",
                            OnlineTag:false,
                            New:true
                        });
                        /*如果该项与对应对象名字相同，则删掉。*/
                        doc.TempFriendList.splice(i,1);
                        doc.save(function (err) {
                            if(err){
                                console.log(err);
                                return false;
                            }
                            //如果用户登录，提示刷新。
                            if(doc.socket_id){
                                io.sockets.sockets[doc.socket_id].emit("Added you","...");
                            }
                            Users.findOne({username:data.baseUsername},function (err, obj) {
                                if(err){
                                    console.log(err);
                                    return false;
                                }else if (obj){
                                    for(var i=0; i<obj.requireAddFriendList.length; i++){
                                        if(obj.requireAddFriendList[i].username == data.username){
                                            obj.requireAddFriendList.splice(i,1);
                                            obj.FriendList.push({
                                                id:doc.id,
                                                username:doc.username,
                                                UserPhoto:doc.UserPhoto,
                                                UserText:doc.UserText,
                                                OnlineTag:doc.OnlineTag,
                                                New:false
                                            });
                                            obj.save(function (err) {
                                                if(err){
                                                    console.log(err);
                                                }
                                                io.sockets.sockets[obj.socket_id].emit("Added you");
                                            }.bind(obj));
                                            break;
                                        }
                                    }
                                }
                            }.bind(doc))
                        }.bind(doc));
                        break;
                    }
                }
            }
        });

    });
    socket.on("Deny",function (data) {

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