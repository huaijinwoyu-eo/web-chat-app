var React = require("react");
var ReactDOM = require("react-dom");

var LoginPage = React.createClass({
    render:function(){
        return(
            <div>
                <div className="item-title">{this.props.title}</div>
                <hr/>
                <div className="content">
                    <form class="content" method="post">
                        <label htmlFor="user-name">用户名：</label>
                        <input type="text" name="user-name" placeholder="请输入用户名。" />
                        <br/>
                        <label htmlFor="password">密码：</label>
                        <input type="password" name="password" placeholder="请输入密码。" />
                        <br/>
                        <input type="submit" value="登录" />
                    </form>
                </div>
            </div>
        )
    }
});
module.exports = LoginPage;