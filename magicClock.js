const _magicCvs_ = document.getElementById("ClockCanvas");
const _mgCtx_ = _magicCvs_.getContext("2d");

const boundary = {width: _magicCvs_.width, height: 510};

const center = {left: 100, top: 550, r: 100};
let clockBoardPos = {left: 0, top: 450, width: 200, height: 200};
const clockBoard = new Image();
clockBoard.src = "./src/ClockBoard.png";
clockBoard.onload = () => {
    _mgCtx_.drawImage(clockBoard, clockBoardPos.left, clockBoardPos.top, clockBoardPos.width, clockBoardPos.height);
}



//100 550
const hourHandPos = {left: 93, top: 470, width: 15, height: 79};
const hourHandCenter = {left: 8, top:65};
let hourHandRotate = {
    rad: 2,
    R: Math.sqrt(hourHandCenter.left * hourHandCenter.left + hourHandCenter.top * hourHandCenter.top)
};
const hourHand = new Image();
hourHand.src = "./src/HourHand.png";
hourHand.onload = () => {}

const minuteHandPos = {left: 97, top: 470, width: 7, height: 79};
const minuteHandCenter = {left: 4, top:65};
let minuteHandRotate = {
    rad: 0,
    R: Math.sqrt(minuteHandCenter.left * minuteHandCenter.left + minuteHandCenter.top * minuteHandCenter.top)
};
const minuteHand = new Image();
minuteHand.src = "./src/MinuteHand.png";
minuteHand.onload = () => {}


let upt = {x: 0, y: 0};
let updateTime = false;
let reachBoundary = false;
let isDown = false;
let now = {x: -1, y: -1};
let boltPos = {left: 75, top: 100, width: 50, height: 120, headHeight: 40};
const Bolt = new Image();
Bolt.src = "./src/Bolt.png";
Bolt.onload = () => {}
Bolt.style.position = "absolute";

updatePos(boltPos.left, boltPos.top);

function _ClockAnimation(){
    //实时渲染
    if (updateTime) {
        //console.log("CHANGE!!!!!!!!!!");
        changeTime();
    }
    drawAll();
    window.requestAnimationFrame(_ClockAnimation);
}
_ClockAnimation();




_magicCvs_.onmousedown = e => {
    // 鼠标按下时，设置isDown为true，此时移动鼠标才认为是有效。
    //console.log("鼠标按下");
    let x = e.offsetX;     
    let y = e.offsetY;
    //console.log(x + " -> " + y, reachBoundary, pointInBoard(x, y));
    if (reachBoundary && pointInBoard(x, y)) {
        //console.log("更改时间");
        isDown = true;
        updateTime = true;
        upt.x = x;
        upt.y = y;
    }
    else if (pointInBolt(x, y)) {
        now.x = x;
        now.y = y;
        isDown = true;
    }
    else {
        //console.log("鼠标没在路径内");
    }
};
_magicCvs_.onmousemove = e => {
    // 在鼠标移动时，不断重绘制整个canvas
    if (!isDown) {  
        // 鼠标未按下则直接返回，不去响应该事件。
        return;
    }
    let x = e.offsetX;
    let y = e.offsetY;
    if (updateTime) {
        if (!pointInBoard()) updateTime = false;
        if (updateTime) { upt.x = x; upt.y = y; }
    }
    else {
        updatePos(boltPos.left, boltPos.top + (y - now.y));
        judgePosition();
        if (!pointInBoard()) updateTime = false;

        drawAll();
        now.y = y;
    }
    //console.log("鼠标在移动..." + x + " --> " + y);
}
_magicCvs_.onmouseup = e => {
    //鼠标松开
    isDown = false;  
    updateTime = false;
    //console.log("鼠标松开");
    drawAll();
}
_magicCvs_.onmouseout = e => {
    //鼠标移出
    isDown = false;
    updateTime = false;
    //console.log("鼠标离开了画布元素");
    drawAll(); 
}


function changeTime() {
    //修改时间
    let x = upt.x - center.left;
    let y = upt.y - center.top;
    if (x == 0 && y == 0) return;
    let rad = Math.atan2(y, x) + (Math.PI / 2);
    if (rad < 0) rad = rad + Math.PI * 2;
    let num = 0;
    while (rad > (Math.PI / 6)) {
        num = num + 1;
        rad = rad - (Math.PI / 6);
    }
    let nwH = num;
    let nwM = Math.floor(rad / (Math.PI / 6) * 60);

    let st = getTime();
    let prH = parseInt(st.slice(0, 2));
    let prM = parseInt(st.slice(3, 5));
    while (nwH * 60 + nwM < prH * 60 + prM) nwH = nwH + 12;
    while (nwH > 23) nwH = nwH - 24;

    //console.log("修改时间:", nwH, nwM);
    setTime(`${((nwH<10)?"0":"")}${nwH}:${((nwM<10)?"0":"")}${nwM}`);
    updaterad();
}


function hourHandDraw() {
    //时针渲染
    let rad = hourHandRotate.rad;
    let nwc = {
        left: hourHandCenter.left * Math.cos(rad) - hourHandCenter.top * Math.sin(rad),
        top: hourHandCenter.top * Math.cos(rad) + hourHandCenter.left * Math.sin(rad)
    };
    //console.log("坐标:", nwc.left, nwc.top);
    _mgCtx_.translate(center.left - nwc.left, center.top - nwc.top);
    _mgCtx_.rotate(rad);
    _mgCtx_.drawImage(hourHand, 0, 0, hourHandPos.width, hourHandPos.height);
    _mgCtx_.rotate(- rad);
    _mgCtx_.translate(- center.left + nwc.left, - center.top + nwc.top);
}
function minuteHandDraw() {
    //分针渲染
    let rad = minuteHandRotate.rad;
    let nwc = {
        left: minuteHandCenter.left * Math.cos(rad) - minuteHandCenter.top * Math.sin(rad),
        top: minuteHandCenter.top * Math.cos(rad) + minuteHandCenter.left * Math.sin(rad)
    };
    //console.log("坐标:", nwc.left, nwc.top);
    _mgCtx_.translate(center.left - nwc.left, center.top - nwc.top);
    _mgCtx_.rotate(rad);
    _mgCtx_.drawImage(minuteHand, 0, 0, minuteHandPos.width, minuteHandPos.height);
    _mgCtx_.rotate(- rad);
    _mgCtx_.translate(- center.left + nwc.left, - center.top + nwc.top);
}
function updaterad() {
    //按时间更新时针和分针角度
    let nwTime = getTime();
    let nwH = parseInt(nwTime.slice(0, 2));
    let nwM = parseInt(nwTime.slice(3, 5));
    //console.log("角度更改:", nwH, nwM);
    let nwMinute = nwH * 60 + nwM;
    hourHandRotate.rad = Math.PI * 2 * nwMinute / 720.0;
    minuteHandRotate.rad = Math.PI * 2 * nwM / 60.0;
}
function drawAll() {
    //draw所有元素
    _mgCtx_.clearRect(0, 0, _magicCvs_.width, _magicCvs_.height);
    _mgCtx_.drawImage(Bolt, boltPos.left, boltPos.top, boltPos.width, boltPos.height);
    _mgCtx_.drawImage(clockBoard, clockBoardPos.left, clockBoardPos.top, clockBoardPos.width, clockBoardPos.height);

    updaterad();
    hourHandDraw();
    minuteHandDraw();
}


function pointInBoard(x, y) {
    let Flag = true;
    if ((x - center.left) * (x - center.left) + (y - center.top) * (y - center.top) > center.r * center.r) Flag = false;
    //console.log("是否钟面界内:", Flag);    
    return Flag;
}
function pointInBolt(x, y) {
    let Flag = true;
    if (x < boltPos.left || x > boltPos.left + boltPos.width) Flag = false;
    if (y < boltPos.top || y > boltPos.top + boltPos.headHeight) Flag = false;
    //console.log("是否插销界内:", Flag);
    return Flag;
}
function updatePos(x, y) {
    //更新左上角位置
    //console.log("传入的参数值：", x, y);
    boltPos.top = y;
}
function judgePosition() {
    // 判断位置，当点越界时，进行处理
    //console.log("judgePosition:", boltPos);
    if (boltPos.left < 0) updatePos(0, boltPos.top);
    if (boltPos.top < 0) updatePos(boltPos.left, 0);
    if (boltPos.left + boltPos.width > boundary.width) updatePos(boundary.width - boltPos.width, boltPos.top);
    if (boltPos.top + boltPos.height > boundary.height) {
        reachBoundary = true;
        freezeTime();
        updatePos(boltPos.left, boundary.height - boltPos.height);
    }
    else if (boltPos.top + boltPos.height < boundary.height) {
        reachBoundary = false;
        meltTime();
    }
}