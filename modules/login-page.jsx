var React = require("react");
var ReactDOM = require("react-dom");
var Jquery = require("jquery");
//引入时钟模块
var Clock = require("./clock");
//引入用户信息页面
var UserInfo = require("./user-info");
//引入socket.io-client模块
var socket = require("../client-io/init");
//引入用户朋友列表
var FriendList = require("./friend-list-friend");


var LoginPage = React.createClass({
    getInitialState:function () {
        return{
            username:this.props.username || "",
            password:"",
            status:this.props.status || "请填写用户名和密码进行登录。",
            flage:true,
            formTips:"form-tips"
        }
    },
    render:function(){
        return(
            <div>
                <div className="item-title">
                    {this.props.title}
                    <div className="form-close" onClick={this.HandleClose}>
                        <span className="fa fa-times"></span>
                    </div>
                </div>
                <hr/>
                <div className="content">
                    <form onSubmit={this.HandleSubmit}>
                        <div className={this.state.formTips}>{this.state.status}</div>
                        <label htmlFor="user-name">用户名：</label>
                        <input type="text" placeholder="请输入用户名。" onChange={this.HandleChang.bind(this,"username")} value={this.state.username} />
                        <br/>
                        <label htmlFor="password">密码：</label>
                        <input type="password" placeholder="请输入密码。" onChange={this.HandleChang.bind(this,"password")} value={this.state.password} />
                        <br/>
                        <input type="submit" value="登录" />
                    </form>
                </div>
            </div>
        )
    },
    HandleChang:function (value,event) {
        if(value==="username"){
            this.setState({
                username:event.target.value
            })
        }else {
            this.setState({
                password:event.target.value
            })
        }
    },
    HandleClose:function () {
        ReactDOM.render(
            <Clock title="当前时钟" tipsText="点击“注册”按钮进行注册，如果已经注册请点击“登录”按钮进行登录。"/>,
            document.getElementById("other-thing")
        );
    },
    HandleSubmit:function (event) {
        event.preventDefault();
        if(!this.state.username){
            this.setState({
                status:"用户名不能为空。",
                formTips:"form-tips"+" "+"warning"
            });
            return;
        }
        if(!this.state.password){
            this.setState({
                status:"登录密码不能为空。",
                formTips:"form-tips"+" "+"warning"
            });
            return;
        }
        if(this.state.flage){
            this.setState({
                flage:false
            });
            Jquery.ajax({
                type:"POST",
                url:"/users/login",
                data:{
                    username:this.state.username,
                    password:this.state.password
                },
                success:function (code) {
                    switch (code){
                        case "1":this.setState({
                            status:"用户登录失败，请稍后重试。",
                            formTips:"form-tips"+" "+"error"
                        });
                            break;
                        case "2":this.setState({
                            status:"该用户不存在，请注册。",
                            formTips:"form-tips"+" "+"info",
                            flage:false
                        });
                            break;
                        case "3":this.setState({
                            status:"用户登录成功。",
                            formTips:"form-tips"+" "+"success"
                        });
                            socket.emit("login",this.state.username);
                            setTimeout(function () {
                                ReactDOM.render(
                                    <Clock title="当前时钟" tipsText="点击头像可以更换自己喜欢的头像，点击用户名可以退出当前登录。"/>,
                                    document.getElementById("other-thing")
                                );
                                ReactDOM.render(
                                    <UserInfo username={this.state.username} hasInput="完善信息"/>,
                                    document.getElementById("user-info")
                                );
                                ReactDOM.render(
                                    <FriendList username={this.state.username}/>,
                                    document.getElementById("user-list")
                                );
                            }.bind(this),1000);
                            break;
                        case "4":this.setState({
                            status:"密码错误，请重新输入。",
                            password:"",
                            formTips:"form-tips"+" "+"warning"
                        });
                            break;
                        case "5":this.setState({
                            status:"用户登录成功。",
                            formTips:"form-tips"+" "+"success"
                        });
                            socket.emit("login",this.state.username);
                            setTimeout(function () {
                                ReactDOM.render(
                                    <Clock title="当前时钟" tipsText="点击头像可以更换自己喜欢的头像，点击用户名可以退出当前登录。"/>,
                                    document.getElementById("other-thing")
                                );
                                ReactDOM.render(
                                    <UserInfo username={this.state.username} hasInput="修改信息"/>,
                                    document.getElementById("user-info")
                                );
                                ReactDOM.render(
                                    <FriendList username={this.state.username}/>,
                                    document.getElementById("user-list")
                                );
                            }.bind(this),1000);
                            break;
                        default:break;
                    }
                }.bind(this)
            })
        }

    }
});
module.exports = LoginPage;