var React = require("react");
var ReactDOM = require("react-dom");
//引入用户登录-注册页面
var LoginRegister = require("./login-register");
//引入用户信息页面
var UserInfo = require("./user-info");
//引入时钟模块
var Clock = require("./clock");
var content = document.getElementById("user-info").innerText;
console.log(content);

ReactDOM.render(
    <Clock title="当前时钟"/>,
    document.getElementById("other-thing")
);
ReactDOM.render(
    content ? <UserInfo username={content}/> : <LoginRegister/>,
    document.getElementById("user-info")
);