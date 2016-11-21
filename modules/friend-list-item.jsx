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
            isOpened:this.props.BaseDate.isOpened,
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
        }else if(this.props.BaseDate.isAdd){
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
        } else if(this.props.BaseDate.New){
            return(
                <li className="item new">
                    <img src={this.props.BaseDate.UserPhoto} alt="" className="user-photo fl"/>
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
        }else {
            return(
                <li className="item" onDoubleClick={this.HandleOpenChatForm}>
                    <img src={this.props.BaseDate.UserPhoto} alt="" className="user-photo fl"/>
                    <div className="unreadcount">{!this.state.isOpened ? this.state.UnreadMessage.length : ""}</div>
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
    HandleSure:function (event) {
        event.preventDefault();
        this.props.RemoveNewTag(this.props.BaseDate.username);
        socket.emit("Sure",{
            baseUsername:this.props.username,
            username:this.props.BaseDate.username
        });
    },
    HandleAccept:function (event) {
        event.preventDefault();
        socket.emit("Accept",{
            baseUsername:this.props.username,
            username:this.props.BaseDate.username
        });
    },
    HandleDeny:function (event) {
        event.preventDefault();
        socket.emit("Deny",{
            baseUsername:this.props.username,
            username:this.props.BaseDate.username
        });
    },
    HandleOpenChatForm:function (event) {
        event.preventDefault();
        /*如果有未读信息，就删除掉。*/
        if(this.state.UnreadMessage.length > 0){
            socket.emit("ClearUnreadMessage",this.props.username);
        }
        this.setState({
            isOpened:true
        },function () {
            ReactDOM.render(
                <ChatPanelOnline ChangeIsOpen={this.HandelChangeIsOpen} ClearUnreadMessage={this.HandelClearUnreadMessage} username={this.props.BaseDate.username} baseUsername={this.props.username} isOpened={this.state.isOpened} UnreadMessage={this.state.UnreadMessage} UserPhoto={this.props.BaseDate.UserPhoto}/>,
                document.getElementById("chat-form")
            );
        });
    },
    /*改变聊天窗口是否打开的标识符。*/
    HandelChangeIsOpen:function () {
        this.setState({
            isOpened:false
        });
    },
    /*去除未读信息*/
    HandelClearUnreadMessage:function () {
        this.setState({
            UnreadMessage:[]
        })
    },
    componentWillMount:function () {
        console.log(this.state.isOpened);
        if(!this.state.isOpened){
            socket.on("New Message",function (data) {
                if(data.username == this.props.BaseDate.username){
                    var temp = this.state.UnreadMessage;
                    temp.push(data);
                    this.setState({
                        UnreadMessage:temp
                    },function () {
                        temp = null;
                    });
                }
            }.bind(this));
        }
    }
});

module.exports = UserListItem;