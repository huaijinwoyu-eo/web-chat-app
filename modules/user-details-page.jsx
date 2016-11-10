var React = require("react");
var ReactDOM = require("react-dom");
var Jquery = require("jquery");

//时钟模块
var Clock = require("./clock");
var UserDetails = React.createClass({
    getInitialState:function(){
        return{
            sexual:"",
            age:"",
            educational_background:"",
            profession:"",
            status:""
        }
    },
    HandleChange:function(value,event){
        if(value==="sexual"){
            this.setState({
                sexual:event.target.value
            });
        }else if(value==="age") {
            this.setState({
                age:event.target.value
            })
        }else if(value==="educational_background"){
            this.setState({
                educational_background:event.target.value
            })
        }else {
            this.setState({
                profession:event.target.value
            })
        }
    },
    render:function(){
        return(
            <div>
                <div className="item-title">
                    {this.props.title}
                    <div className="form-close" onClick={this.HandleClose}>
                        <span className="fa fa-times"></span>
                    </div>
                </div>
                <hr/>
                <div className="content">
                    <form onSubmit={this.HandleSubmit}>
                        <div className="">{this.state.status}</div>
                        <label htmlFor="">性别：</label>
                        <input value={this.state.sexual} onChange={this.HandleChange.bind(this,"sexual")} type="text" placeholder="请输入性别。" />
                        <br/>
                        <label htmlFor="">年龄：</label>
                        <input value={this.state.age} onChange={this.HandleChange.bind(this,"age")} type="text" placeholder="请输入年龄。" />
                        <br/>
                        <label htmlFor="">学历：</label>
                        <input type="text" value={this.state.educational_background} onChange={this.HandleChange.bind(this,"educational_background")} placeholder="请输入学历。" />
                        <br/>
                        <label htmlFor="">专业：</label>
                        <input type="text" value={this.state.profession} onChange={this.HandleChange.bind(this,"profession")} placeholder="请输入专业名称。"/>
                        <br/>
                        <input type="submit" value="提交" />
                    </form>
                </div>
            </div>
        )
    },
    HandleClose:function () {
        ReactDOM.render(
            <Clock title="当前时钟"/>,
            document.getElementById("other-thing")
        );
    },
    HandleSubmit:function(event){
        event.preventDefault();
        if(!this.state.sexual){
            this.setState({
                status:"用户性别不能为空。"
            });
            return;
        }
        if(!this.state.age){
            this.setState({
                status:"用户年龄不能为空。"
            });
            return;
        }
        if(!this.state.educational_background){
            this.setState({
                status:"学历不能为空。"
            });
            return;
        }
        if(!this.state.profession){
            this.setState({
                status:"专业不能为空。"
            })
        }
        Jquery.ajax({
            type:"POST",
            url:"/users/details",
            data:{
                username:this.props.username,
                sexual:this.state.sexual,
                age:this.state.age,
                educational_background:this.state.educational_background,
                profession:this.state.profession
            },
            success:function (code) {
                console.log(code);
                switch (code){
                    case "1":this.setState({
                        status:"提交失败，请稍后重试。"
                    });
                        break;
                    case "2":
                        this.setState({
                            status:"恭喜你，详细信息提交成功！"
                        });
                    {this.props.Ffunction()}
                        setTimeout(function () {
                            ReactDOM.render(
                                <Clock title="当前时钟"/>,
                                document.getElementById("other-thing")
                            );
                        }.bind(this),1000);
                        break;
                    default:break;
                }
            }.bind(this)
        })
    }
});

module.exports = UserDetails;