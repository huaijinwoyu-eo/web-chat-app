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
            res.send("3");//用户登录成功。
        }else {
            res.send("4");//用户密码错误，请确认密码重试。
        }
    })
});

router.get("/signOut",function (req, res, next) {
    req.session.username = null;
    res.send(req.session.username);
});




module.exports = router;
