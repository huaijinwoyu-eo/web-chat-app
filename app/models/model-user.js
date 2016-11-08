/**
 * Created by 18730 on 2016/11/7.
 */
//引入mongoose模块
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/users");
var UserSchema = new mongoose.Schema({
    username:String,
    password:String
});
var Users = mongoose.model("Users",UserSchema);
