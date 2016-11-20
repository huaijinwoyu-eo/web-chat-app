var React = require("react");
var ReactDOM = require("react-dom");

var ChatItemMy = React.createClass({
    render:function () {
        return(
            <div className="message-item my">
                <img src={this.props.UserPhoto} alt="" className="user-photo fr"/>
                    <div className="message">
                        <div className="blue-message">
                            {this.props.Message}
                        </div>
                    </div>
            </div>
        )
    }
});

module.exports = ChatItemMy;