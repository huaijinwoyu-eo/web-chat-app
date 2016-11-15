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




//引入jquery
var Jquery = require("jquery");




var content_orig = document.getElementById("user-info").innerText;
var content = Jquery.trim(content_orig);
ReactDOM.render(
    <Clock title="当前时钟" tipsText="点击“注册”按钮进行注册，如果已经注册请点击“登录”按钮进行登录。"/>,
    document.getElementById("other-thing")
);
if(content !== "") {
    ReactDOM.render(
        <UserInfo username={content}/>,
        document.getElementById("user-info")
    );
    ReactDOM.render(
        <FriendList username={content}/>,
        document.getElementById("user-list")
    );
}else {
    ReactDOM.render(
        <LoginRegister/>,
        document.getElementById("user-info")
    );
    ReactDOM.render(
        <FriendListBase Text="请登录以获取朋友列表。"/>,
        document.getElementById("user-list")
    );
    ReactDOM.render(
        <SearchBtn username={null}/>,
        document.getElementById("search-btn")
    );
}