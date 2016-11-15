var React = require("react");
var ReactDOM = require("react-dom");
var Jquery = require("jquery");
//引入时钟模块
var Clock = require("./clock");
//引入搜索结果页面
var Result = require("./search-matching-result");

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
        if(this.state.username == this.props.username){
            this.setState({
                status:"所搜索用户名为当前用户，请重试",
                username:"",
                ID:"",
                formTips:"form-tips"+" "+"warning"
            });
        }else if(!this.state.username || !this.state.ID){
            this.setState({
                status:"用户名和用户ID均要填写。",
                formTips:"form-tips"+" "+"warning"
            });
        }else {
            this.setState({
                status:"数据加载中。。。请稍后。",
                formTips:"form-tips"+" "+""
            });
            if(this.state.flage){
                this.setState({
                    flage:false
                });
                Jquery.ajax({
                    type:"POST",
                    url:"/users/search",
                    data:{
                        baseUsername:this.props.username,
                        username:this.state.username,
                        ID:this.state.ID
                    },
                    success:function (code) {
                        if(code == "1"){
                            this.setState({
                                status:"搜索失败，请稍后重试。",
                                formTips:"form-tips"+" "+"error",
                                flage:true
                            });
                        }else if(code == "err"){
                            this.setState({
                                status:"搜索用户不存在，请确认消息后重试。",
                                formTips:"form-tips"+" "+"error",
                                flage:true
                            })
                        }else {
                            ReactDOM.render(
                                <Result addTemFriend={this.props.addTemFriend} title="搜索结果" ResultDate = {code} searchObj = {{
                                    username:this.state.username,
                                    ID:this.state.ID
                                }} username={this.props.username}/>,
                                document.getElementById("other-thing")
                            );
                        }
                    }.bind(this)
                })
            }
        }
    }
});
module.exports = SearchPage;