var React = require("react");
var ReactDOM = require("react-dom");
//jquery
var Jquery = require("jquery");
//用于详细信息完善
var UserDetails = require("./user-details-page");
var UserInfo = React.createClass({
    getInitialState:function () {
        return{
            thisText: this.props.hasInput,
            userImg:"/images/user-photo-1.png",
            userText:""
        }
    },
    render:function(){
        return(
            <div className="user-info-index">
                <img src={this.state.userImg} alt="" className="user-photo fl"/>
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
    componentDidMount:function () {

    },
    HandleLogout:function () {
        Jquery.ajax({
            type:"GET",
            url:"/users/signOut",
            success:function (code) {
                if(!code){
                    window.location.reload();
                }
            }
        })
    },
    HandleInner:function () {
        this.setState({
            thisText:"修改信息"
        })
    },
    HandleClick:function (event) {
        event.preventDefault();
        ReactDOM.render(
            <UserDetails title="完善个人信息" username={this.props.username} Ffunction = {this.HandleInner}/>,
            document.getElementById("other-thing")
        )
    }
});
module.exports = UserInfo;