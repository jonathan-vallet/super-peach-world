Game = {
	MOVE_TICK_FRAME_NUMBER: 8,
	GRAVITY: 0.5,
	PEACH_RIGHT: 1,
	PEACH_LEFT: 0,
	PEACH_JUMP: 2,
	PEACH_WIDTH: 32,
	PEACH_HEIGHT: 64,
	PEACH_VELOCITY_X: 2,
	GROUND_Y: 230,

	init: function() {
		this.skyElement = document.querySelector('#game-parallax-sky');
		this.backgroundElement = document.getElementById('game-parallax-background');
		
		// Sets parallax background for sky and trees
		this.currentSkyPosition = 0;
		this.currentBackgroundPosition = 0;

		this.movingSpeed = 0;
		this.isOnGround = true;

		this.currentTick = 0;
		this.peachFrame = this.PEACH_RIGHT;
		this.currentPeachFrameOffset = 0;
		
		// Inits canvas
		var canvas = document.getElementById('peach');
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
		this.context = canvas.getContext('2d');
		this.canvasWidth = canvas.width;
		this.canvasHeight = canvas.height;
		
		// Sets peach image
		this.peachImage = new Image();
		this.peachImage.src = 'assets/img/peach.png';
		this.peachImage.addEventListener('load', function() {
			this.draw();
		}.bind(this));
		this.peachX = this.canvasWidth / 2;
		this.peachY = this.GROUND_Y;
		this.peachVelocityY = 0;
		
		this.bindEvents();
		this.gameLoop();
		this.draw();
	},
	
	bindEvents: function() {
		window.addEventListener('keydown', function(k) {
		    switch(k.keyCode) {
		        case 32: //up
		        case 38: //up
		        	this.startJump();
		            break;
		        case 37: //left
		        	this.movingSpeed = 1;
		        	this.peachFrame = this.PEACH_RIGHT;
		            break;
		        case 39: //right
		        	this.movingSpeed = -1;
		        	this.peachFrame = this.PEACH_LEFT;
		            break;
		    }
		}.bind(this));

		window.addEventListener('keyup', function(k) {
		    switch(k.keyCode) {
		        case 32: //up
		        case 38: //up
		        	this.stopJump();
		            break;
		        case 37: //left
		        case 39: //right
		        	this.movingSpeed = 0;
		        	this.currentPeachFrameOffset = 0; // Resets move animation
		        	this.draw(); // Redraw image to reset move state
		            break;
		    }
		}.bind(this))
	},

	startJump: function() {
		if(this.isOnGround) {
			this.peachVelocityY = -12;
			this.isOnGround = false;
		}
	},

	stopJump: function() {
	    if(this.peachVelocityY < -4)
	    	this.peachVelocityY = -4;
	},
	
	gameLoop: function () {
		window.requestAnimationFrame(this.gameLoop.bind(this));
		this.playFrameEvents();
	},

	playFrameEvents: function() {
		var draw = false;
		
		if(this.movingSpeed !== 0) {
			draw = true;
			this.currentBackgroundPosition += 0.8 * this.movingSpeed * this.PEACH_VELOCITY_X;
			this.currentSkyPosition += 0.5 * this.movingSpeed * this.PEACH_VELOCITY_X;
			this.backgroundElement.style.backgroundPositionX = Math.floor(this.currentBackgroundPosition) + 'px';
			this.skyElement.style.backgroundPositionX = Math.floor(this.currentSkyPosition) + 'px';

			if(++this.currentTick > this.MOVE_TICK_FRAME_NUMBER) {
				this.currentTick = 0;
				this.currentPeachFrameOffset = ++this.currentPeachFrameOffset % 2;
			}
		}
		
		if(!this.isOnGround) {
			this.currentPeachFrameOffset = this.PEACH_JUMP;
			draw = true;
			this.peachVelocityY += this.GRAVITY;
			this.peachY += this.peachVelocityY;
			if(this.peachY > this.GROUND_Y) {
				this.peachY = this.GROUND_Y;
				this.isOnGround = true;
				this.currentPeachFrameOffset = 0;
			}
		}
		
		if(draw) {
			this.draw();
		}
	},

	draw: function() {
		this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		this.context.drawImage(this.peachImage, this.currentPeachFrameOffset * this.PEACH_WIDTH, this.peachFrame * this.PEACH_HEIGHT, this.PEACH_WIDTH, this.PEACH_HEIGHT, this.peachX, this.peachY, 32, 64);
	}
}

Game.init();