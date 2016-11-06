var React = require("react");
var ReactDOM = require("react-dom");

var UserListItem = React.createClass({
    render:function () {
        return(
            <li className="item">
                <img src={this.props.ImgLink} alt="" class="user-photo fl"/>
                <div className="info">
                    <p className="name">{this.props.username}</p>
                    <div className="message">{this.props.LastMessage}</div>
                    <span className="time">{this.props.rangTiem}</span>
                    <div className="online-tag">
                        <span className={this.props.OnlineTag}>

                        </span>
                    </div>
                </div>
            </li>
        )
    }
});

module.exports = UserListItem;