var React = require("react");
var ReactDOM = require("react-dom");
//引入用户登录-注册页面
var LoginRegister = require("./login-register");
//引入用户信息页面
var UserInfo = require("./user-info");
//引入时钟模块
var Clock = require("./clock");
//引入用户朋友列表
var FriendList = require("./friend-list");
//未登录时朋友列表处显示的信息。
var FriendListBase = require("./friend-list-base");
//登录按钮
var SearchBtn = require("./search-btn");




var content = document.getElementById("user-info").innerText;

ReactDOM.render(
    <Clock title="当前时钟" tipsText="点击“注册”按钮进行注册，如果已经注册请点击“登录”按钮进行登录。"/>,
    document.getElementById("other-thing")
);
ReactDOM.render(
    content ? <UserInfo username={content}/> : <LoginRegister/>,
    document.getElementById("user-info")
);
ReactDOM.render(
    content ? <FriendList username={content}/> : <FriendListBase Text="请登录以获取朋友列表。"/>,
    document.getElementById("user-list")
);
ReactDOM.render(
    <SearchBtn username={content}/>,
    document.getElementById("search-btn")
);