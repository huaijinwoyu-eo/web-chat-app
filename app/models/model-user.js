//引入mongoose模块
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/users");

var db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));


var UserSchema = new mongoose.Schema({
    id:Number,
    username:String,
    password:String,
    sexual:String,
    age:String,
    educational_background:String,
    profession:String,
    UserPhoto:{
        type:String,
        default:"/images/user-photo-1.png"
    },
    UserText:{
        type:String,
        default:""
    },
    FriendList:[{
        id:Number,
        username:String,
        UserPhoto:String,
        LastMessage:String,
        rangTiem:String,
        OnlineTag:Boolean
    }],
    TempFriendList:[{
        id:Number,
        temp:Boolean,
        username:String,
        UserPhoto:String
    }],
    requireAddFriendList:[{
        id:Number
    }]
});
UserSchema.methods.addFriend = function (obj,fn) {
    this.FriendList.push(obj);
    this.save(function (err) {
        if(err){
            fn(err);
            console.log("save error:",err);
        }
    })
};
UserSchema.methods.addTempFriend = function (obj,fn) {
    this.TempFriendList.push(obj);
    this.save(function (err) {
        if(err){
            fn(err);
            console.log("save error:",err);
        }
    })
};
UserSchema.methods.addFriendOfRequire = function (obj,fn) {
    this.requireAddFriendList.push(obj);
    this.save(function (err) {
        if(err){
            fn(err);
            console.log("save error:",err);
        }
    })
};
var Users = mongoose.model("Users",UserSchema);