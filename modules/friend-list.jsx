var React = require("react");
var ReactDOM = require("react-dom");
var Item = require("./friend-list-item");
var UserList = React.createClass({
    getInitialState:function () {
        return{

        }
    },
    render:function () {
        var Items = [];

        return(
            <ul className="list">
                {Items}
            </ul>
        )
    }
});

module.exports = UserList;