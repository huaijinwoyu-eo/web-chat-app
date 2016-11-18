var React = require("react");
var ReactDOM = require("react-dom");
//引入socket
var socket = require("../client-io/init");
//引入Jquery
var Jquery = require("jquery");

var UserListItem = React.createClass({
    render:function () {
        if(this.props.BaseDate.temp){
            return(
                <li className="item">
                    <img src={this.props.BaseDate.UserPhoto} alt="" className="user-photo fl"/>
                    <div className="info">
                        <p className="name">{this.props.BaseDate.username}</p>
                        <div className="message">{"等待对方确认"}</div>
                    </div>
                </li>
            )
        }else if(this.props.BaseDate.isAdd){
            return(
                <li className="item">
                    <img src={this.props.BaseDate.UserPhoto} alt="" className="user-photo fl"/>
                    <div className="info">
                        <p className="name">{this.props.BaseDate.username}</p>
                    </div>
                    <div className="btns">
                        <a href="#" className="accept" onClick={this.HandleAccept}>
                            添加
                        </a>
                        <a href="#" className="deny" onClick={this.HandleDeny}>
                            拒绝
                        </a>
                    </div>
                </li>
            )
        } else if(this.props.BaseDate.New){
            return(
                <li className="item">
                    <img src={this.props.BaseDate.UserPhoto} alt="" className="user-photo fl"/>
                    <div className="info">
                        <p className="name">{this.props.BaseDate.username}</p>
                        <div className="message">{this.props.BaseDate.UserText}</div>
                    </div>
                    <div className="btns">
                        <a href="#" className="accept" onClick={this.HandleSure}>
                            确认
                        </a>
                    </div>
                </li>
            )
        }else {
            return(
                <li className="item">
                    <img src={this.props.BaseDate.UserPhoto} alt="" className="user-photo fl"/>
                    <div className="info">
                        <p className="name">{this.props.BaseDate.username}</p>
                        <div className="message">{this.props.BaseDate.UserText}</div>
                        <div className="online-tag">
                            <span className={this.props.BaseDate.OnlineTag}>

                            </span>
                        </div>
                    </div>
                </li>
            )
        }
    },
    HandleSure:function (event) {
        event.preventDefault();
    },
    HandleAccept:function (event) {
        event.preventDefault();
        socket.emit("Accept",{
            baseUsername:this.props.username,
            username:this.props.BaseDate.username
        });
        // this.props.HandleRemove(event,this.props.BaseDate.username);
        // Jquery("#list-select .list-btn").eq(0).trigger("click");
    },
    HandleDeny:function (event) {
        event.preventDefault();
        socket.emit("Deny",{
            baseUsername:this.props.username,
            username:this.props.BaseDate.username
        });
    }
});

module.exports = UserListItem;