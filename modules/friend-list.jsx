var React = require("react");
var ReactDOM = require("react-dom");
//朋友列表基本单元
var Item = require("./friend-list-item");
//引入jquery
var Jquery = require("jquery");
//未登录时朋友列表处显示的信息。
var FriendListBase = require("./friend-list-base");
//引入搜索按钮
var SearchBtn = require("./search-btn");


var UserList = React.createClass({
    getInitialState:function () {
        return {
            FriendsDate: [],
            TempFriendList:[]
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
        for(var i in this.state.TempFriendList){
            Items.unshift(<Item key = {this.state.TempFriendList[i].id} BaseDate={this.state.TempFriendList[i]}/>);
        }
        return(
            <ul className="list">
                {Items}
            </ul>
        )
    },
    HandleAddTempFriend:function (obj) {
        var TempArray = this.state.TempFriendList;
        TempArray.unshift(obj);
        this.setState({
            TempFriendList:TempArray
        });
        TempArray = null;
    },
    componentDidMount:function () {
        Jquery.ajax({
            type:"POST",
            url:"/users/getFriendList",
            data:{
                username:this.props.username
            },
            success:function (data) {
                if(data=="err"){
                    ReactDOM.render(
                        <FriendListBase Text="列表读取失败，请稍后刷新页面重试。"/>,
                        document.getElementById("user-list")
                    )
                }
                this.setState({
                    FriendsDate:data.FriendList
                });
                ReactDOM.render(
                    <SearchBtn username={this.props.username} addTemFriend = {this.HandleAddTempFriend} />,
                    document.getElementById("search-btn")
                )
            }.bind(this)
        });
    }
});

module.exports = UserList;