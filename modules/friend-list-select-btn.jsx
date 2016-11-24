var React = require("react");
var ReactDOM = require("react-dom");
//引入Jquery
var Jquery = require("jquery");

var SelectList = React.createClass({
    render:function () {
        return(
            <div id="list-select">
                <a href="#" className="list-btn cur" onClick={this.props.ShowFriendList}>
                    朋友列表
                    <i className="num">{this.props.AddedNumber>0 ? this.props.AddedNumber : ""}</i>
                </a>
                <a href="#" className="list-btn" onClick={this.props.ShowHasRequirList}>已请求列表</a>
                <a href="#" className="list-btn" onClick={this.props.ShowAddingYou}>
                    待确认列表
                    <i className="num">{this.props.AddingNumber>0 ? this.props.AddingNumber : ""}</i>
                </a>
            </div>
        )
    },
    componentDidMount:function () {
        Jquery("#list-select .list-btn").on("click",function () {
            Jquery("#list-select .list-btn.cur").removeClass("cur");
            Jquery(this).addClass("cur");
        })
    }
});


module.exports = SelectList;