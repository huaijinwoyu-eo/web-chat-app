var React = require("react");
var ReactDOM = require("react-dom");
//朋友列表基本单元
var Item = require("./friend-list-item");

var YouFriend = React.createClass({
    render:function () {
        var ItemsNew = [];
        var ItemOnline = [];
        var ItemNotOnline = [];
        for(var i=0; i<this.props.FriendsDate.length; i++){
            if(this.props.FriendsDate[i].New){
                ItemsNew.push(<Item key = {this.props.FriendsDate[i].id} RemoveNewTag={this.props.RemoveNewTag} BaseDate={this.props.FriendsDate[i]} username={this.props.username}/>);
            }else if(this.props.FriendsDate[i].OnlineTag && !this.props.FriendsDate[i].New){
                ItemOnline.push(<Item key = {this.props.FriendsDate[i].id} BaseDate={this.props.FriendsDate[i]} username={this.props.username}/>);
            }else if(!this.props.FriendsDate[i].OnlineTag && !this.props.FriendsDate[i].New){
                ItemNotOnline.push(<Item key = {this.props.FriendsDate[i].id} BaseDate={this.props.FriendsDate[i]} username={this.props.username}/>);
            }
        }
        var Items = ItemsNew.concat(ItemOnline).concat(ItemNotOnline);
        return(
            <div className="YouFriend">
                {Items}
            </div>
        )
    }
});

module.exports = YouFriend;