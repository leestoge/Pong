var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 5;

var player1Score = 0;
var player2Score = 0;
const WIN_CONDITION = 3;
var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICCNESS = 10;

function calculateMousePos(evt) 
{
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;

	 return {
		x:mouseX,
		y:mouseY
	 };
}

function handleMouseClick(evt)
{
	if (showingWinScreen)
	{
		player1Score = 0; // reset scores
		player2Score = 0;
		showingWinScreen = false;
	}
}

window.onload = function()
{
	console.log("Hello World!");
	
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	
	var FPS = 30;
	setInterval(function()
	{
		moveAll();
		drawAll();
	}, 1000 / FPS);
	
	canvas.addEventListener('mousedown', handleMouseClick);
	
	canvas.addEventListener('mousemove', function(evt)
	{
		var mousePos = calculateMousePos(evt)
		paddle1Y = mousePos.y-(PADDLE_HEIGHT / 2);
	});
}

function ballReset()
{
	if(player1Score >= WIN_CONDITION || player2Score >= WIN_CONDITION)
	{
		showingWinScreen = true;
	}

	ballSpeedX = -ballSpeedX;
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
}

function computerMovement()
{
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);
	
	if(paddle2YCenter < ballY - 35)
	{
		paddle2Y += 13;
	}
	else if(paddle2YCenter > ballY + 35)
	{
		paddle2Y -= 13;
	}
}
	
function moveAll()
{
	if(showingWinScreen)
	{
		return;
	}
	computerMovement();
	
	ballX += ballSpeedX;
	ballY += ballSpeedY;
	
	if(ballX <= PADDLE_THICCNESS)
	{
		if(ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT)
		{
			var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
			ballSpeedX = -ballSpeedX;
			ballSpeedY = deltaY * 0.35;
		}
		else
		{
			player2Score++;
			ballReset();
		}
	}
	if(ballX >= canvas.width - PADDLE_THICCNESS - 10)
	{
		if(ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT + 10)
		{
			var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
			ballSpeedX = -ballSpeedX;
			ballSpeedY = deltaY * 0.45;
		}
		else
		{
			player1Score++;
			ballReset();						
		}
	}
	if(ballY <= 0)
	{
		ballSpeedY = -ballSpeedY;
	}
	if(ballY >= canvas.height)
	{
		ballSpeedY = -ballSpeedY;
	}
}

function drawNet()
{
	for(var i = 0; i<canvas.height; i += 35)
	{
		colourRect(canvas.width / 2 - 1, i, 2, 20, 'white'); // Game background
	}
}

function drawAll()
{										
	colourRect(0, 0, canvas.width, canvas.height, 'black'); // Game background
	
	if(showingWinScreen)
	{
	canvasContext.fillStyle = 'white';
	
		if(player1Score >= WIN_CONDITION)
		{
			canvasContext.fillText("Player won!", 350, 200)
		}
		else if(player2Score >= WIN_CONDITION)
		{
			canvasContext.fillText("Computer won!", 350, 200)
		}
		
		canvasContext.fillText("Click to play again.", 350, 300)
		return;
	}
	
	drawNet();			
	colourRect(5, paddle1Y, PADDLE_THICCNESS, PADDLE_HEIGHT, 'white'); // Player paddle
	colourRect(canvas.width - PADDLE_THICCNESS - 5, paddle2Y, PADDLE_THICCNESS, PADDLE_HEIGHT, 'white'); // AI paddle
	colourCirc(ballX, ballY, PADDLE_THICCNESS, 'white'); // Ball
	canvasContext.fillText(player1Score, canvas.width / 2 - 100, 100)
	canvasContext.fillText(player2Score, canvas.width / 2 + 100, 100)
}

function colourCirc (centerX, centerY, radius, drawColour)
{
	canvasContext.fillStyle = drawColour;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true)
	canvasContext.fill();
}

function colourRect (leftX, topY, width, height, drawColour)
{
	canvasContext.fillStyle = drawColour;
	canvasContext.fillRect(leftX, topY, width, height);
}