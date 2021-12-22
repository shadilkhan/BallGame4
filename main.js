
const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById("score");
let levelElement = document.getElementById("level");
const increment = document.getElementById("increment");
var level = 1;
var timer = 1000;
increment.addEventListener("click", function () {
    ++level;
    if (level >= 4) {
        level = 4;
    }
    if (level == 2) {
        timer = 600;
    }
    if (level == 3) {
        timer = 300;
    }
    if (level == 4) {
        timer = 100;
    }
    levelElement.value = level;
})
const decrement = document.getElementById("decrement");
decrement.addEventListener("click", function () {
    level -= 1;
    if (level <= 1) {
        level = 1;
    }
    if (level == 2) {
        timer = 600;
    }
    else if (level == 3) {
        timer = 300;
    }
    else if (level == 1) {
        timer = 1000;
    }
    levelElement.value = level;
})
const ROW = 12;
const COL = COLUMN = 3;
const SQ = circleSize = 46;
const VACANT = "WHITE";
const radius = 23;
const YELLOW = "yellow";
const PURPLE = "purple";
const GREEN = "green";
const BLUE = "blue";
function drawBall(x, y, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc((x + 0.5) * SQ, (y + 0.5) * SQ, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "WHITE";
    ctx.stroke();
}
var Grid = [];
for (r = 0; r < ROW; r++) {
    Grid[r] = [];
    for (c = 0; c < COL; c++) {
        Grid[r][c] = VACANT;
    }
}
function drawGrid() {
    for (r = 0; r < ROW; r++) {
        for (c = 0; c < COL; c++) {
            drawBall(c, r, Grid[r][c]);
        }
    }
}
drawGrid();
const O = [
    [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
  ];

const PIECES = [
    [O, "purple"],
    [O, "green"],
    [O, "yellow"],
    [O, "blue"]
];
function randomPiece() {
    let r = randomN = Math.floor(Math.random() * PIECES.length)
    return new Piece(PIECES[r][0], PIECES[r][1]);
}
let p = randomPiece();
function Piece(Ball, color) {
    this.Ball = Ball;
    this.color = color;
    this.BallN = 0;
    this.activeBall = this.Ball[this.BallN];
    this.x = 0;
    this.y = -3;
}
Piece.prototype.fill = function (color) {
    for (r = 0; r < this.activeBall.length; r++) {
        for (c = 0; c < this.activeBall.length; c++) {
            if (this.activeBall[r][c]) {
                drawBall(this.x + c, this.y + r, color);
            }
        }
    }
}
Piece.prototype.draw = function () {
    this.fill(this.color);
}
Piece.prototype.unDraw = function () {
    this.fill(VACANT);
}
Piece.prototype.moveDown = function () {
    if (!this.boundaryCheck(0, 1, this.activeBall)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        this.lock();
        p = randomPiece();
    }
}
Piece.prototype.moveRight = function () {
    if (!this.boundaryCheck(1, 0, this.activeBall)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}
Piece.prototype.moveLeft = function () {
    if (!this.boundaryCheck(-1, 0, this.activeBall)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}
var score = 0;
Piece.prototype.lock = function () {
    for (r = 0; r < this.activeBall.length; r++) {
        for (c = 0; c < this.activeBall.length; c++) {
            if (!this.activeBall[r][c]) {
                continue;
            }
            if (this.y + r < 0) {
                alert(`Game Over Your Score is ${score}`);
                gameOver = true;
                if (gameOver) {
                    location.reload();
                }
                break;
            }
            Grid[this.y + r][this.x + c] = this.color;
        }
    }
    
    
    for(let c=0;c<COL;c++){
        for(let r=0;r<=9;r++){
            if((Grid[r][c]===Grid[r+1][c]) && (Grid[r][c]===Grid[r+2][c]) && (Grid[r][c]!==VACANT)){
                Grid[r][c]=VACANT;
                Grid[r+1][c]=VACANT;
                Grid[r+2][c]=VACANT;
                score+=100;
                scoreElement.value = score;
            }
        }
    }

    function checkHorizontal(Grid,color){
        for (r = 0; r < ROW; r++) {
            let isRowFull = true;
            for (c = 0; c < COL; c++) {
                isRowFull = (isRowFull && (Grid[r][c] == color));
            }
            if (isRowFull) {
                for (y = r; y > 1; y--) {
                    for (c = 0; c < COL; c++) {
                        Grid[y][c] = Grid[y - 1][c];
                    }
                }
                for (c = 0; c < COL; c++) {
                    Grid[0][c] = VACANT;
                }
                score += 100;
                scoreElement.value = score;
            }
        }
    }
    checkHorizontal(Grid,YELLOW);
    drawGrid();
    checkHorizontal(Grid,BLUE);
    drawGrid();
    checkHorizontal(Grid,GREEN);
    drawGrid();
    checkHorizontal(Grid,PURPLE);
    drawGrid();
}
Piece.prototype.boundaryCheck = function (x, y, piece) {
    for (r = 0; r < piece.length; r++) {
        for (c = 0; c < piece.length; c++) {
            if (!piece[r][c]) {
                continue;
            }
            let newX = this.x + c + x;
            let newY = this.y + r + y;
            if (newX < 0 || newX >= COL || newY >= ROW) {
                return true;
            }
            if (newY < 0) {
                continue;
            }
            if (Grid[newY][newX] != VACANT) {
                return true;
            }
        }
    }
    return false;
}
document.addEventListener("keydown", CONTROL);
function CONTROL(event) {
    if (event.keyCode == 37) {
        p.moveLeft();
        setTimeout(()=>{
            p.moveDown();
        },150)
        dropStart = Date.now();
    } else if (event.keyCode == 39) {
        p.moveRight();
        setTimeout(()=>{
            p.moveDown();
        },150)
        dropStart = Date.now();
    } else if (event.keyCode == 40) {
        p.moveDown();
    }
}
let leftarrow = document.getElementById("left_arrow");
leftarrow.addEventListener("click", () => {
    p.moveLeft();
    setTimeout(()=>{
        p.moveDown();
    },150)
    dropStart = Date.now();
});
let rightarrow = document.getElementById("right_arrow");
rightarrow.addEventListener("click", () => {
    p.moveRight();
    setTimeout(()=>{
        p.moveDown();
    },150)
    dropStart = Date.now();
});
let downarrow = document.getElementById("down_arrow");
downarrow.addEventListener("click", () => {
    p.moveDown();
});
let dropStart = Date.now();
let gameOver = false;
function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > timer) {
        p.moveDown();
        dropStart = Date.now();
    }
    if (!gameOver) {
        requestAnimationFrame(drop);
    }
}
drop();
