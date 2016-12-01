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
                    <div className="message-list" id="message-list">
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
        this.props.ClosePanel(this.props.username);
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
        if(this.state.MessageText){
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
            /*localStorage存储自己发送的消息*/
            var ThisUsername = this.props.baseUsername;
            var subUsername = this.props.username;
            if(!localStorage.getItem(ThisUsername)){
                var MessageList = {}
            }else {
                MessageList = JSON.parse(localStorage.getItem(ThisUsername));
            }
            if(!MessageList[subUsername]){
                MessageList[subUsername] = [];
            }
            MessageList[subUsername].push({
                Message:this.state.MessageText,
                from:"2"
            });
            localStorage.setItem(ThisUsername,JSON.stringify(MessageList));
        }else {
            alert("消息为空时，不能发送。");
        }
    },
    /*组件完成加载之前，获取未读消息数据，进行渲染。*/
    componentWillReceiveProps:function (nextprops) {
        console.log("nextprops.username",nextprops.username);
        console.log("this.props.username",this.props.username);
        console.log("nextprops.Text",nextprops.Text);
        console.log("nextprops.UnreadMessage",nextprops.UnreadMessage);
        if(!nextprops.Text){
            /*基本信息*/
            var ThisUsername = nextprops.baseUsername;
            var subUsername = nextprops.username;
            if(!localStorage.getItem(ThisUsername)){
                var MessageList = {};
            }else {
                MessageList = JSON.parse(localStorage.getItem(ThisUsername));
            }
            if(!MessageList[subUsername]){
                MessageList[subUsername] = [];
            }
            /*下一个窗口的用户名不能为空，并且和当前不是一个窗口。*/
            if(nextprops.username != this.props.username && nextprops.username){
                /*聊天窗口对象变了，同样要运行上一个窗口的关闭函数。*/
                this.props.ClosePanelOfChange(this.props.username);
                var Temp = [];
                this.setState({
                    MessageList:[]
                },function () {
                    Temp = this.state.MessageList
                });
                for(var i=0; i<nextprops.UnreadMessage.length; i++){
                    MessageList[subUsername].push({
                        Message:nextprops.UnreadMessage[i].Message,
                        from:"1"
                    })
                }
                for(var i=0; i<MessageList[subUsername].length; i++){
                    if(MessageList[subUsername][i].from == 1){
                        Temp.push(<ChatItemOther key={Temp.length+1} Message={MessageList[subUsername][i].Message} UserPhoto={nextprops.UserPhoto}/>);
                    }else if(MessageList[subUsername][i].from == 2){
                        Temp.push(<ChatItemMy key={Temp.length+1} Message={MessageList[subUsername][i].Message} UserPhoto={localStorage.UserPhoto}/>);
                    }
                }
                this.setState({
                    MessageList:Temp
                },function () {
                    Temp = null;
                });
                localStorage.setItem(ThisUsername,JSON.stringify(MessageList));
            }else if(nextprops.username == this.props.username && nextprops.username){//同一个窗口。
                var temp = this.state.MessageList;
                for(var i=0; i<nextprops.UnreadMessage.length; i++){
                    temp.push(<ChatItemOther key={temp.length +1} Message={nextprops.UnreadMessage[i].Message} UserPhoto={nextprops.UserPhoto} />);
                    MessageList[subUsername].push({
                        Message:nextprops.UnreadMessage[i].Message,
                        from:"1"
                    });
                }
                localStorage.setItem(ThisUsername,JSON.stringify(MessageList));
                this.setState({
                    MessageList:temp
                },function () {
                    temp = null;
                });
            }
        }

    },
    componentDidUpdate:function () {
        var TargetObj = document.getElementById("message-list");
        if(TargetObj){
            TargetObj.scrollTop = TargetObj.scrollHeight;
        }
    }
});

module.exports = ChatPanel;