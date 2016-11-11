var React = require("react");
var ReactDOM = require("react-dom");

var FriendListBase = React.createClass({
    render:function () {
        return(
            <div className="FriendBase">
                {this.props.Text}
            </div>
        )
    }
});

module.exports = FriendListBase;