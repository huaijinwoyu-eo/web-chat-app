var React = require("react");
var ReactDOM = require("react-dom");
var Jquery = require("jquery");
//引入时钟模块
var Clock = require("./clock");
//引入用户信息页面
var UserInfo = require("./user-info");
var LoginPage = React.createClass({
    getInitialState:function () {
        return{
            username:this.props.username || "",
            password:"",
            status:this.props.status || ""
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
                    <form className="content" onSubmit={this.HandleSubmit}>
                        <div className="">{this.state.status}</div>
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
            <Clock title="当前时钟"/>,
            document.getElementById("other-thing")
        );
    },
    HandleSubmit:function (event) {
        event.preventDefault();
        if(!this.state.username){
            this.setState({
                status:"用户名不能为空。"
            });
            return;
        }
        if(!this.state.password){
            this.setState({
                status:"登录密码不能为空。"
            });
            return;
        }
        Jquery.ajax({
            type:"POST",
            url:"/users/login",
            data:{
                username:this.state.username,
                password:this.state.password
            },
            success:function (code) {
                console.log(code);
                switch (code){
                    case "1":this.setState({
                        status:"用户登录失败，请稍后重试。"
                    });
                        break;
                    case "2":this.setState({
                        status:"该用户不存在，请注册。"
                    });
                        break;
                    case "3":this.setState({
                        status:"用户登录成功。"
                    });
                        setTimeout(function () {
                            ReactDOM.render(
                                <Clock title="当前时钟"/>,
                                document.getElementById("other-thing")
                            );
                            ReactDOM.render(
                                <UserInfo username={this.state.username}/>,
                                document.getElementById("user-info")
                            )
                        }.bind(this),1000);
                        break;
                    case "4":this.setState({
                        status:"密码错误，请重新输入。",
                        password:""
                    });
                        break;
                    default:break;
                }
            }.bind(this)
        })
    }
});
module.exports = LoginPage;