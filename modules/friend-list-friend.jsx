var React = require("react");
var ReactDOM = require("react-dom");
//引入jquery
var Jquery = require("jquery");
//未登录时朋友列表处显示的信息。
var FriendListBase = require("./friend-list-base");
//引入搜索按钮
var SearchBtn = require("./search-btn");
//引入socket
var socket = require("../client-io/init");

//总列表
var ListAll = require('./friend-list-all');

//列表切换按钮
var FriendListSelect = require("./friend-list-select-btn");


var UserList = React.createClass({
    getInitialState:function () {
        return{
            isYourFriend:"1",
            isHasRequir:"0",
            isAddingYou:"0",
            title:"朋友列表",
            AddingNumber:"",
            AddedNumber:"",
            FriendsDate:[],
            TempFriendList:[],
            requireAddFriendList:[]
        }
    },
    render:function () {
        return(
            <div>
                <FriendListSelect AddedNumber = {this.state.AddedNumber} AddingNumber={this.state.AddingNumber} ShowFriendList = {this.HandleShowFriendList} ShowHasRequirList={this.HandleShowHasRequirList} ShowAddingYou={this.HandleShowAddingYou}/>
                <div className="item-title">
                    {this.state.title}
                    {/*<div className="fr btn">匹配</div>*/}
                </div>
                <hr/>
                <ul className="list">
                    <ListAll isYourFriend={this.state.isYourFriend} isHasRequir={this.state.isHasRequir} isAddingYou={this.isAddingYou} FriendsDate={this.state.FriendsDate} TempFriendList={this.state.TempFriendList} requireAddFriendList={this.state.requireAddFriendList} username={this.props.username}/>
                </ul>
            </div>
        )
    },
    HandleAddTempFriend:function (obj) {
        var tempArray = this.state.TempFriendList;
        tempArray.push(obj);
        this.setState({
            TempFriendList:tempArray,
            title:"已请求列表",
            isYourFriend:"0",
            isHasRequir:"1",
            isAddingYou:"0",
        },function () {
            Jquery("#list-select .list-btn").eq(1).trigger("click");
            socket.emit("adding you",{
                username:obj.username,
                baseUsername:this.props.username
            });
        }.bind(this));
    },
    HandleShowFriendList:function (event) {
        event.preventDefault();
        this.setState({
            title:"朋友列表",
            isYourFriend:"1",
            isHasRequir:"0",
            isAddingYou:"0",
        });
    },
    HandleShowHasRequirList:function (event) {
        event.preventDefault();
        this.setState({
            title:"已请求列表",
            isYourFriend:"0",
            isHasRequir:"1",
            isAddingYou:"0",
        });
    },
    HandleShowAddingYou:function (event) {
        event.preventDefault();
        this.setState({
            title:"待确认列表",
            AddingNumber:"",
            isYourFriend:"0",
            isHasRequir:"0",
            isAddingYou:"1",
        });
    },
    componentDidMount:function () {
        Jquery.ajax({
            type:"POST",
            url:"/users/getFriends",
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
                    FriendsDate:data.FriendList,
                    TempFriendList:data.TempFriendList,
                    requireAddFriendList:data.requireAddFriendList
                });
            }.bind(this)
        });
        ReactDOM.render(
            <SearchBtn username={this.props.username} addTemFriend = {this.HandleAddTempFriend} />,
            document.getElementById("search-btn")
        );
        //有人已经确认添加你了
        socket.on("Added you",function (text) {
            console.log("add you");
            Jquery.ajax({
                type:"POST",
                url:"/users/getFriends",
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
                        FriendsDate:data.FriendList,
                        TempFriendList:data.TempFriendList,
                        requireAddFriendList:data.requireAddFriendList,
                        AddedNumber:text,
                        isYourFriend:"1",
                        isHasRequir:"0",
                        isAddingYou:"0",
                        title:"朋友列表"
                    },function () {
                        Jquery("#list-select .list-btn").eq(0).trigger("click");
                    });
                }.bind(this)
            });
        }.bind(this));
        //有人添加你，相关操作。
        socket.on("AddingNumber",function (count) {
            console.log("addingnumber");
            console.log(count);
            Jquery.ajax({
                type:"POST",
                url:"/users/getAddingYou",
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
                        requireAddFriendList:data.requireAddFriendList,
                        AddingNumber:count,
                    });
                }.bind(this)
            });
        }.bind(this));
    //    有人上线，相关操作
        socket.on("someone is online",function () {
            Jquery.ajax({
                type:"POST",
                url:"/users/getYouFriend",
                data:{
                    username:this.props.username
                },
                success:function (data) {
                    if(data == "err"){
                        ReactDOM.render(
                            <FriendListBase Text="列表读取失败，请稍后刷新页面重试。"/>,
                            document.getElementById("user-list")
                        )
                    }
                    this.setState({
                        FriendsDate:data.FriendsDate,
                        isYourFriend:"1",
                        isHasRequir:"0",
                        isAddingYou:"0",
                        title:"朋友列表"
                    },function () {
                        Jquery("#list-select .list-btn").eq(0).trigger("click");
                    });
                }.bind(this)
            })
        }.bind(this))
    }
});

module.exports = UserList;