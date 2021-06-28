let canvasEl = document.getElementById("game-canvas");
let ctx = canvasEl.getContext("2d");

let x = canvasEl.width/2;
let y = canvasEl.height - 20;
let ballRadius = 10;
let dx = 0;
let dy = -3.5;

let paddleHeight = 10;
let paddleWidth = 105;
let paddleX = (canvasEl.width-paddleWidth)/2;

let rightPressed = false;
let leftPressed = false;

let brickRowCount = 4;
let brickColumnCount = 19;
let brickWidth = 70;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 40;
let brickOffsetLeft = 10;

let start = false;

let audioMovingBoardLeft = new Audio("moving board left.mp3");
let audioMovingBoardRight = new Audio("moving board right.mp3");
let audioPaddleHit = new Audio("paddle hit.mp3");
let audioWallCollision = new Audio("ball bounce.mp3");
let audioBrickCollision = new Audio("collision.mp3");
let audioGameOver = new Audio("game over.mp3");
let audioStart = new Audio("start.mp3");
let audioGameplaySong = new Audio("default music.mp3");
let audioPowerUpSong = new Audio("powerup music.mp3");
let audioPowerUp = new Audio("powerup.mp3");

let audioStartPlayCount = 1;

let powerUpBrick = false;
let powerUpBrickX = 0;
let powerUpBrickY = 0;
let powerUpCount = 2;
let powerUpChangeColor = false;

let score = 0;

let bricks = [];
for(let i = 0; i < brickColumnCount; i++){
    bricks[i] = [];
    for(let j = 0; j < brickRowCount; j++){
        bricks[i][j] = {x: 0, y: 0, status: 1, powerUpStatus: 0};
    }
}

function assignPowerUp(){
    for(let i = 0; i < powerUpCount; i++){
        let randomBrickColumn = Math.floor(Math.random() * brickColumnCount);
        let randomBrickRow = Math.floor(Math.random() * brickRowCount);
        bricks[randomBrickColumn][randomBrickRow].powerUpStatus = 1;
    }
}

assignPowerUp();

function drawBricks(){
    for(let i = 0; i < brickColumnCount; i++){
        for(let j = 0; j < brickRowCount; j++){
                if(bricks[i][j].status == 1){
                let brickX = (i*(brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (j*brickWidth) + brickOffsetTop;
                
                bricks[i][j].x = brickX;
                bricks[i][j].y = brickY;

                if(bricks[i][j].powerUpStatus == 0 && powerUpChangeColor == false){
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#0000FF";
                    ctx.fill();
                    ctx.closePath();
                } else if(bricks[i][j].powerUpStatus == 1 && powerUpChangeColor == false){
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "orange";
                    ctx.fill();
                    ctx.closePath();

                    ctx.font = "bold 14px Arial";
                    ctx.fillStyle = "yellow";
                    ctx.fillText("PowerUp", brickX + 3, brickY + 15);
                }

                if(powerUpChangeColor == true){
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = `#${randomHexGenerator()}${randomHexGenerator()}${randomHexGenerator()}${randomHexGenerator()}${randomHexGenerator()}${randomHexGenerator()}`;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
}

function randomHexGenerator(){
    let alpha = ['A', 'B', 'C', 'D', 'E', 'F', 1, 2, 3, 4, 5, 6, 7, 8, 9];
    return alpha[Math.floor(Math.random() * 15)];
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, 2*Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvasEl.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#00FF00";
    ctx.fill();
    ctx.closePath();
}

function drawPowerUp(){
    ctx.beginPath();
    ctx.rect(powerUpBrickX, powerUpBrickY, brickWidth, brickHeight);
    ctx.font = "14px Georgia";
    ctx.strokeStyle = "#FFFF00";
    ctx.strokeText("Power Up", powerUpBrickX+5, powerUpBrickY+15);
    ctx.stroke();
    ctx.closePath();
}

function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Score: "+ score, 8, 20);
}

function draw(){
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    paddleWallCollisionDetection();
    brickCollisionDetection();
    paddleMovement();

    if(powerUpBrick == true){
        drawPowerUp();
        powerUpBrickY += 1;
        powerUpBrickCollision();
    }

    if(start == true){
        ballMove();
    }

    if(score == brickColumnCount * brickRowCount){
        audioGameplaySong.pause();
        audioPowerUpSong.pause();
        alert("YOU WON");
        document.location.reload();
        clearInterval(interval);
    }

}

document.addEventListener("click", userResponseStart, false);

function userResponseStart(){
    start = true;
    audioGameplaySong.play();
    if(audioStartPlayCount === 1){
        audioStart.play();
        audioStartPlayCount -= 1;
    }
}

function ballMove(){
    x += dx;
    y += dy;
}

function brickCollisionDetection(){
    for(let i = 0; i < brickColumnCount; i++){
        for(let j = 0; j < brickRowCount; j++){
            let brik = bricks[i][j];
            if(brik.status == 1){
                if(x > brik.x && x < brik.x+brickWidth && y > brik.y && y < brik.y+brickHeight+ballRadius){
                    audioBrickCollision.pause();
                    dy = -dy;
                    if(brik.powerUpStatus == 1){
                        powerUpBrick = true;
                        powerUpBrickX = brik.x;
                        powerUpBrickY = brik.y;
                    }

                    ctx.beginPath();
                    ctx.rect(brik.x, brik.y, brickWidth, brickHeight);
                    ctx.fillStyle = "#FFFFFF";
                    ctx.fill();
                    ctx.closePath();

                    brik.status = 0;
                    score++;
                    audioBrickCollision.play();
                }
            }
        }
    }
}

function paddleWallCollisionDetection(){
    if(x + dx > canvasEl.width-ballRadius || x + dx < ballRadius){
        dx = -dx;
        audioWallCollision.play();
    }
    if(y + dy < ballRadius){
        dy = -dy;
        audioWallCollision.play();
    } else if(y + dy > canvasEl.height-ballRadius-paddleHeight){
        if(x > paddleX && x < paddleX + paddleWidth){
            let middleBoard = paddleX + (paddleWidth/2);
            
            if(x < middleBoard){
                let firstHalfMiddleBoard = paddleX + ((middleBoard - paddleX)/2);
                if(x < firstHalfMiddleBoard){
                    dx = 3;
                } else if(x > firstHalfMiddleBoard){
                    dx = 2;
                }
                dx = -dx;
            } else if(x > middleBoard){
                let secondHalfMiddleBoard = middleBoard + ((paddleX + paddleWidth - middleBoard)/2);
                if(x < secondHalfMiddleBoard){
                    dx = 2;
                } else{
                    dx = 3;
                }
            }
            dy = -dy;
            audioPaddleHit.play();
        }else{
            gameOver();
        }
    }
}

function powerUpBrickCollision(){
    if(powerUpBrickX > paddleX && powerUpBrickX < paddleX + paddleWidth && powerUpBrickY > canvasEl.height-paddleHeight - brickHeight){
        audioPowerUp.play();
        powerUp();
        powerUpBrick = false;
    }
}

function gameOver(){
    audioGameplaySong.pause();
    audioPowerUpSong.pause();
    audioGameOver.play();
    alert("Game over");
    document.location.reload();
    clearInterval(interval);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = true;
        audioMovingBoardRight.play();
    } else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = true;
        audioMovingBoardLeft.play();
    }
}

function keyUpHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = false;
        audioMovingBoardRight.pause();
    }else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = false;
        audioMovingBoardLeft.pause();
    }
}

function paddleMovement(){
    if(rightPressed){
        paddleX += 7;
        
        if(start == false){
            x += 7;
        }
    
        if(paddleX + paddleWidth > canvasEl.width){
            paddleX = canvasEl.width - paddleWidth;
            if(start == false){
            x = canvasEl.width - (paddleWidth/2);
            }
        }
    } else if(leftPressed){
        paddleX -= 7;
        
        if(start == false){
            x -= 7;
        }

        if(paddleX < 0){
            paddleX = 0;
            if(start == false){
            x = (paddleX + paddleWidth)/2;
            } 
        }
    }
}

function powerUp(){
    paddleWidth = 200;
    dy = 6;
    audioGameplaySong.pause();
    audioPowerUpSong.play();
    powerUpChangeColor = true;
    setTimeout(defaultGame, 15500);
}

function defaultGame(){
    paddleWidth = 105;
    dy = 3.5;
    powerUpChangeColor = false;
    audioPowerUpSong.pause();
    audioGameplaySong.play();
}

var interval = setInterval(draw, 10);

