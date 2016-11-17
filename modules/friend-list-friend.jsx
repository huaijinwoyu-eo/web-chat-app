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
//引入socket
var socket = require("../client-io/init");

//朋友列表
var YouFriend = require("./friend-list-yourfriend");
//已经请求列表
var HasRequire = require("./friend-list-hasrequire");
//待确认列表
var AddingYou = require("./friend-list-addingyou");

//列表切换按钮
var FriendListSelect = require("./friend-list-select-btn");


var UserList = React.createClass({
    getInitialState:function () {
        return{
            isYourFriend:true,
            isHasRequir:false,
            isAddingYou:false
        }
    },
    render:function () {
        if(this.state.isYourFriend){
            return(
                <ul className="list">
                    <YouFriend username={this.props.username}/>
                </ul>
            )
        }else if(this.state.isHasRequir){
            return(
                <ul className="list">
                    <HasRequire username={this.props.username}/>
                </ul>
            )
        }else if(this.state.isAddingYou){
            return(
                <ul className="list">
                    <AddingYou username={this.props.username}/>
                </ul>
            )
        }
    },
    HandleAddTempFriend:function (obj) {
        this.setState({
            isYourFriend:false,
            isHasRequir:true,
            isAddingYou:false
        });
        socket.emit("adding you",{
            username:obj.username,
            baseUsername:this.props.username
        });
    },
    HandleShowFriendList:function (event) {
        event.preventDefault();
        this.setState({
            isYourFriend:true,
            isHasRequir:false,
            isAddingYou:false
        })
    },
    HandleShowHasRequirList:function (event) {
        event.preventDefault();
        this.setState({
            isYourFriend:false,
            isHasRequir:true,
            isAddingYou:false
        })
    },
    HandleShowAddingYou:function (event) {
        event.preventDefault();
        this.setState({
            isYourFriend:false,
            isHasRequir:false,
            isAddingYou:true
        })
    },
    componentDidMount:function () {
        ReactDOM.render(
            <FriendListSelect ShowFriendList = {this.HandleShowFriendList} ShowHasRequirList={this.HandleShowHasRequirList} ShowAddingYou={this.HandleShowAddingYou}/>,
            document.getElementById("list-select")
        );
        ReactDOM.render(
            <SearchBtn username={this.props.username} addTemFriend = {this.HandleAddTempFriend} />,
            document.getElementById("search-btn")
        );
        socket.on("someOne is adding you",function (count) {
            ReactDOM.render(
                <FriendListSelect AddingNumber={count} ShowFriendList = {this.HandleShowFriendList} ShowHasRequirList={this.HandleShowHasRequirList} ShowAddingYou={this.HandleShowAddingYou}/>,
                document.getElementById("list-select")
            );
        }.bind(this));
    }
});

module.exports = UserList;