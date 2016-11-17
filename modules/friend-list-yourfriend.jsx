var React = require("react");
var ReactDOM = require("react-dom");
//朋友列表基本单元
var Item = require("./friend-list-item");
//引入Jquery
var Jquery = require("jquery");
//未登录时朋友列表处显示的信息。
var FriendListBase = require("./friend-list-base");
//引入socket
var socket = require("../client-io/init");

var YouFriend = React.createClass({
    getInitialState:function () {
        return{
            FriendsDate:this.props.FriendsDate
        }
    },
    render:function () {
        var Items = [];
        for(var i in this.state.FriendsDate){
            if(this.state.FriendsDate[i].OnlineTag){
                Items.unshift(<Item key={this.state.FriendsDate[i].id} BaseDate = {this.state.FriendsDate[i]}/>);
            }else {
                Items.push(<Item key={this.state.FriendsDate[i].id} BaseDate={this.state.FriendsDate[i]}/>);
            }
        }
        return(
            <div className="">
                {Items}
            </div>
        )
    },
    componentDidMount:function () {

    }
});

module.exports = YouFriend;