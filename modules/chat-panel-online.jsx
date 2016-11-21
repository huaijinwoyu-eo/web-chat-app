var React = require("react");
var ReactDOM = require("react-dom");
//引入消息列表，对方的
var ChatItemOther = require("./chat-item-other");
//引入消息列表，自己的
var ChatItemMy = require("./chat-item-my");
//引入socket
var socket = require("../client-io/init");
//聊天部分基本信息提示
var ChatBase = require("./chat-panel-base");



var ChatPanel = React.createClass({
    getInitialState:function () {
        return{
            MessageList:[],
            MessageText:"",
            isOpen:this.props.isOpened,
            UnreadMessage:this.props.UnreadMessage
        }
    },
    render:function () {
        return(
            <form onSubmit={this.HandleSendMessage}>
                <div className="item-title">
                    <div className="name">
                        {this.props.username}
                    </div>
                    <div className="form-close">
                        <span className="fa fa-times" onClick={this.HandleClose}>

                        </span>
                    </div>
                </div>
                <hr/>
                <div className="message-list">
                    {this.state.MessageList}
                </div>
                <div className="message-send">
                    <input type="text" placeholder="Type you message." onChange={this.HandleChange} value={this.state.MessageText}/>
                    <input type="submit" className="fr" value={" "}/>
                </div>
            </form>
        )
    },
    HandleClose:function (event) {
        event.preventDefault();
        this.props.ChangeIsOpen();
        ReactDOM.render(
            <ChatBase Text="双击朋友列表，可以打开聊天界面进行聊天。"/>,
            document.getElementById("chat-form")
        );
    },
    HandleChange:function (event) {
        event.preventDefault();
        this.setState({
            MessageText:event.target.value
        });
    },
    HandleSendMessage:function (event) {
        event.preventDefault();
        socket.emit("sendMessage",{
            username:this.props.username,//想要发送给谁，那个用户的用户名。
            baseUsername:this.props.baseUsername,//当前用户的 用户名
            Message:this.state.MessageText
        });
        var Temp = this.state.MessageList;
        Temp.push(<ChatItemMy key={(new Date()).getTime()} Message={this.state.MessageText} UserPhoto={localStorage.UserPhoto}/>);
        this.setState({
            MessageList:Temp
        },function () {
            this.setState({
                MessageText:""
            });
            Temp = null;
        });
    },
    componentWillMount:function () {
        var temp = this.state.MessageList;
        if(this.props.UnreadMessage){
            for(var i=0; i<this.props.UnreadMessage.length; i++){
                temp.push(<ChatItemOther key={temp.length+1} Message={this.props.UnreadMessage[i].Message} UserPhoto={this.props.UserPhoto}/>);
            }
            this.setState({
                MessageList:temp,
            },function () {
                temp = null;
            }.bind(this));
        }
    },
    componentDidMount:function () {
        this.props.ClearUnreadMessage();
        if(this.state.isOpen){
            socket.on("New Message",function (data) {
                var temp = this.state.MessageList;
                temp.push(<ChatItemOther key={temp.length+1} Message={data.Message} UserPhoto={this.props.UserPhoto}/>);
                this.setState({
                    MessageList:temp
                },function () {
                    temp = null;
                })
            }.bind(this));
        }
    }
});

module.exports = ChatPanel;