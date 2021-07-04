let canvasEl = document.getElementById("myCanvas");
let ctx = canvasEl.getContext("2d");
let position = {x:0, y:0};
let {x, y} = position;
let fontColor = "#FF0000"
let boardColor = "#0000FF"
let width = 20;

function resize(){
    ctx.canvas.height = window.innerHeight;
    ctx.canvas.width = window.innerWidth;
    ctx.fillStyle = boardColor;
    ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
}

resize();
window.addEventListener('resize', resize);

canvasEl.addEventListener('mousedown', setPos);
canvasEl.addEventListener('mouseenter', setPos);
canvasEl.addEventListener('mousemove', draw);

function setPos(event){
    x = event.clientX;
    y = event.clientY;
}

function draw(event){
    if(event.buttons !== 1)
        return;

    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.strokeStyle = fontColor;
    ctx.moveTo(x, y);
    setPos(event);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();
}