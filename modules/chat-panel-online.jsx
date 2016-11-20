var React = require("react");
var ReactDOM = require("react-dom");
//引入消息列表，对方的
var ChatItemOther = require("./chat-item-other");
//引入消息列表，自己的
var ChatItemMy = require("./chat-item-my");
//引入socket
var socket = require("../client-io/init");




var ChatPanel = React.createClass({
    getInitialState:function () {
        return{
            MessageList:[],
            MessageText:""
        }
    },
    render:function () {
        return(
            <form onSubmit={this.HandleSendMessage}>
                <div className="item-title">
                    <div className="name">
                        {this.props.username}
                    </div>
                </div>
                <hr/>
                <div className="message-list">
                    {this.state.MessageList}
                </div>
                <div className="message-send">
                    <input type="text" placeholder="Type you message." onChange={this.HandleChange} value={this.state.MessageText}/>
                    <input type="submit" className="fr" />
                </div>
            </form>
        )
    },
    HandleChange:function (event) {
        event.preventDefault();
        this.setState({
            MessageText:event.target.value
        });
    },
    HandleSendMessage:function (event) {
        var Temp = this.state.MessageList;
        Temp.push(<ChatItemMy key={new Date()} Message={this.state.MessageText} UserPhoto={localStorage.UserPhoto}/>);
        this.setState({
            MessageList:Temp
        });
        socket.emit("sendMessage",{
            username:this.props.username,//想要发送给谁，那个用户的用户名。
            baseUsername:this.props.baseUsername,//当前用户的 用户名
            Message:this.state.MessageText
        })
    },
    componentWillMount:function () {
        var temp = this.state.MessageList;
        if(this.props.UnreadMessage){
            for(var i=0; i<this.props.UnreadMessage.length; i++){
                temp.push(<ChatItemOther key={new Date()} Message={this.props.UnreadMessage[i].Message} UserPhoto={this.props.UserPhoto}/>);
            }
            this.setState({
                MessageList:temp
            },function () {
                temp = null;
            });
        }
    },
    componentWillReceiveProps:function () {
        var temp = this.state.MessageList;
        if(this.props.UnreadMessage){
            for(var i=0; i<this.props.UnreadMessage.length; i++){
                temp.push(<ChatItemOther key={new Date()} Message={this.props.UnreadMessage[i].Message} UserPhoto={this.props.UserPhoto}/>);
            }
            this.setState({
                MessageList:temp
            },function () {
                temp = null;
            });
        }
    }
});

module.exports = ChatPanel;