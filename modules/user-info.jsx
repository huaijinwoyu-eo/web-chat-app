var React = require("react");
var ReactDOM = require("react-dom");

var UserInfo = React.createClass({
    render:function(){
        render(
            <div className="user-info-index">
                <img src={} alt="" className="user-photo fl"/>
                <div className="info">
                    <p className="name">{}</p>
                    <input type="text" className="log-text" value={}/>
                </div>
            </div>
        )

    }
});
module.exports = UserInfo;