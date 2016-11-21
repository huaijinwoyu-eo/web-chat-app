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
    socket.on("login",function (data) {
        Users.findOne({username:data},function (err, doc) {
            if(err){
                console.log(err);
                return false;
            }else if(doc){
                doc.socket_id = socket.id;
                doc.OnlineTag = true;
                doc.loginTime = socket.handshake.issued;
                doc.save(function (err) {
                    if(err) return console.log(err);
                    for(var i = 0; i<doc.FriendList.length; i++){
                        Users.findOne({username:doc.FriendList[i].username},function (err, obj) {
                            if(err){
                                console.log(err);
                            }else if(obj){
                                for(var j=0; j<obj.FriendList.length; j++){
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
                                }.bind(obj));
                            }
                        }.bind(doc))
                    }
                }.bind(doc));
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
                            // UserText:"对方同意添加",
                            // OnlineTag:false,
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
                                io.sockets.sockets[doc.socket_id].emit("Added you","others");
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
                                                io.sockets.sockets[obj.socket_id].emit("Added you","yourself");
                                            }.bind(obj));
                                            break;
                                        }
                                    }
                                    for(var i in doc.FriendList){
                                        if(doc.FriendList[i].New && doc.FriendList[i].username == obj.username){
                                            doc.FriendList[i].UserText = obj.UserText;
                                            doc.FriendList[i].OnlineTag = obj.OnlineTag;
                                            doc.save(function (err) {
                                                if(err){
                                                    console.log(err);
                                                }
                                            });
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
        Users.findOne({username:data.username},function (err, doc) {
            if(err){
                console.log(err);
                return false;
            }else if(doc){
                for(var i = 0; i<doc.TempFriendList.length; i++){
                    if(doc.TempFriendList[i].username == data.baseUsername){
                        /*如果该项与对应对象名字相同，则删掉。*/
                        doc.TempFriendList.splice(i,1);
                        doc.save(function (err) {
                            if(err){
                                console.log(err);
                                return false;
                            }
                            //如果用户登录，提示刷新,对方拒绝了，要提示对方。
                            if(doc.socket_id){
                                io.sockets.sockets[doc.socket_id].emit("Deny you",data.baseUsername);
                            }
                            Users.findOne({username:data.baseUsername},function (err, obj) {
                                if(err){
                                    console.log(err);
                                    return false;
                                }else if (obj){
                                    for(var i=0; i<obj.requireAddFriendList.length; i++){
                                        if(obj.requireAddFriendList[i].username == data.username){
                                            obj.requireAddFriendList.splice(i,1);
                                            obj.save(function (err) {
                                                if(err){
                                                    console.log(err);
                                                }
                                                if(obj.socket_id){
                                                    io.sockets.sockets[obj.socket_id].emit("Deny you")
                                                }
                                            }.bind(obj));
                                            break;
                                        }
                                    }
                                }
                            });
                        }.bind(doc));
                        break;
                    }
                }
            }
        });
    });
    /*被添加之后，点击确认，去掉New 标识*/
    socket.on("Sure",function (data) {
        Users.findOne({username:data.baseUsername},function (err, doc) {
            for(var i in doc.FriendList){
                if(doc.FriendList[i].username == data.username){
                    doc.FriendList[i].New = false;
                    break;
                }
            }
            doc.save(function (err) {
                if(err){
                    console.log(err);
                }
            });
        })
    });
    /*发送信息*/
    socket.on("sendMessage",function (data) {
        Users.findOne({username:data.username},function (err, doc) {
            if(err){
                console.log(err);
                return false;
            }else if(doc){
                if(doc.OnlineTag){
                    if(doc.socket_id){
                        io.sockets.sockets[doc.socket_id].emit("New Message",{
                            username:data.baseUsername,
                            Message:data.Message
                        });
                    }
                }else {
                    doc.UnreadMessage.push({
                        username:data.baseUsername,
                        Message:data.Message
                    });
                    doc.save(function (err) {
                        if(err){
                            console.log(err);
                        }
                    }.bind(doc));
                }

            }
        })
    });
    /*用户已经知道有未读信息，查看后删除*/
    //用户username指的是当前用户，的用户名。
    socket.on("ClearUnreadMessage",function (username) {
        Users.findOne({})
    });
    socket.on("disconnect",function () {
        Users.findOne({socket_id:socket.id},function (err, doc) {
            if(err){
                console.log(err);
            }else if(doc){
                doc.socket_id = "";
                /*如果用户刷新页面，不广播用户下线信息。时间界限限制为20秒。*/
                var TimePath = (new Date()).getTime() - doc.loginTime;
                console.log(TimePath);
                if(TimePath>20000){
                    doc.OnlineTag = false;
                    doc.save(function (err) {
                        if(err) return console.log(err);
                        for(var i = 0; i<doc.FriendList.length; i++){
                            Users.findOne({username:doc.FriendList[i].username},function (err, obj) {
                                if(err){
                                    console.log(err);
                                }else if(obj){
                                    for(var j=0; j<obj.FriendList.length; j++){
                                        if(obj.FriendList[j].username == doc.username){
                                            obj.FriendList[j].OnlineTag = false;
                                            break;
                                        }
                                    }
                                    obj.save(function (err) {
                                        if(err){
                                            console.log(err);
                                        }
                                        //如果用户登录，提示刷新。
                                        if(obj.socket_id){
                                            io.sockets.sockets[obj.socket_id].emit("someone is leaved");
                                        }
                                    }.bind(obj));
                                }
                            }.bind(doc))
                        }
                    }.bind(doc));
                }else {
                    doc.save(function (err) {
                        if(err){
                            if(err){
                                console.log(err)
                            }
                        }
                    });
                }
            }
        });
        console.log("user disconnect");
    })
});