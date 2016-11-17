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
            isAddingYou:false,
            title:"朋友列表",
            AddingNumber:"",
            FriendsDate:[],
            TempFriendList:[],
            requireAddFriendList:[]
        }
    },
    render:function () {
        if(this.state.isYourFriend){
            return(
                <div>
                    <div className="item-title">
                        {this.state.title}
                        <div className="fr btn">匹配</div>
                    </div>
                    <hr/>
                    <ul className="list">
                        <YouFriend FriendsDate={this.state.FriendsDate}/>
                    </ul>
                </div>
            )
        }else if(this.state.isHasRequir){
            return(
                <div>
                    <div className="item-title">
                        {this.state.title}
                        <div className="fr btn">匹配</div>
                    </div>
                    <hr/>
                    <ul className="list">
                        <HasRequire TempFriendList={this.state.TempFriendList}/>
                    </ul>
                </div>
            )
        }else if(this.state.isAddingYou){
            return(
                <div>
                    <div className="item-title">
                        {this.state.title}
                        <div className="fr btn">匹配</div>
                    </div>
                    <hr/>
                    <ul className="list">
                        <AddingYou requireAddFriendList={this.state.requireAddFriendList} username={this.props.username}/>
                    </ul>
                </div>
            )
        }
    },
    HandleAddTempFriend:function (obj) {
        var tempArray = this.state.TempFriendList;
        tempArray.push(obj);
        this.setState({
            TempFriendList:tempArray,
            title:"已请求列表",
        },function () {
            Jquery("#list-select .list-btn").eq(1).trigger("click");
            this.setState({
                isYourFriend:false,
                isHasRequir:true,
                isAddingYou:false,
            });
            socket.emit("adding you",{
                username:obj.username,
                baseUsername:this.props.username
            });
        }.bind(this));
    },
    HandleShowFriendList:function (event) {
        event.preventDefault();
        this.setState({
            title:"朋友列表"
        },function () {
            this.setState({
                isYourFriend:true,
                isHasRequir:false,
                isAddingYou:false,
            });
        }.bind(this))
    },
    HandleShowHasRequirList:function (event) {
        event.preventDefault();
        this.setState({
            title:"已请求列表"
        },function () {
            this.setState({
                isYourFriend:false,
                isHasRequir:true,
                isAddingYou:false,
            });
        }.bind(this))
    },
    HandleShowAddingYou:function (event) {
        event.preventDefault();
        this.setState({
            title:"待确认列表",
            AddingNumber:""
        },function () {
            ReactDOM.render(
                <FriendListSelect AddingNumber={this.state.AddingNumber} ClearAddingNumber={this.HandleClearAddingNumber} ShowFriendList = {this.HandleShowFriendList} ShowHasRequirList={this.HandleShowHasRequirList} ShowAddingYou={this.HandleShowAddingYou}/>,
                document.getElementById("list-select")
            );
            Jquery("#list-select .list-btn").eq(2).trigger("click");
            this.setState({
                isYourFriend:false,
                isHasRequir:false,
                isAddingYou:true,
            });
        }.bind(this))
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
            <FriendListSelect ClearAddingNumber={this.HandleClearAddingNumber} ShowFriendList = {this.HandleShowFriendList} ShowHasRequirList={this.HandleShowHasRequirList} ShowAddingYou={this.HandleShowAddingYou}/>,
            document.getElementById("list-select")
        );
        ReactDOM.render(
            <SearchBtn username={this.props.username} addTemFriend = {this.HandleAddTempFriend} />,
            document.getElementById("search-btn")
        );
        socket.on("AddingNumber",function (count) {
            console.log("addingnumber");
            console.log(count);
            this.setState({
                AddingNumber:count
            },function () {
                ReactDOM.render(
                    <FriendListSelect AddingNumber={this.state.AddingNumber} ClearAddingNumber={this.HandleClearAddingNumber} ShowFriendList = {this.HandleShowFriendList} ShowHasRequirList={this.HandleShowHasRequirList} ShowAddingYou={this.HandleShowAddingYou}/>,
                    document.getElementById("list-select")
                );
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
                            requireAddFriendList:data.requireAddFriendList
                        });
                    }.bind(this)
                });

            }.bind(this))
        }.bind(this));
    }
});

module.exports = UserList;