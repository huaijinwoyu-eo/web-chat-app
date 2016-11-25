var React = require("react");
var ReactDOM = require("react-dom");
//引入socket
var socket = require("../client-io/init");
//引入Jquery
var Jquery = require("jquery");
//引入chatForm-online
var ChatPanelOnline = require("./chat-panel-online");

var UserListItem = React.createClass({
    getInitialState:function () {
        return{
            isOpened:this.props.isOpened,
            UnreadMessage:this.props.BaseDate.UnreadMessage
        }
    },
    render:function () {
        if(this.props.BaseDate.temp){
            return(
                <li className="item">
                    <img src={this.props.BaseDate.UserPhoto} alt="" className="user-photo fl"/>
                    <div className="info">
                        <p className="name">{this.props.BaseDate.username}</p>
                        <div className="message">{"等待对方确认"}</div>
                    </div>
                </li>
            )
        }
        else if(this.props.BaseDate.isAdd){
            return(
                <li className="item">
                    <img src={this.props.BaseDate.UserPhoto} alt="" className="user-photo fl"/>
                    <div className="info">
                        <p className="name">{this.props.BaseDate.username}</p>
                    </div>
                    <div className="btns">
                        <a href="#" className="accept" onClick={this.HandleAccept}>
                            添加
                        </a>
                        <a href="#" className="deny" onClick={this.HandleDeny}>
                            拒绝
                        </a>
                    </div>
                </li>
            )
        }
        else if(this.props.BaseDate.New){
            return(
                <li className="item new" onDoubleClick={this.HandleOpenChatForm}>
                    <img src={this.props.BaseDate.UserPhoto} alt="" className="user-photo fl"/>
                    <div className="unreadcount">{!this.state.isOpened && this.state.UnreadMessage.length>0 ? this.state.UnreadMessage.length : ""}</div>
                    <div className="info">
                        <p className="name">{this.props.BaseDate.username}</p>
                        <div className="message">{this.props.BaseDate.UserText}</div>
                        <div className="online-tag">
                            <span className={this.props.BaseDate.OnlineTag}>

                            </span>
                        </div>
                    </div>
                    <div className="btns">
                        <a href="#" className="accept" onClick={this.HandleSure}>
                            确认
                        </a>
                    </div>
                </li>
            )
        }
        else {
            return(
                <li className="item" onDoubleClick={this.HandleOpenChatForm}>
                    <img src={this.props.BaseDate.UserPhoto} alt="" className="user-photo fl"/>
                    <div className="unreadcount">{!this.state.isOpened && this.state.UnreadMessage.length>0 ? this.state.UnreadMessage.length : ""}</div>
                    <div className="info">
                        <p className="name">{this.props.BaseDate.username}</p>
                        <div className="message">{this.props.BaseDate.UserText}</div>
                        <div className="online-tag">
                        <span className={this.props.BaseDate.OnlineTag}>

                        </span>
                        </div>
                    </div>
                </li>
            )
        }
    },
    /*对方确认添加你之后，你点击确认按钮所需操作。*/
    HandleSure:function (event) {
        event.preventDefault();
        this.props.RemoveNewTag(this.props.BaseDate.username);
        socket.emit("Sure",{
            baseUsername:this.props.username,
            username:this.props.BaseDate.username
        });
    },
    /*有人添加你，你点击添加按钮所需操作。*/
    HandleAccept:function (event) {
        event.preventDefault();
        socket.emit("Accept",{
            baseUsername:this.props.username,
            username:this.props.BaseDate.username
        });
    },
    /*有人添加你，你点击拒绝按钮所需操作。*/
    HandleDeny:function (event) {
        event.preventDefault();
        socket.emit("Deny",{
            baseUsername:this.props.username,
            username:this.props.BaseDate.username
        });
    },
    HandleOpenChatForm:function (event) {
        event.preventDefault();
        /*如果有未读信息，就删除掉，对应后的数据库操作。*/
        if(this.state.UnreadMessage.length > 0){
            socket.emit("ClearUnreadMessage",this.props.username);
        }
        /*调用父层提供的方法，以打开聊天窗口。*/
        this.props.GetMessageData({
            UnreadMessage:this.state.UnreadMessage,
            username:this.props.BaseDate.username,
            UserPhoto:this.props.BaseDate.UserPhoto
        });
        /*改变聊天窗口是否打开的标识符，并且清空未读消息列表。并且要在上层操作进行完之后进行。*/
        this.setState({
            UnreadMessage:[],
            isOpened:true
        },function () {
            console.log("this state",this.state)
        });
    },
    componentWillReceiveProps:function (nextprops) {
        console.log("new props",nextprops);
        var MessagesList = window.localStorage.getItem(this.props.username).split(",");
        MessagesList = nextprops.BaseDate.UnreadMessage;
        window.localStorage.setItem(this.props.username,JSON.stringify(MessagesList));
        if(nextprops.TheObj == this.props.BaseDate.username){
            this.setState({
                isOpened:nextprops.isOpened
            });
        }
    },
    componentDidMount:function () {
        /*这里之所以要写成这样，就是因为初次加载临时好友（addTempFriend）的时候组件已经加载过一次了，此时this.state.isOpened是undefined */
        /*this.state.UnreadMessage也是undefined。会报错。*/
        /*如果写成！this.state.isOpened 这种写法，socket监听事件会产生逻辑错误。。导致出错。*/
        if(this.state.isOpened === false){
            socket.on("New Message",function (data) {
                if(data.username == this.props.BaseDate.username){
                    if(!this.state.isOpened){
                        var temp = this.state.UnreadMessage;
                        temp.push(data);
                        this.setState({
                            UnreadMessage:temp
                        },function () {
                            temp = null;
                            var MessagesList = window.localStorage.getItem(this.props.username).split(",");
                            MessagesList = this.state.UnreadMessage;
                            window.localStorage.setItem(this.props.username,JSON.stringify(MessagesList));
                        });
                    }else {
                        var Temp = [];
                        Temp.push(data);
                        this.props.GetMessageData({
                            UnreadMessage:Temp,
                            username:data.username,
                            UserPhoto:this.props.BaseDate.UserPhoto
                        });
                        var MessagesList = window.localStorage.getItem(this.props.username).split(",");
                        MessagesList.push(data);
                        window.localStorage.setItem(this.props.username,JSON.stringify(MessagesList));
                        Temp = null;
                    }
                }
            }.bind(this));
        }
    }
});

module.exports = UserListItem;