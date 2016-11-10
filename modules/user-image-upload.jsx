var React = require("react");
var ReactDOM = require("react-dom");
var Jquery = require("jquery");
//时钟模块
var Clock = require("./clock");
var UserImage = React.createClass({
    getInitialState:function () {
        return{
            status:this.props.status || "",
            targetImage:[]
        }
    },
    render:function () {
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
                        <canvas id="canvas" width={290}>
                            {"您的浏览器不支持canvas。"}
                        </canvas>
                        <canvas id="copy" width={290}></canvas>
                        <canvas id="trans" width={290}></canvas>
                        <canvas id="Mir"></canvas>
                        <canvas id="test" width={290} height={300}></canvas>
                        <a href="#" className="upload-wrap">
                            选择图片
                            <input id="upload-btn" type="file" accept="image/png,image/jpeg" />
                        </a>
                        <a href="#" className="margin upload-wrap" onClick={this.HandleSubmit}>
                            提交头像
                        </a>
                        <a href="#" id="btn" className="upload-wrap">
                            取消选择
                        </a>
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
    HandleSubmit:function (event) {
        event.preventDefault();
        Jquery.ajax({
            type:"POST",
            url:"/users/uploadImage",
            data:{
                targetImage:this.state.targetImage,
                username:this.props.username
            },
            success:function (code) {
                console.log(code);
                switch (code){
                    case "1":this.setState({
                        status:"上传失败，请稍后重试。"
                    });
                        break;
                    case "3":this.setState({
                        status:"头像上传成功。"
                    });
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
    },
    componentDidMount:function () {

        var test = document.getElementById("test");
        var testContext = test.getContext("2d");








        /*如果浏览器不支持FileReader功能，错误弹窗。*/
        if(typeof FileReader == "undified") {
            alert("您老的浏览器不行了！");
        }
        //获取主canvas以及上下文。
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        //备份，通过离屏canvas，，用来截取想的图像。
        var canvas_copy = document.getElementById("copy");
        var context_copy = canvas_copy.getContext("2d");
        //截取的部分。
        var Mir = document.getElementById("Mir");
        var MirContext = Mir.getContext("2d");
        //遮罩层。
        var trans = document.getElementById("trans");
        var transcontext = trans.getContext("2d");

        var image = new Image();
        var image_bg = new Image();
        // 检测是否有鼠标按下
        var isMouseDown = false;
        var isRect = false;


        var basePoint;
        var constPoint;
        canvas.onmousedown = function (event) {
            event.preventDefault();
            isMouseDown = true;
            basePoint = getInitalPoint(event.clientX,event.clientY);
        };
        canvas.onmousemove = function (event) {
            event.preventDefault();
            var Point = getInitalPoint(event.clientX,event.clientY);
            if(isMouseDown && !isRect){
                constPoint = basePoint;
                Mir.width = Point.x - basePoint.x;
                Mir.height = Point.y - basePoint.y;
                MirContext.clearRect(0,0,Mir.width,Mir.height);
                MirContext.drawImage(canvas_copy,basePoint.x,basePoint.y,Mir.width,Mir.height,0,0,Mir.width,Mir.height);
                context.clearRect(0,0,canvas.width,canvas.height);
                context.drawImage(image,0,0,canvas.width,canvas.height);
                context.drawImage(trans,0,0,canvas.width,canvas.height);
                context.save();
                context.beginPath();
                context.strokeStyle = "#42AA69";
                context.lineWidth = 5;
                context.rect(basePoint.x,basePoint.y,Mir.width,Mir.height);
                context.stroke();
                context.clip();
                context.drawImage(Mir,0,0,Mir.width,Mir.height,basePoint.x,basePoint.y,Mir.width,Mir.height);
                context.restore();
            }else if(isRect && isMouseDown){
                var scroll_x = Point.x - basePoint.x;
                var scroll_y = Point.y - basePoint.y;
                MirContext.clearRect(0,0,Mir.width,Mir.height);
                MirContext.drawImage(canvas_copy,constPoint.x-scroll_x,constPoint.y-scroll_y,Mir.width,Mir.height,0,0,Mir.width,Mir.height);
                context.clearRect(0,0,canvas.width,canvas.height);
                context.drawImage(image,scroll_x,scroll_y,canvas.width,canvas.height);
                context.drawImage(trans,0,0,canvas.width,canvas.height);
                context.save();
                context.beginPath();
                context.strokeStyle = "#42AA69";
                context.lineWidth = 5;
                context.rect(constPoint.x,constPoint.y,Mir.width,Mir.height);
                context.stroke();
                context.clip();
                context.drawImage(Mir,0,0,Mir.width,Mir.height,constPoint.x,constPoint.y,Mir.width,Mir.height);
                context.restore();
            }
            this.setState({
                targetImage:Mir.toDataURL("image/png")
            },function () {
                testContext.clearRect(0,0,test.width,test.height);
                var testImage = new Image();
                testImage.src = this.state.targetImage;
                testImage.onload = function () {
                    testContext.drawImage(testImage,0,0,test.width,test.height);
                }
            });

        }.bind(this);
        canvas.onmouseup = function (event) {
            event.preventDefault();
            isMouseDown = false;
            isRect = true;
        };
        canvas.onmouseout = function (event) {
            event.preventDefault();
            isMouseDown = false;

        };
        var cancel = document.getElementById("btn");
        cancel.onclick = function () {
            isMouseDown = false;
            isRect = false;
            context.clearRect(0,0,canvas.width,canvas.height);
            context.drawImage(image,0,0,canvas.width,canvas.height);
            context.drawImage(trans,0,0,canvas.width,canvas.height);
        };
        //获取从上传按钮提供的内容。
        function showDataByURL() {
            var resultFile = document.getElementById("upload-btn").files[0];
            if (resultFile) {
                var reader = new FileReader();
                reader.readAsDataURL(resultFile);
                reader.onload = function (e) {
                    image.src =this.result;
                    context.clearRect(0,0,canvas.width,canvas.height);
                    image.onload = function () {
                        canvas.height = this.height*canvas.width/this.width;
                        trans.height = this.height*canvas.width/this.width;
                        canvas_copy.height = this.height*canvas.width/this.width;
                        context.drawImage(this,0,0,canvas.width,canvas.height);
                        image_bg.src = "/images/trans50.png";
                        image_bg.onload = function () {
                            transcontext.drawImage(image_bg,0,0,trans.width,trans.height);
                            context.drawImage(trans,0,0,canvas.width,canvas.height);
                            context_copy.drawImage(image,0,0,canvas_copy.width,canvas_copy.height);
                        };
                    }
                };
            }
        }
        function getInitalPoint(x,y) {
            var box = canvas.getBoundingClientRect();
            return{
                x:x-box.left,
                y:y-box.top
            }
        }
        Jquery("#upload-btn").change(function (event) {
            showDataByURL();
            this.setState({
                status:"请在阴影区域拖拽，以获取希望得到的图像区域，并且点击“提交头像”按钮完成操作。"
            });
        }.bind(this));

    }
});

module.exports = UserImage;