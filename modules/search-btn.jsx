var React = require("react");
var ReactDOM = require("react-dom");
//引入搜索页面
var SearchPage = require("./search-page");



var SearchBtn = React.createClass({
    render:function () {
        return(
            <div className="search-btn" onClick={this.HandleClick}></div>
        )
    },
    HandleClick:function () {
        if(this.props.username){
            ReactDOM.render(
                <SearchPage addTemFriend={this.props.addTemFriend} title="搜索好友" username = {this.props.username}/>,
                document.getElementById("other-thing")
            );
        }else {
            alert("请登录。")
        }
    }
});

module.exports = SearchBtn;