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
            MessageText:"",
            UnreadMessage:this.props.UnreadMessage
        }
    },
    render:function () {
        if(this.props.Text){
            return(
                <div className="chat-form">
                    <p>{this.props.Text}</p>
                </div>
            )
        }else {
            return(
                <form onSubmit={this.HandleSendMessage} className="chat-form">
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
        }

    },
    /*关闭聊天窗口*/
    HandleClose:function (event) {
        event.preventDefault();
    },
    /*text-input数据改变，更新组件的数据。*/
    HandleChange:function (event) {
        event.preventDefault();
        this.setState({
            MessageText:event.target.value
        });
    },
    /*数据发送函数。*/
    HandleSendMessage:function (event) {
        event.preventDefault();
        socket.emit("sendMessage",{
            username:this.props.username,//想要发送给谁，那个用户的用户名。
            baseUsername:this.props.baseUsername,//当前用户的 用户名
            Message:this.state.MessageText
        });
        console.log("emit");
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
    /*组件完成加载之前，获取未读消息数据，进行渲染。*/
    componentDidMount:function () {
        var temp = this.state.MessageList;
        for(var i=0; i<this.props.UnreadMessage.length; i++){
            temp.push(<ChatItemOther key={temp.length+1} Message={this.props.UnreadMessage[i].Message} UserPhoto={this.props.UserPhoto}/>)
        }
        this.setState({
            MessageList:temp
        },function () {
            temp = null;
        });
    }
});

module.exports = ChatPanel;