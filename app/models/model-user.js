//引入mongoose模块
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/users");

var db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));


var UserSchema = new mongoose.Schema({
    id:Number,
    socket_id:{
        type:String,
        default:""
    },
    loginTime:Number,
    username:String,
    password:String,
    sexual:String,
    age:String,
    educational_background:String,
    profession:String,
    OnlineTag:Boolean,
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
        UserText:String,
        OnlineTag:Boolean,
        New:Boolean,
        UnreadMessage:{
            type:Array,
            default:[]
        }
    }],
    TempFriendList:[{
        id:Number,
        temp:Boolean,
        username:String,
        UserPhoto:String
    }],
    requireAddFriendList:[{
        id:Number,
        username:String,
        UserPhoto:String,
        isAdd:Boolean
    }],
    UnreadMessage:[{
        username:String,
        Message:String
    }]
});
UserSchema.methods.addFriend = function (obj) {
    this.FriendList.push(obj);
};
UserSchema.methods.addTempFriend = function (obj) {
    this.TempFriendList.push(obj);
};
UserSchema.methods.addFriendOfRequire = function (obj) {
    this.requireAddFriendList.push(obj);
};
var Users = mongoose.model("Users",UserSchema);