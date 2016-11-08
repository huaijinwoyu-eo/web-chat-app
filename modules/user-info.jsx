var React = require("react");
var ReactDOM = require("react-dom");

var UserInfo = React.createClass({
    getInitialState:function () {
        return{
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
                    <a href="#" className="abs login-btn">
                        完善信息
                    </a>
                </div>
            </div>
        )
    },
    componentDidMount:function () {

    },
    HandleLogout:function () {

    }
});
module.exports = UserInfo;