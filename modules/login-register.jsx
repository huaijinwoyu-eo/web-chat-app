var React = require("react");
var ReactDOM = require("react-dom");
var LoginPage = require("./login-page.jsx");
var RegisterPage = require("./register.jsx");
var Login = React.createClass({
    render:function(){
        return(
            <div className="user-login-register">
                <a href="#" className="login-btn" onClick={this.HandleClickL}>登录</a>
                <a href="#" className="login-btn" onClick={this.HandleClickR}>注册</a>
            </div>
        )
    },
    HandleClickL:function(){
        ReactDOM.render(
            <LoginPage title="登录" />,
            document.getElementById("other-thing")
        )
    },
    HandleClickR:function(){
        ReactDOM.render(
            <RegisterPage title="注册" />,
            document.getElementById("other-thing")
        )
    }
});
module.exports = Login;
