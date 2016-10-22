var React = require("react");
var ReactDOM = require("react-dom");
var Jquery = require("jquery");
var RegisterPage = React.createClass({
    getInitialState:function(){
        return{
            username:"",
            password:""
        }
    },
    HandleChange:function(value,event){
        if(value==="username"){
            this.setState({
                username:event.target.value
            });
        }else {
            this.setState({
                password:event.target.value
            })
        }
    },
    render:function(){
        return(
            <div>
                <div className="item-title">{this.props.title}</div>
                <hr/>
                <div className="content">
                    <form className="content" method="post" action="/users/register">
                        <label htmlFor="user-name">用户名：</label>
                        <input value={this.state.username} onChange={this.HandleChange.bind(this,"username")} type="text" name="user-name" placeholder="请输入用户名。" />
                        <br/>
                        <label htmlFor="password">密码：</label>
                        <input value={this.state.password} onChange={this.HandleChange.bind(this,"password")} type="password" name="password" placeholder="请输入密码。" />
                        <label htmlFor="password">确认密码：</label>
                        <input type="password" name="password" placeholder="请再次输入密码。" />
                        <br/>
                        <input type="submit" value="注册" />
                    </form>
                </div>
            </div>
        )
    },
    HandleSubmit:function(event){
        event.preventDefault();
        Jquery.ajax({
            type:"POST",
            url:"/users/register",
            data:JSON.stringify(this.state)
        })
    }
});

module.exports = RegisterPage;