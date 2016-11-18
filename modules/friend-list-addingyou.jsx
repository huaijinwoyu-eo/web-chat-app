var React = require("react");
var ReactDOM = require("react-dom");
//朋友列表基本单元
var Item = require("./friend-list-item");



var AddingYou = React.createClass({
    render:function () {
        var Items = [];
        for(var i in this.props.requireAddFriendList){
            Items.unshift(<Item key={this.props.requireAddFriendList[i].id} BaseDate={this.props.requireAddFriendList[i]} username={this.props.username}/>);
        }
        return(
            <div className="AddingYou">
                {Items}
            </div>
        )
    }
});

module.exports = AddingYou;