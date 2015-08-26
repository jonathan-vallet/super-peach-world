(function(window, document, undefined) {
	'use strict';

	var GRAVITY = 0.5; // Gravity, to make jump go back to the ground. Used for Peach and animals
	var MOVE_TICK_FRAME_NUMBER = 8; // When peach moves, she has 2 sprites to animate her. This defines the number of frame efore switching sprite used
	var CELL_SIZE = 32;
	var GROUND_Y = CELL_SIZE * 5;
	var PEACH_WIDTH = 32;
	var PEACH_HEIGHT = 64;
	var PEACH_VELOCITY_X = 3; // The number of pixels to move every frame
	var PEACH_STOP = 0;
	var PEACH_RIGHT = 1;
	var PEACH_LEFT = -1;
	var PEACH_JUMP = 2;

	var isWorldMapReady = false;

	var worldMapDesign =
	[
	 	[],
	 	[,'j'],
	 	[,'k'],
	 	[,'k',,,,,,,,,,,'j'],
	 	[,'k',,,,,,,,,,,'k'],
	 	[,'k',,,,,,,,,,,'k'],
	 	[,'k',,,,,,,,,,,'k'],
	 	[,'k',,,'g','h','h','h','i',,,,'k'],
	 	['a', 'b', 'b', 'b', 'c',,,,'a', 'b', 'b', 'b', 'b', 'b', 'b', 'c'],
	 	['d', 'e', 'e', 'e', 'f',,,,'d', 'e', 'e', 'e', 'e', 'e', 'e', 'f'],
    ];
	
	var mapAssociation =
	{
		'a': [0, 2],
		'b': [1, 2],
		'c': [2, 2],
		'd': [0, 3],
		'e': [1, 3],
		'f': [2, 3],
		'g': [0, 6],
		'h': [1, 6],
		'i': [2, 6],
		'j': [1,4],
		'k': [1,5],
	}
	
	var WorldMap = function() {
		this.x = 0;
		
		this.tileSet = new Image();
		this.tileSet.src = 'assets/img/tileset.png';
		this.tileSet.addEventListener('load', function() {
			this.draw();
			isWorldMapReady = true;
			game.draw();
		}.bind(this));
	};
	WorldMap.prototype.draw = function() {
		console.log('draw world map');
		var tileSet = this.tileSet;
		worldMapDesign.forEach(function(lineContent, y) {
			lineContent.forEach(function(cellContent, x) {
				context.drawImage(tileSet, mapAssociation[cellContent][0] * CELL_SIZE, mapAssociation[cellContent][1] * CELL_SIZE, CELL_SIZE, CELL_SIZE, CELL_SIZE * x, CELL_SIZE * y, CELL_SIZE, CELL_SIZE);
			});
		});
		this.image = new Image();
		this.image.src = canvas.toDataURL();
	};

	
	// Inits canvas
	var canvas = document.getElementById('peach');
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	var context = canvas.getContext('2d');
	var canvasWidth = canvas.width;
	var canvasHeight = canvas.height;
	
	function Peach() {
		this.currentAnimationSprite = 0;
		this.direction = PEACH_LEFT; // Sets initial direction
		this.currentVelocityY = 0;
		
		this.currentSprite = 0;
		// Inits Peach
		this.image = new Image();
		this.image.src = 'assets/img/tileset.png';
		this.image.addEventListener('load', function() {
			game.draw();
		}.bind(this));
		// Start position
		this.x = canvasWidth / 2;
		this.y = GROUND_Y;

		this.movingSpeed = PEACH_STOP; // If Peach is moving, and its direction (-1 = left, 1 = right)
    	this.spriteDirection = PEACH_LEFT;
		this.isOnGround = true; // If peach is on the ground = not perfoming a jump, then is able to jump
		
		window.addEventListener('keydown', function(k) {
		    switch(k.keyCode) {
		        case 32: //up
		        case 38: //space
		        	this.startJump();
		            break;
		        case 37: //left
		        	this.movingSpeed = PEACH_LEFT;
		        	this.spriteDirection = PEACH_LEFT;
		            break;
		        case 39: //right
		        	this.movingSpeed = PEACH_RIGHT;
		        	this.spriteDirection = PEACH_RIGHT;
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
		        	this.movingSpeed = PEACH_STOP;
		        	this.currentSprite = 0; // Resets move animation
		        	game.draw(); // Redraw image to reset move state
		            break;
		    }
		}.bind(this));
	};
	
	Peach.prototype.startJump = function() {
		if(this.isOnGround) {
			this.currentVelocityY = -12;
			this.isOnGround = false;
		}
	};

	Peach.prototype.stopJump = function() {
	    if(this.currentVelocityY < -4)
	    	this.currentVelocityY = -4;
	};
	
	Peach.prototype.updatePosition = function() {
		var isPositionUpdated = false;
		
		if(this.movingSpeed !== PEACH_STOP) {
			isPositionUpdated = true;
			if(++this.currentAnimationSprite > MOVE_TICK_FRAME_NUMBER) {
				this.currentAnimationSprite = 0;
				this.currentSprite = ++this.currentSprite % 2;
			}
		}		
		
		if(!this.isOnGround) {
			this.currentSprite = PEACH_JUMP;
			isPositionUpdated = true;
			this.currentVelocityY += GRAVITY;
			this.y += this.currentVelocityY;
			if(this.y > GROUND_Y) {
				this.y = GROUND_Y;
				this.isOnGround = true;
				this.currentSprite = 0;
			}
		}
		return isPositionUpdated;
	}
	
	/**
	 * Constructor
	 */
	function Game() {
		this.skyElement = document.querySelector('#game-parallax-sky');
		this.backgroundElement = document.getElementById('game-parallax-background');
		
		// Sets parallax background for sky and trees
		this.currentSkyPosition = 0;
		this.currentBackgroundPosition = 0;

		var gameLoop = function () {
			window.requestAnimationFrame(gameLoop.bind(this));
			playFrameEvents();
		};
		
		var playFrameEvents = function() {
			if(peach.updatePosition()) {
				this.updateBackgroundPosition();
				this.draw();
			}
		}.bind(this);
		
		gameLoop();
		this.draw();
	};

	Game.prototype.draw = function() {
		if(!isWorldMapReady)
			return;
		
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		context.drawImage(worldMap.image, Math.floor(worldMap.x), 0);
		context.save();
		context.translate(peach.x, peach.y);
		if(peach.spriteDirection === PEACH_LEFT) {
			context.scale(-1, 1);
		}
		context.drawImage(peach.image, peach.currentSprite * PEACH_WIDTH, 0, PEACH_WIDTH, PEACH_HEIGHT, -PEACH_WIDTH / 2, 0, CELL_SIZE, CELL_SIZE * 2);
		context.restore();
	}
	
	Game.prototype.updateBackgroundPosition = function() {
		this.currentBackgroundPosition -= 0.8 * peach.movingSpeed * PEACH_VELOCITY_X;
		this.currentSkyPosition -= 0.5 * peach.movingSpeed * PEACH_VELOCITY_X;
		this.backgroundElement.style.backgroundPositionX = Math.floor(this.currentBackgroundPosition) + 'px';
		this.skyElement.style.backgroundPositionX = Math.floor(this.currentSkyPosition) + 'px';
		worldMap.x -= 1.2 * peach.movingSpeed * PEACH_VELOCITY_X;
	}

	var worldMap = new WorldMap();
	var peach = new Peach();
	var game = new Game();
	game.draw();
	
	
}(window, document));