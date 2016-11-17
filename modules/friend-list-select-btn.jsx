var React = require("react");
var ReactDOM = require("react-dom");
//引入Jquery
var Jquery = require("jquery");

var SelectList = React.createClass({
    render:function () {
        return(
            <div>
                <a href="#" className="list-btn" onClick={this.props.ShowFriendList}>朋友列表</a>
                <a href="#" className="list-btn" onClick={this.props.ShowHasRequirList}>已请求列表</a>
                <a href="#" className="list-btn" onClick={this.props.ShowAddingYou}>
                    待确认列表
                    <i className="num">{this.props.AddingNumber}</i>
                </a>
            </div>
        )
    },
    componentDidMount:function () {
        if(this.props.AddingNumber){
            Jquery(".list-btn .num").show();
        }else {
            Jquery(".list-btn .num").hide();
        }
    }
});


module.exports = SelectList;