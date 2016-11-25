var React = require("react");
var ReactDOM = require("react-dom");
//朋友列表基本单元
var Item = require("./friend-list-item");
//引入chatForm-online
var ChatPanelOnline = require("./chat-panel-online");

var YouFriend = React.createClass({
    getInitialState:function () {
        return{
            UnreadMessage:[],
            username:"",/*发送消息对象的名称，改状态通过friend-list组件来动态获取。*/
            UserPhoto:"",/*对方的头像。*/
            Text:"双击用户列表，可以打开聊天窗口，进行聊天。",/*消息发送窗口不打开时，需要在该区域现实的文字。*/
            isOpened:false,
            TheObj:""
        }
    },
    render:function () {
        var ItemsNew = [];
        var ItemOnline = [];
        var ItemNotOnline = [];
        for(var i=0; i<this.props.FriendsDate.length; i++){
            if(this.props.FriendsDate[i].New){
                ItemsNew.push(<Item key = {this.props.FriendsDate[i].id} isOpened={this.state.isOpened} TheObj={this.state.TheObj} GetMessageData={this.HandleGetMessageData} RemoveNewTag={this.props.RemoveNewTag} BaseDate={this.props.FriendsDate[i]} username={this.props.username}/>);
            }else if(this.props.FriendsDate[i].OnlineTag && !this.props.FriendsDate[i].New){
                ItemOnline.push(<Item key = {this.props.FriendsDate[i].id} isOpened={this.state.isOpened} TheObj={this.state.TheObj}  GetMessageData={this.HandleGetMessageData} BaseDate={this.props.FriendsDate[i]} username={this.props.username}/>);
            }else if(!this.props.FriendsDate[i].OnlineTag && !this.props.FriendsDate[i].New){
                ItemNotOnline.push(<Item key = {this.props.FriendsDate[i].id} isOpened={this.state.isOpened} TheObj={this.state.TheObj} GetMessageData={this.HandleGetMessageData} BaseDate={this.props.FriendsDate[i]} username={this.props.username}/>);
            }
        }
        var Items = ItemsNew.concat(ItemOnline).concat(ItemNotOnline);
        return(
            <div className="YouFriend">
                {Items}
                <ChatPanelOnline ClosePanel={this.HandleClosePanel} UnreadMessage={this.state.UnreadMessage} Text={this.state.Text} username={this.state.username} baseUsername={this.props.username} UserPhoto={this.state.UserPhoto}/>
            </div>
        )
    },
    /*获取未读消息的数据。*/
    HandleGetMessageData:function (obj) {
        this.setState({
            UnreadMessage:obj.UnreadMessage,
            username:obj.username,
            UserPhoto:obj.UserPhoto,
            Text:""
        });
    },
    /*关闭聊天窗口，相关操作*/
    HandleClosePanel:function (obj) {
        this.setState({
            Text:"双击用户列表，可以打开聊天窗口，进行聊天。",
            TheObj:obj
        });
    },
    componentWillReceiveProps:function (nextprops) {
        if(nextprops.FriendsDate.length == 0){
            this.setState({
                Text:"目前您还没有好友，可以点击右上方的搜索按钮进行好友搜索。"
            });
        }else {
            this.setState({
                Text:"双击用户列表，可以打开聊天窗口，进行聊天。"
            });
        }
    }
});

module.exports = YouFriend;