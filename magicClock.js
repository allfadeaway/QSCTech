const _magicCvs_ = document.getElementById("ClockCanvas");
const _mgCtx_ = _magicCvs_.getContext("2d");

const REALWIDTH = 800;


let clockBoardPos = {left: 0, top: 450, width: 200, height: 200};
const clockBoard = new Image();
clockBoard.src = "./src/ClockBoard.png";
clockBoard.onload = () => {
    _mgCtx_.drawImage(clockBoard, clockBoardPos.left, clockBoardPos.top, clockBoardPos.width, clockBoardPos.height);
}


/*
const HourHand = new Image();
HourHand.src = "./src/Bolt.png";
HourHand.onload = () => {
    _mgCtx_.drawImage(HourHand, 100, 550, 50, 50);
}


const MinuteHand = new Image();
MinuteHand.src = "./src/Bolt.png";
MinuteHand.onload = () => {
    _mgCtx_.drawImage(MinuteHand, 75, 100, 50, 120);
}
*/



let isDown = false;
let now = {x: -1, y: -1};
let boltPos = {left: 75, top: 100, width: 50, height: 120};
const Bolt = new Image();
Bolt.src = "./src/Bolt.png";
Bolt.onload = () => {
    _mgCtx_.drawImage(Bolt, boltPos.left, boltPos.top, boltPos.width, boltPos.height);
}
Bolt.style.position = "absolute";


updatePos(boltPos.left, boltPos.top);
_magicCvs_.onmousedown = e => {
    isDown = true;     
    // 鼠标按下时，设置isDown为true，此时移动鼠标才认为是有效。
    console.log("鼠标按下");
    let x = e.offsetX;     
    // 后面这个是偏移量，但是在这里为0
    let y = e.offsetY;
    now.x = x;
    now.y = y;
    console.log(x + " -> " + y);
    if (!_mgCtx_.isPointInPath(x, y)) {
        console.log("鼠标没在路径内");
        return;
    }
    drawAll();
};
_magicCvs_.onmousemove = e => {
    // 在鼠标移动时，不断重绘制整个canvas
    if (!isDown) {  
        // 鼠标未按下则直接返回，不去响应该事件。
        return;
    }
    let x = e.offsetX;
    let y = e.offsetY;
    console.log(x + " " + y);
    if (!_mgCtx_.isPointInPath(x, y)) { 
        console.log("鼠标没在路径内");
        return;
    }
    _mgCtx_.clearRect(0, 0, _magicCvs_.width, _magicCvs_.height);
    boltPos.left = boltPos.left + (x - now.x);
    boltPos.top = boltPos.top + (y - now.y);
    updatePos(boltPos.left, boltPos.top);
    judgePosition();

    drawAll();
    now.x = x; 
    now.y = y;
    console.log("鼠标在移动..." + x + " --> " + y);
}
_magicCvs_.onmouseup = e => {
    // 鼠标松开，则上述封装的动作结束。
    isDown = false;  
    console.log("鼠标松开");
    drawAll();
}
_magicCvs_.onmouseout = e => {
    // 如果鼠标按下然后移动的过程中离开了当前元素，再松开，但是无法触发鼠标松开事件了，
    // 所以当监听到鼠标移出元素时，必须也要将isDown设置成false。
    isDown = false;
    console.log("鼠标离开了画布元素");
    judgePosition(); 
    drawAll(); 
}
function drawAll() {
    //draw所有元素
    _mgCtx_.clearRect(0, 0, _magicCvs_.width, _magicCvs_.height);
    _mgCtx_.drawImage(Bolt, boltPos.left, boltPos.top, boltPos.width, boltPos.height);
    _mgCtx_.drawImage(clockBoard, clockBoardPos.left, clockBoardPos.top, clockBoardPos.width, clockBoardPos.height);
    //drawImage
    //drawImage
    console.log("Rect:", boltPos.left, boltPos.top);
    _mgCtx_.rect(boltPos.left, boltPos.top, boltPos.width, boltPos.height);
}

function updatePos(x, y) {
    //更新左上角位置
    console.log("传入的参数值：", x, y);
    boltPos.left = x;
    boltPos.top = y;
}
function judgePosition() {
    // 判断位置，当点越界时，进行处理
    console.log("judgePosition:", boltPos);
    if (boltPos.left < 0) updatePos(0, boltPos.top);
    if (boltPos.top < 0) updatePos(boltPos.left, 0);
    if (boltPos.left + boltPos.width > _magicCvs_.width) updatePos(_magicCvs_.width - boltPos.width, boltPos.top);
    if (boltPos.top + boltPos.height > _magicCvs_.height) updatePos(boltPos.left, _magicCvs_.height - boltPos.height);
}