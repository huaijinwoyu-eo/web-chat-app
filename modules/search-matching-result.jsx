var React = require("react");
var ReactDOM = require("react-dom");
//引入时钟模块
var Clock = require("./clock");
//jquery模块引入
var Jquery = require("jquery");



var Result = React.createClass({
    getInitialState:function () {
        return{
            flage:true,
            addText:"",
            status:"点击“请求添加该用户”按钮，添加好友。",
            formTips:"form-tips"
        }
    },
    render:function () {
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
                    <div className={this.state.formTips}>{this.state.status}</div>
                    <img src={this.props.ResultDate.userPhoto} alt="" className="db Result-img"/>
                    <p className="Result-p">
                        <span>用户名：</span>
                        {this.props.ResultDate.username}
                    </p>
                    <p className="Result-p">
                        <span>ID：</span>
                        {this.props.ResultDate.ID}
                    </p>
                    <p className="Result-p">
                        <span>个性签名：</span>
                        {this.props.ResultDate.userText}
                    </p>
                    <p className="Result-p">
                        <span>性别：</span>
                        {this.props.ResultDate.sexual}
                    </p>
                    <p className="Result-p">
                        <span>年龄：</span>
                        {this.props.ResultDate.age}
                    </p>
                    <a href="#" className="add-btn" onClick={this.HandleClick}>{this.state.addText}</a>
                </div>
            </div>
        )
    },
    HandleClose:function () {
        ReactDOM.render(
            <Clock title="当前时钟" tipsText="点击头像可以更换自己喜欢的头像，点击用户名可以退出当前登录。"/>,
            document.getElementById("other-thing")
        );
    },
    HandleClick:function (event) {
        event.preventDefault();
        if(this.props.ResultDate.isYouFriend){
            alert("该用户已经是您的好友了。");
        }else {
            if(this.state.flage) {
                this.setState({
                    flage: false,
                    addText:"请求已发送，等待对方确认"
                });
                Jquery.ajax({
                    url:"/users/addFriend",
                    type:"POST",
                    data:{
                        id:this.props.ResultDate.ID,
                        username:this.props.ResultDate.username,
                        UserPhoto:this.props.ResultDate.userPhoto,
                        temp:true
                    },
                    success:function (code) {
                        if(code == "1"){
                            this.setState({
                                status:"添加好友失败，可能是数据库问题，请稍后重试。",
                                formTips:"form-tips"+" "+"error",
                                addText:"请求添加该用户"
                            });
                        }else if(code == "2"){
                            this.setState({
                                status:"添加好友请求已发送，等待对方回应。",
                                formTips:"form-tips"+" "+""
                            });
                        }
                        this.props.addTemFriend({
                            id:this.props.ResultDate.ID,
                            username:this.props.ResultDate.username,
                            UserPhoto:this.props.ResultDate.userPhoto,
                            temp:true
                        });
                    }.bind(this)
                })
            }
        }
    },
    componentDidMount:function () {
        if(this.props.ResultDate.isYouFriend){
            this.setState({
                addText:"该用户为您的好友"
            })
        }else {
            this.setState({
                addText:"请求添加该用户"
            })
        }
    }
});

module.exports = Result;