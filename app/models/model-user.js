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
    FriendList:{
        type:Array,
        default:[{
            id:0,
            username:"小艾",
            ImageLink:"/images/user-photo-1.png",
            LastMessage:"",
            rangTiem:"",
            OnlineTag:true
        }]
    }
});
var Users = mongoose.model("Users",UserSchema);