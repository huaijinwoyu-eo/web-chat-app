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
router.post("/register",function(req, res, next){
    User.findOne({username:req.body.username},function (err,doc) {
        if(err){
            console.log(err);
            res.send("1");//操作数据库错误。
            return;
        }
        if(doc){
            console.log(doc);
            res.send("2");//用户已被注册。
            return;
        }else {
            var user = new User({
                username:req.body.username,
                password:req.body.password,
                sexual:"",
                age:"",
                educational_background:"",
                profession:""
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
});

router.post("/login",function (req, res, next) {
    User.findOne({username:req.body.username},function (err, doc) {
        if(err){
            console.log(err);
            res.send("1");//操作数据库错误。
            return;
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
    })
});

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
            return;
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
                return;
            }
            res.send("2");
            return;
        })
    })
});




module.exports = router;
