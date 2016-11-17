var React = require("react");
var ReactDOM = require("react-dom");
//朋友列表基本单元
var Item = require("./friend-list-item");
//引入jquery
var Jquery = require("jquery");
//未登录时朋友列表处显示的信息。
var FriendListBase = require("./friend-list-base");
//引入socket
var socket = require("../client-io/init");



var AddingYou = React.createClass({
    getInitialState:function () {
        return {
            requireAddFriendList:[]
        }

    },
    render:function () {
        var Items = [];
        for(var i in this.state.requireAddFriendList){
            Items.unshift(<Item key={this.state.requireAddFriendList[i].id} BaseDate={this.state.requireAddFriendList[i]}/>);
        }
        return(
            <div className="">
                {Items}
            </div>
        )
    },
    componentDidMount:function () {
        socket.on("someOne is adding you",function () {
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
        }.bind(this));
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
    }
});

module.exports = AddingYou;