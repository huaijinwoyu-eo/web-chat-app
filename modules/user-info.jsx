var React = require("react");
var ReactDOM = require("react-dom");
//jquery
var Jquery = require("jquery");
//用于详细信息完善
var UserDetails = require("./user-details-page");
//引用用户图片上传
var UserImageU = require("./user-image-upload");
var UserInfo = React.createClass({
    getInitialState: function () {
        return {
            thisText: this.props.hasInput,
            userImg: "/images/user-photo-1.png",
            userText: ""
        }
    },
    render: function () {
        return (
            <div className="user-info-index">
                <img title="点击头像，更换头像。" src={this.state.userImg} alt="#" className="fl user-photo" onClick={this.HandleUpImage}/>
                <div className="info">
                    <p className="name" title="点击登出。" onClick={this.HandleLogout}>{this.props.username}</p>
                    <input type="text" className="log-text" value={this.state.userText} placeholder="请设置自己的个性签名。"/>
                    <a href="#" className="abs login-btn" onClick={this.HandleClick}>
                        {this.state.thisText}
                    </a>
                </div>
            </div>
        )
    },
    componentDidMount: function () {
        Jquery.ajax({
            type:"POST",
            url:"/users/getInfo",
            data:{
                username:this.props.username,
            },
            success:function (data) {
                this.setState({
                    userImg: data.UserPhoto,
                    userText: data.UserText
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