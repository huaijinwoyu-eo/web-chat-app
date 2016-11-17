var React = require("react");
var ReactDOM = require("react-dom");
//jquery
var Jquery = require("jquery");
//用于详细信息完善
var UserDetails = require("./user-details-page");
//引用用户图片上传
var UserImageU = require("./user-image-upload");
//socket
var socket = require("../client-io/init");
var UserInfo = React.createClass({
    getInitialState: function () {
        return {
            thisText: this.props.hasInput,
            userImg: "/images/user-photo-1.png",
            userText: "",
            userBeforeText:""
        }
    },
    render: function () {
        return (
            <div className="user-info-index">
                <img title="点击头像，更换头像。" src={this.state.userImg} alt="#" className="fl user-photo" onClick={this.HandleUpImage}/>
                <div className="info">
                    <p className="name" title="点击登出。" onClick={this.HandleLogout}>{this.props.username}</p>
                    <input onChange={this.HandleChange} onBlur={this.HandleTextup} type="text" className="log-text" value={this.state.userText} placeholder="请设置自己的个性签名。"/>
                    <a href="#" className="abs login-btn" onClick={this.HandleClick}>
                        {this.state.thisText}
                    </a>
                </div>
            </div>
        )
    },
    HandleChange:function (event) {
        this.setState({
            userText:event.target.value
        });
    },
    HandleTextup:function () {
        if(this.state.userBeforeText!==this.state.userText){
            Jquery.ajax({
                type:"POST",
                url:"/users/upText",
                data:{
                    username:this.props.username,
                    userText:this.state.userText
                },
                success:function (code) {
                    if(code == "1"){
                        alert("签名修改失败，请稍后重试。")
                    }else if(code=="2"){
                        alert("签名修改成功。")
                    }
                    this.setState({
                        userBeforeText:this.state.userText
                    });
                }.bind(this)
            });
        }
    },
    componentDidMount: function () {
        socket.emit("login",this.props.username);
        Jquery.ajax({
            type:"POST",
            url:"/users/getInfo",
            data:{
                username:this.props.username,
            },
            success:function (data) {
                this.setState({
                    userImg: data.UserPhoto,
                    userText: data.UserText,
                    userBeforeText:data.UserText
                });
                if(data.age){
                    this.setState({
                        thisText:"修改信息"
                    })
                }else {
                    this.setState({
                        thisText:"完善信息"
                    })
                }
            }.bind(this)
        })
    },
    HandleUpImage:function () {
        ReactDOM.render(
            <UserImageU title="修改头像" username={this.props.username} InnerUp = {this.HandleUpImageInner}/>,
            document.getElementById("other-thing")
        );
    },
    HandleUpImageInner:function (obj) {
        this.setState({
            userImg:obj
        })
    },
    HandleLogout: function () {
        socket.emit("disconnect");
        Jquery.ajax({
            type: "GET",
            url: "/users/signOut",
            success: function (code) {
                if (!code) {
                    window.location.reload();
                }
            }
        })
    },
    HandleInner: function () {
        this.setState({
            thisText: "修改信息"
        })
    },
    HandleClick: function (event) {
        event.preventDefault();
        ReactDOM.render(
            <UserDetails title="完善个人信息" username={this.props.username} Ffunction={this.HandleInner}/>,
            document.getElementById("other-thing")
        );
    }
});
module.exports = UserInfo;