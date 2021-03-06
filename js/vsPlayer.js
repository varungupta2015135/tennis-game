//2 Player
var canvas;
var canvasContext;
var ballX = 50;
var ballSpeedX = 15;
var ballY = 50;
var ballSpeedY = 8;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

function calculateMousePosition(event) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = event.clientX - rect.left - root.scrollLeft;
  var mouseY = event.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
}

function handleMouseClick() {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

window.onload = function() {
  canvas = document.getElementById("gameCanvas");
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  canvasW = canvas.width;
  canvasH = canvas.height;
  canvasContext = canvas.getContext("2d");
  canvasContext.font = "30px Arial";
  var fps = 30;

  setInterval(function() {
    moveEverything();
    drawEverything();
  }, 1000 / fps);

  canvas.addEventListener("mousemove", function(event) {
    var mousePos = calculateMousePosition(event);
    if (mousePos.x <= canvasW / 2) {
      paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
    } else {
      paddle2Y = mousePos.y - PADDLE_HEIGHT / 2;
    }
  });

  canvas.addEventListener("mousedown", handleMouseClick);
};

function moveEverything() {
  if (showingWinScreen) {
    return;
  }

  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;

  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player2Score++;
      ballReset();
    }
  }
  if (ballX > canvasW) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player1Score++;
      ballReset();
    }
  }
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY > canvasH) {
    ballSpeedY = -ballSpeedY;
  }
}

function ballReset() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }
  ballSpeedX = -ballSpeedX;
  ballX = canvasW / 2;
  var num = Math.floor(Math.random() * canvasH - 10) + 10;
  ballY = num;
}

function drawNet() {
  for (var i = 0; i < canvasH; i += 40) {
    colorRect(canvasW / 2 - 1, i, 2, 20, "white");
  }
}

function drawEverything() {
  // Black out the screen
  if (ballX <= canvasW / 2) {
    colorRect(0, 0, canvasW, canvasH, "grey");
  } else {
    colorRect(0, 0, canvasW, canvasH, "black");
  }

  if (showingWinScreen) {
    canvasContext.fillStyle = "white";
    if (player1Score >= WINNING_SCORE) {
      var txt = "<== Grey Wins!";
      canvasContext.fillText(
        txt,
        canvasW / 2 - canvasContext.measureText(txt).width / 2,
        canvasH / 2
      );
    } else if (player2Score >= WINNING_SCORE) {
      var txt = "Black Wins! ==>";
      canvasContext.fillText(
        txt,
        canvasW / 2 - canvasContext.measureText(txt).width / 2,
        canvasH / 2
      );
    }
    return;
  }

  // Draw Net
  drawNet();

  // Left Paddle
  colorRect(0, paddle1Y, PADDLE_THICKNESS, 100, "white");

  // Right Paddle
  colorRect(
    canvasW - PADDLE_THICKNESS,
    paddle2Y,
    PADDLE_THICKNESS,
    100,
    "white"
  );

  //Ball
  colorCircle(ballX, ballY, 6, "white");

  //Scores
  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvasW - 100, 100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
