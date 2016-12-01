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
//聊天面板
var ChatPanelOnline = require("./chat-panel-online");


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
                    <ListAll isYourFriend={this.state.isYourFriend} isHasRequir={this.state.isHasRequir} isAddingYou={this.isAddingYou} FriendsDate={this.state.FriendsDate} TempFriendList={this.state.TempFriendList} requireAddFriendList={this.state.requireAddFriendList} username={this.props.username} RemoveNewTag={this.HandleRemoveNewTag}/>
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
    //去除new tag标识
    HandleRemoveNewTag:function (data) {
        var temp = this.state.FriendsDate;
        for(var i in temp){
            if(temp[i].username == data){
                temp[i].New = false;
                var tempNew = temp;
                break;
            }
        }
        var count = this.state.AddedNumber -1;
        this.setState({
            FriendsDate:tempNew,
            AddedNumber:count
        },function () {
            temp = null;
            tempNew = null;
            count = null;
        });
    },
    componentWillMount:function () {
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
                var count = 0;
                for(var i in data.FriendList){
                    if(data.FriendList[i].New){
                        count++;
                    }
                }
                var temp = data.FriendList;
                for(var i=0; i<data.UnreadMessage.length; i++){
                    for(var j=0; j<temp.length; j++){
                        if(temp[j].username == data.UnreadMessage[i].username){
                            temp[j].UnreadMessage.push(data.UnreadMessage[i]);
                            break;
                        }
                    }
                }
                this.setState({
                    AddingNumber:data.requireAddFriendList.length,
                    AddedNumber:count,
                    FriendsDate:temp,
                    TempFriendList:data.TempFriendList,
                    requireAddFriendList:data.requireAddFriendList,
                },function () {
                    temp = null;
                    count = null;
                }.bind(this));
            }.bind(this)
        });
    },
    componentDidMount:function () {
        ReactDOM.render(
            <SearchBtn username={this.props.username} addTemFriend = {this.HandleAddTempFriend} />,
            document.getElementById("search-btn")
        );
        //有人已经确认添加你了
        socket.on("Added you",function (text) {
            console.log("add you",text);
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
                    var temp ;
                    temp = this.state.AddedNumber;
                    if(text == "others"){
                        temp += 1;
                    }else {

                    }

                    var Temp = data.FriendList;
                    for(var i=0; i<data.UnreadMessage.length; i++){
                        for(var j=0; j<Temp.length; j++){
                            if(Temp[j].username == data.UnreadMessage[i].username){
                                Temp[j].UnreadMessage.push(data.UnreadMessage[i]);
                                break;
                            }
                        }
                    }

                    this.setState({
                        FriendsDate:Temp,
                        TempFriendList:data.TempFriendList,
                        requireAddFriendList:data.requireAddFriendList,
                        AddingNumber:data.requireAddFriendList.length,
                        AddedNumber:temp,
                        isYourFriend:"1",
                        isHasRequir:"0",
                        isAddingYou:"0",
                        title:"朋友列表"
                    },function () {
                        temp = null;
                        Temp = null;
                        Jquery("#list-select .list-btn").eq(0).trigger("click");
                    });
                }.bind(this)
            });
        }.bind(this));
        //有人已经拒绝添加你了
        socket.on("Deny you",function (text) {
            console.log("deny you");
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
                    var temp ;
                    temp = this.state.AddedNumber;
                    if(text == "others"){
                        temp += 1;
                    }else {

                    }
                    this.setState({
                        FriendsDate:data.FriendList,
                        TempFriendList:data.TempFriendList,
                        requireAddFriendList:data.requireAddFriendList,
                        AddedNumber:temp,
                        isYourFriend:"1",
                        isHasRequir:"0",
                        isAddingYou:"0",
                        title:"朋友列表",
                    },function () {
                        temp = null;
                        Jquery("#list-select .list-btn").eq(0).trigger("click");
                    });
                }.bind(this)
            });
            if(text){
                alert('抱歉，'+'”'+text+'“'+'，已经拒绝你的添加请求。');
            }else {

            }
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
        //对方更改头像或者更改签名之后通知更新朋友列表，自己的好友列表接受该事件。
        socket.on("updata you friendList",function () {
            console.log("someone has change his info");
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
        }.bind(this));
        //有人上线，相关操作
        socket.on("someone is online",function () {
            console.log("some is online");
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
        }.bind(this));
        //有人下线，相关操作。
        socket.on("someone is leaved",function () {
            console.log("some is leaved");
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
        }.bind(this));

    }
});

module.exports = UserList;