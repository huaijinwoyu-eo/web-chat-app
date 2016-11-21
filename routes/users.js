var express = require('express');
var router = express.Router();
//引入mongoose模块
var mongoose = require("mongoose");
//引用mongoose-schema
require("../app/models/model-user");
var User = mongoose.model("Users");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//注册
router.post("/register",function(req, res, next){
    User.count({},function (err,count) {
        if(err){
            console.log(err);
        }else {
            User.findOne({username:req.body.username},function (err,doc) {
                if(err){
                    console.log(err);
                    res.send("1");//操作数据库错误。
                }
                if(doc){
                    res.send("2");//用户已被注册。
                }else {
                    var user = new User({
                        id:count+1,
                        username:req.body.username,
                        password:req.body.password
                    });
                    user.save(function (err) {
                        if(err){
                            console.log(err);
                        }else {
                            console.log("save success");
                        }
                    });
                    res.send("3");//注册成功。
                }
            })
        }
    });
});
//登录
router.post("/login",function (req, res, next) {
    User.findOne({username:req.body.username},function (err, doc) {
        if(err){
            console.log(err);
            res.send("1");//操作数据库错误。
        }
        if(!doc){
            res.send("2");//没找到该用户，用户未被注册。
        }else if(doc.password === req.body.password){
            req.session.username = doc.username;
            if(doc.age){
                res.send("5");//用户登录成功，且填写详细信息。
            }else {
                res.send("3");//用户登录成功。但是没有填写详细信息
            }
        }else {
            res.send("4");//用户密码错误，请确认密码重试。
        }
    });
});
//退出
router.get("/signOut",function (req, res, next) {
    req.session.username = null;
    res.send(req.session.username);
});
//用户详细信息
router.post("/details",function (req, res, next) {
    User.findOne({username:req.body.username},function (err, doc) {
        if(err){
            console.log(err);
            res.send("1");
        }
        doc.set({
            sexual:req.body.sexual,
            age:req.body.age,
            educational_background:req.body.educational_background,
            profession:req.body.profession
        });
        doc.save(function (err) {
            if(err){
                console.log(err);
                res.send("1");
            }
            res.send("2");
        });
    })
});
//上传头像
router.post("/uploadImage",function (req, res, next) {
    User.findOne({username:req.body.username},function (err, doc) {
        if(err){
            console.log(err);
            res.send("1");
        }
        doc.set({
            UserPhoto:req.body.targetImage
        });
        doc.save(function (err) {
            if(err){
                console.log(err);
                res.send("1");
                return
            }
            for(var i=0; i<doc.FriendList.length; i++){
                User.findOne({username:doc.FriendList[i].username},function (err, obj) {
                    if(err){
                        console.log(err);
                    }else if(obj){
                        for(var j=0; j<obj.FriendList.length; j++){
                            if(obj.FriendList[j].username == doc.username){
                                obj.FriendList[j].UserPhoto = req.body.targetImage;
                                obj.save(function (err) {
                                    if(err){
                                        console.log(err);
                                    }
                                });
                                break;
                            }
                        }
                    }
                }.bind(doc))
            }
            res.send("2");
        })
    })
});
//获取头像，签名
router.post("/getInfo",function (req, res, next) {
    User.findOne({username:req.body.username},function (err, doc) {
        if(err){
            console.log(err);
            res.send("err");
        }
        res.send({
            UserPhoto:doc.UserPhoto,
            UserText:doc.UserText,
            age:doc.age
        })
    })
});
//修改签名
router.post("/upText",function (req, res, next) {
    User.findOne({username:req.body.username},function (err, doc) {
        if(err){
            console.log(err);
            res.send("1");
        }else {
            doc.set({
                UserText:req.body.userText
            });
            doc.save(function (err) {
                if(err){
                    console.log(err);
                    res.send("1");
                    return;
                }
                for(var i=0; i<doc.FriendList.length; i++){
                    User.findOne({username:doc.FriendList[i].username},function (err, obj) {
                        if(err){
                            console.log(err);
                        }else if(obj){
                            for(var j=0; j<obj.FriendList.length; j++){
                                if(obj.FriendList[j].username == doc.username){
                                    obj.FriendList[j].UserText = req.body.userText;
                                    obj.save(function (err) {
                                        if(err){
                                            console.log(err);
                                        }
                                    });
                                    break;
                                }
                            }
                        }
                    }.bind(doc))
                }
                res.send("2");

            })
        }
    })
});
//获取好友列表
router.post("/getFriends",function (req, res, next) {
    User.findOne({username:req.body.username},function (err, doc) {
        if(err){
            console.log(err);
            res.send("err");
        }
        res.send({
            FriendList:doc.FriendList,
            TempFriendList:doc.TempFriendList,
            requireAddFriendList:doc.requireAddFriendList,
            UnreadMessage:doc.UnreadMessage
        });
    })
});
//动态获取addyouList接口
router.post("/getAddingYou",function (req, res, next) {
    User.findOne({username:req.body.username},function (err, doc) {
        if(err){
            console.log(err);
            res.send("err");
        }
        res.send({
            requireAddFriendList:doc.requireAddFriendList
        });
    })
});
//动态获取好友列表
router.post("/getYouFriend",function (req, res, next) {
    User.findOne({username:req.body.username},function (err, doc) {
        if(err){
            console.log(err);
            res.send("err");
        }
        res.send({
            FriendsDate:doc.FriendList
        })
    })
});



//用户搜索功能
router.post("/search",function (req, res, next) {
    User.findOne({username:req.body.baseUsername},function (err, doc) {
        if(err){
            console.log(err);
            res.send("1");
        }
        for(var i = 0; i<doc.TempFriendList.length; i++){
            if(doc.TempFriendList[i].id == req.body.ID){
                if(req.body.username != doc.TempFriendList[i].username){
                    res.send("err");
                }else {
                    res.send("2");//已经请求添加过了，
                }
                return false;
                break;
            }
        }
        for(var i = 0; i<doc.FriendList.length; i++){
            if(doc.FriendList[i].id == req.body.ID){
                if(req.body.username != doc.FriendList[i].username){
                    res.send("err");
                }else {
                    res.send("3");//已经是你的好友了。
                }
                return false;
                break;
            }
        }
        res.send("4");//目前还不是你的好友。
    })
});
//获取搜索用户信息。
router.post("/getSearchDate",function (req, res, next) {
    User.findOne({id:req.body.ID},function (err, doc) {
        if(err){
            console.log(err);
            res.send("1");
        }else if (doc){
            if(req.body.username != doc.username){
                res.send("err");
            }else {
                res.send({
                    username:doc.username,
                    ID:doc.id,
                    userText:doc.UserText,
                    UserPhoto:doc.UserPhoto,
                    sexual:doc.sexual,
                    age:doc.age
                })
            }
        }else {
            res.send("err");
        }
    })
});
//请求添加好友
router.post("/addFriend",function (req, res, next){
    User.findOne({username:req.body.baseUsername},function (err,doc) {
        if(err){
            console.log(err);
            res.send("1");
        }else {
            doc.addTempFriend({
                id:req.body.id,
                temp:req.body.temp,
                username:req.body.username,
                UserPhoto:req.body.UserPhoto
            });
            doc.save(function (err, doc) {
                if(err) return console.log(err);
                console.log("save success");
            });
            res.send("2");
        }
    })
});

module.exports = router;
