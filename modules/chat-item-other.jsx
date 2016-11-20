var React = require("react");
var ReactDOM = require("react-dom");

var ChatItemOther = React.createClass({
    render:function () {
        return(
            <div className="message-item">
                <img src={this.props.UserPhoto} alt="" className="user-photo fl"/>
                    <div className="message">
                        <div className="white-message">
                            {this.props.Message}
                        </div>
                    </div>
            </div>
        )
    }
});

module.exports = ChatItemOther;