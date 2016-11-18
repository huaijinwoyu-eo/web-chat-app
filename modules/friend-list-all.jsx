var React = require("react");
var ReactDOM = require("react-dom");


//朋友列表
var YouFriend = require("./friend-list-yourfriend");
//已经请求列表
var HasRequire = require("./friend-list-hasrequire");
//待确认列表
var AddingYou = require("./friend-list-addingyou");


var ListAll = React.createClass({
    render:function () {
        if(this.props.isYourFriend=="1"){
            return(
                <YouFriend FriendsDate={this.props.FriendsDate}/>
            )
        }else if(this.props.isHasRequir == "1"){
            return(
               <HasRequire TempFriendList={this.props.TempFriendList}/>
            )
        }else {
            return(
                <AddingYou requireAddFriendList={this.props.requireAddFriendList} username={this.props.username}/>
            )
        }
    }
});
module.exports = ListAll;