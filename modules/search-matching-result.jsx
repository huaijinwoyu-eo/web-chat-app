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
            formTips:"form-tips",
            username:"",
            ID:"",
            userText:"",
            UserPhoto:"",
            sexual:"",
            age:""
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
                    <img src={this.state.UserPhoto} alt="" className="db Result-img"/>
                    <p className="Result-p">
                        <span>用户名：</span>
                        {this.state.username}
                    </p>
                    <p className="Result-p">
                        <span>ID：</span>
                        {this.state.ID}
                    </p>
                    <p className="Result-p">
                        <span>个性签名：</span>
                        {this.state.userText}
                    </p>
                    <p className="Result-p">
                        <span>性别：</span>
                        {this.state.sexual}
                    </p>
                    <p className="Result-p">
                        <span>年龄：</span>
                        {this.state.age}
                    </p>
                    <a href="#" id="add-btn" className="add-btn" onClick={this.HandleClick}>{this.state.addText}</a>
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
        if(this.props.ResultDate=="3"){
            alert("该用户已经是您的好友了。");
        }else {
            if(this.state.flage && this.state.addText == "请求添加该用户") {
                this.setState({
                    flage: false,
                    addText:"请求已发送，等待对方确认",
                    formTips:"form-tips"+" "+"success"
                });
                Jquery.ajax({
                    url:"/users/addFriend",
                    type:"POST",
                    data:{
                        baseUsername:this.props.username,
                        id:this.state.ID,
                        username:this.state.username,
                        UserPhoto:this.state.UserPhoto,
                        temp:true
                    },
                    success:function (code) {
                        if(code == "1"){
                            this.setState({
                                status:"添加好友失败，可能是数据库问题，请稍后重试。",
                                formTips:"form-tips"+" "+"error",
                                addText:"请求添加该用户",
                                flage:true
                            });
                        }else if(code == "2"){
                            this.setState({
                                status:"添加好友请求已发送，等待对方回应。",
                                formTips:"form-tips"+" "+"success"
                            });
                            this.props.addTemFriend({
                                id:this.state.ID,
                                username:this.state.username,
                                UserPhoto:this.state.UserPhoto,
                                temp:true
                            });
                        }
                    }.bind(this)
                })
            }
        }
    },
    componentDidMount:function () {
        if(this.props.ResultDate == "2"){
            this.setState({
                addText:"请求已发送",
                status:"添加请求已发送，无需再次请求。"
            })
        }else if(this.props.ResultDate == "3"){
            this.setState({
                addText:"该用户已经为您的好友",
                status:"该用户已经为您的好友。"
            })
        }else {
            this.setState({
                addText:"请求添加该用户"
            })
        }
        Jquery.ajax({
            type:"POST",
            url:"/users/getSearchDate",
            data:{
                username:this.props.searchObj.username,
                ID:this.props.searchObj.ID
            },
            success:function (data) {
                if(data == "1"){
                    this.setState({
                        status:"数据库操作失误，请稍后重试。",
                        formTips:"form-tips"+" "+"error"
                    });
                }else if(data == "err"){
                    this.setState({
                        status:"搜索用户不存在，请确认消息后重试。",
                        formTips:"form-tips"+" "+"error"
                    });
                    document.getElementById("add-btn").style.display = "none";
                }else {
                    this.setState({
                        username:data.username,
                        ID:data.ID,
                        userText:data.username,
                        UserPhoto:data.UserPhoto,
                        sexual:data.sexual,
                        age:data.age
                    })
                }
            }.bind(this)
        });

    }
});

module.exports = Result;