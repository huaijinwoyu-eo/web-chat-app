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
                }else{
                    res.send("2");
                }
            })
        }
    })
});
//获取用户好友列表
router.post("/getFriendList",function (req, res, next) {
    User.findOne({username:req.body.username},function (err, doc) {
        if(err){
            console.log(err);
            res.send("err");
        }
        res.send({
            FriendList:doc.FriendList,
            TempFriendList:doc.TempFriendList
        });
    })
});
//用户搜索功能
router.post("/search",function (req, res, next) {
    User.findOne({id:req.body.ID},function (err, doc) {
        if(err){
            console.log(err);
            res.send("1");
        }
        if(doc.username !== req.body.username){
            res.send("2");
        }else {
            for(var i = 0; i<doc.FriendList.length; i++){
                if(doc.FriendList[i].id == req.body.ID){
                    res.send({
                        isYouFriend:true,
                        username:this.username,
                        ID:this.id,
                        userText:this.UserText,
                        userPhoto:this.UserPhoto,
                        sexual:this.sexual,
                        age:this.age
                    });
                    break;
                }
            }
            res.send({
                isYouFriend:false,
                username:doc.username,
                ID:doc.id,
                userText:doc.UserText,
                userPhoto:doc.UserPhoto,
                sexual:doc.sexual,
                age:doc.age
            });
        }
    });
});
//请求添加好友
router.post("/addFriend",function (req, res, next){
    User.findOne({id:req.body.ID},function (err,doc) {
        if(err){
            console.log(err);
            res.send("1");
        }else {
            doc.addTempFriend(req.body,function (err) {
                if(err){
                    console.log(err);
                    res.send("1");
                }
            });
            res.send("2");
        }
    })
});

module.exports = router;
