var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/users");
var UserSchema = new mongoose.Schema({
    username:String,
    password:String
});
var Users = mongoose.model("Users",UserSchema);
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post("/register",function(req,res,next){
    console.log(JSON.stringify(req.body));
    res.statusCode(200);
});
module.exports = router;
