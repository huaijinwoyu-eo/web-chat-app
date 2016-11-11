var React = require("react");
var ReactDOM = require("react-dom");
var Jquery = require("jquery");
//引入时钟模块
var Clock = require("./clock");


var SearchPage = React.createClass({
    getInitialState:function () {
        return{
            username:"",
            ID:"",
            status:"请填写用户名或者用户ID进行搜索。",
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
                        <label>用户名：</label>
                        <input type="text" placeholder="请输入搜索用户名。" onChange={this.HandleChang.bind(this,"username")} value={this.state.username} />
                        <br/>
                        <label>用户ID：</label>
                        <input type="text" placeholder="请输入搜索用户ID。" onChange={this.HandleChang.bind(this,"ID")} value={this.state.ID} />
                        <br/>
                        <input type="submit" value="搜索" />
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
                ID:event.target.value
            })
        }
    },
    HandleClose:function () {
        ReactDOM.render(
            <Clock title="当前时钟" tipsText="点击头像可以更换自己喜欢的头像，点击用户名可以退出当前登录。"/>,
            document.getElementById("other-thing")
        );
    },
    HandleSubmit:function (event) {
        event.preventDefault();
        if(!this.state.username && !this.state.ID){
            this.setState({
                status:"用户名或者用户ID至少填写一个。",
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

                    this.setState({
                        flage:true
                    })
                }.bind(this)
            })
        }

    }
});
module.exports = SearchPage;