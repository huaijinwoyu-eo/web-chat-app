var React = require("react");
var ReactDOM = require("react-dom");

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
                        <a href="#" className="accept">
                            添加
                        </a>
                        <a href="#" className="deny">
                            拒绝
                        </a>
                    </div>
                </li>
            )
        } else {
            return(
                <li className="item">
                    <img src={this.props.BaseDate.UserPhoto} alt="" className="user-photo fl"/>
                    <div className="info">
                        <p className="name">{this.props.BaseDate.username}</p>
                        <div className="message">{this.props.BaseDate.LastMessage}</div>
                        <span className="time">{this.props.BaseDate.rangTiem}</span>
                        <div className="online-tag">
                        <span className={this.props.BaseDate.OnlineTag}>

                        </span>
                        </div>
                    </div>
                </li>
            )
        }

    }
});

module.exports = UserListItem;