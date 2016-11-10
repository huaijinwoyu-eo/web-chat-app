var React = require("react");
var ReactDOM = require("react-dom");
var Jquery = require("jquery");
//登录模块
var LoginPage = require("./login-page");
//时钟模块
var Clock = require("./clock");
var RegisterPage = React.createClass({
    getInitialState:function(){
        return{
            username:"",
            password:"",
            checkPassword:"",
            status:""
        }
    },
    HandleChange:function(value,event){
        if(value==="username"){
            this.setState({
                username:event.target.value
            });
        }else if(value==="password") {
            this.setState({
                password:event.target.value
            })
        }else {
            this.setState({
                checkPassword:event.target.value
            })
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
                        <div className="">{this.state.status}</div>
                        <label htmlFor="user-name">用户名：</label>
                        <input value={this.state.username} onChange={this.HandleChange.bind(this,"username")} type="text" placeholder="请输入用户名。" />
                        <br/>
                        <label htmlFor="password">密码：</label>
                        <input value={this.state.password} onChange={this.HandleChange.bind(this,"password")} type="password" placeholder="请输入密码。" />
                        <label htmlFor="password">确认密码：</label>
                        <input type="password" value={this.state.checkPassword} onChange={this.HandleChange.bind(this,"checkPassword")} placeholder="请再次输入密码。" />
                        <br/>
                        <input type="submit" value="注册" />
                    </form>
                </div>
            </div>
        )
    },
    HandleClose:function () {
        ReactDOM.render(
            <Clock title="当前时钟"/>,
            document.getElementById("other-thing")
        );
    },
    HandleSubmit:function(event){
        event.preventDefault();
        if(!this.state.username){
            this.setState({
                status:"用户名不能为空。"
            });
            return;
        }
        if(!this.state.password){
            this.setState({
                status:"密码不能为空。"
            });
            return;
        }
        if(this.state.password !== this.state.checkPassword){
            this.setState({
                status:"确认密码与所填写密码不一致，请重新确认。"
            });
            return;
        }
        Jquery.ajax({
            type:"POST",
            url:"/users/register",
            data:{
                username:this.state.username,
                password:this.state.password
            },
            success:function (code) {
                console.log(code);
                switch (code){
                    case "1":this.setState({
                        status:"用户注册失败，请稍后重试。"
                    });
                        break;
                    case "3":
                        this.setState({
                            status:"恭喜你，注册成功！"
                        });
                        setTimeout(function () {
                            ReactDOM.render(
                                <LoginPage username = {this.state.username} status ="请登录..." title="登录"/>,
                                document.getElementById("other-thing")
                            );
                        }.bind(this),1000);
                        break;
                    case "2":this.setState({
                        status:"抱歉，该用户名已被注册。"
                    });
                        break;
                    default:break;
                }
            }.bind(this)
        })
    }
});

module.exports = RegisterPage;