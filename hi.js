var canvas = document.getElementById("pongCanvas");
var ctx = canvas.getContext("2d");

var paddleWidth = 10;
var paddleHeight = 60;
var ballSize = 10;

var player = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    dy: 5, // speed of paddle movement
};

var ai = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    dy: 3,
};

var ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 5, // speed of ball movement in x-axis
    dy: 2, // speed of ball movement in y-axis
};

var level = 1;
var pointsToWin = 5; // Adjust as needed

function drawPaddle(x, y) {
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, ballSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background color based on the level
    ctx.fillStyle = getRandomColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw paddles and ball
    drawPaddle(player.x, player.y);
    drawPaddle(ai.x, ai.y);
    drawBall(ball.x, ball.y);

    // Draw level and points needed
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px Arial";
    ctx.fillText("Level: " + level, canvas.width / 2, 30);
    ctx.fillText("Points to win: " + pointsToWin, canvas.width / 2, 60);

    // Move the paddles
    player.y += player.dy;
    ai.y += ai.dy;

    // Move the ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collisions with walls
    if (ball.y - ballSize < 0 || ball.y + ballSize > canvas.height) {
        ball.dy = -ball.dy;
    }

    // Ball collisions with paddles
    if (
        (ball.x - ballSize < player.x + paddleWidth &&
            ball.y > player.y &&
            ball.y < player.y + paddleHeight) ||
        (ball.x + ballSize > ai.x &&
            ball.y > ai.y &&
            ball.y < ai.y + paddleHeight)
    ) {
        ball.dx = -ball.dx;
    }

    // AI movement
    if (ai.y > ball.y - paddleHeight / 2) {
        ai.y -= ai.dy;
    }
    if (ai.y < ball.y - paddleHeight / 2) {
        ai.y += ai.dy;
    }

    // Scoring
    if (ball.x < 0) {
        // Player scores
        pointsToWin--;

        if (pointsToWin === 0) {
            // Player wins the round, increase level
            level++;
            pointsToWin = 5; // Reset points for the next level
        }

        resetGame();
    } else if (ball.x > canvas.width) {
        // AI scores
        resetGame();
    }

    // Request the next animation frame
    requestAnimationFrame(draw);
}

function resetGame() {
    // Reset ball position
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    // Reset paddle positions
    player.y = canvas.height / 2 - paddleHeight / 2;
    ai.y = canvas.height / 2 - paddleHeight / 2;
}

function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

document.addEventListener("keydown", function (event) {
    // Move player paddle
    if (event.key === "ArrowUp" && player.y > 0) {
        player.dy = -5;
    } else if (event.key === "ArrowDown" && player.y < canvas.height - paddleHeight) {
        player.dy = 5;
    }
});

document.addEventListener("keyup", function () {
    player.dy = 0;
});

// Initial draw
draw();
