var React = require("react");
var ReactDOM = require("react-dom");

var ChatBase = React.createClass({
    render:function () {
        return(
            <div className="chat-base">
                <p>{this.props.Text}</p>
            </div>
        )
    }
});

module.exports = ChatBase;