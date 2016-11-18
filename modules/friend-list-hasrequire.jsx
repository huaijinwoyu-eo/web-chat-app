var React = require("react");
var ReactDOM = require("react-dom");
//朋友列表基本单元
var Item = require("./friend-list-item");

var HasRequire = React.createClass({
    render:function () {
        var Items = [];
        for(var i in this.props.TempFriendList){
            Items.unshift(<Item key = {this.props.TempFriendList[i].id} BaseDate={this.props.TempFriendList[i]}/>);
        }
        return(
            <div className="HasRequire">
                {Items}
            </div>
        )
    }
});

module.exports = HasRequire;