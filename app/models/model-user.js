//引入mongoose模块
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/users");

var db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));


var UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    sexual:String,
    age:String,
    educational_background:String,
    profession:String
});
var Users = mongoose.model("Users",UserSchema);



