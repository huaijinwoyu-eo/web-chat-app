var React = require("react");
var ReactDOM = require("react-dom");

var Clock = React.createClass({
    render:function () {
        return(
            <div>
                <div className="item-title">{this.props.title}</div>
                <hr/>
                <canvas id="clock" height="300" width="300" className="canvas-clock"></canvas>
            </div>
        )
    },
    componentDidMount:function () {
        var clock = document.getElementById("clock");
        var cxt = clock.getContext("2d");
        var width = cxt.canvas.width;
        var height = cxt.canvas.height;
        var r = width/2;
        var em = width/200;
//绘制背景
        function drawBackground() {
            cxt.save();
            cxt.translate(r,r);
            cxt.lineWidth=10*em;
            // cxt.strokeStyle = "#ccc";
            cxt.beginPath();
            cxt.arc(0,0,r-10*em/2,0,2*Math.PI,false);
            cxt.stroke();

            var hourNumbers = [3,4,5,6,7,8,9,10,11,12,1,2];
            cxt.font= 18*em+"px Arial";
            cxt.textAlign="center";
            cxt.textBaseline="middle";
            hourNumbers.forEach(function (number, i) {
                var rad = 2*Math.PI/12*i;
                var x = Math.cos(rad)*(r-30*em);
                var y = Math.sin(rad)*(r-30*em);
                cxt.fillText(number,x,y);
            });

            for (var i =0; i<60;i++){
                var rad = 2*Math.PI/60*i;
                var x = Math.cos(rad)*(r-15*em);
                var y = Math.sin(rad)*(r-15*em);
                cxt.beginPath();
                if(i%5 ==0){
                    cxt.fillStyle = '#000';
                    cxt.arc(x,y,2*em,0,2*Math.PI,false);
                }else {
                    cxt.fillStyle = "#ccc";
                    cxt.arc(x,y,2*em,0,2*Math.PI,false);
                }
                cxt.fill();
            }


        }
//绘制时针
        function drawHours(hours,minutes) {
            cxt.save();
            cxt.beginPath();
            var rad = 2*Math.PI/12*hours+(Math.PI*minutes/360);
            cxt.rotate(rad);
            cxt.lineWidth = 6*em;
            cxt.lineCap = "round";
            cxt.moveTo(0,15*em);
            cxt.lineTo(0,-r/2);
            cxt.stroke();
            cxt.restore();
        }
//绘制分针
        function drawMinute(minute,seconds) {
            cxt.save();
            cxt.beginPath();
            var rad = 2*Math.PI/60*minute+(Math.PI*seconds/1800);
            cxt.rotate(rad);
            cxt.strokeStyle = "#333";
            cxt.lineWidth = 3*em;
            cxt.lineCap = "round";
            cxt.moveTo(0,18*em);
            cxt.lineTo(0,-(r/2+10*em));
            cxt.stroke();
            cxt.restore();
        }
//绘制秒针
        function drawSeconds(seconds,ms) {
            cxt.save();
            cxt.beginPath();
            var rad = 2*Math.PI/60*seconds+(2*Math.PI/60)*(ms/1000);
            cxt.rotate(rad);
            cxt.fillStyle = "#c14543";
            cxt.moveTo(2*em,20*em);
            cxt.lineTo(0.5*em,-(r-15*em));
            cxt.lineTo(-0.5*em,-(r-15*em));
            cxt.lineTo(-2*em,20*em);
            cxt.lineTo(2*em,20*em);
            cxt.fill();
            cxt.restore();
        }
//绘制中心原点
        function drawDot() {
            cxt.beginPath();
            cxt.fillStyle = "#fff";
            cxt.arc(0,0,2*em,0,2*Math.PI,false);
            cxt.fill();
        }

        setInterval(function () {
            cxt.clearRect(0,0,width,height);
            var now = new Date();
            var hours = now.getHours();
            var minutes = now.getMinutes();
            var seconds = now.getSeconds();
            var ms = now.getMilliseconds();
            drawBackground();
            drawHours(hours,minutes);
            drawMinute(minutes,seconds);
            drawSeconds(seconds,ms);
            drawDot();
            cxt.restore();
        },42);

    }
});
ReactDOM.render(
    <Clock title="时钟"/>,
    document.getElementById("other-thing")
);
module.exports = Clock;