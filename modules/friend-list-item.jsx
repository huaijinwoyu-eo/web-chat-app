var React = require("react");
var ReactDOM = require("react-dom");

var UserListItem = React.createClass({
    render:function () {
        return(
            <li className="item">
                <img src={this.props.BaseDate.ImageLink} alt="" className="user-photo fl"/>
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
});

module.exports = UserListItem;