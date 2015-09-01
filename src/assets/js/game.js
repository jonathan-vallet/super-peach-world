(function(window, document, undefined) {
	'use strict';

	var GRAVITY = 0.5; // Gravity, to make jump go back to the ground. Used for Peach and animals
	var MOVE_TICK_FRAME_NUMBER = 8; // When peach moves, she has 2 sprites to animate her. This defines the number of frame before switching sprite used
	var WORLD_TICK_FRAME_NUMBER = 7; // The number of frame before switching wrld image to animate it
	var WORLD_IMAGE_NUMBER = 4; // The number of world images to animated some elements
	var WORLD_LENGTH = 4; // The number of random block between start and end of the level
	
	var CELL_SIZE = 32; // Number of pixels of each cell/tile
	var PEACH_WIDTH = CELL_SIZE;
	var PEACH_HEIGHT = CELL_SIZE * 2;
	var PEACH_VELOCITY_X = 3; // The number of pixels to move every frame
	var PEACH_JUMP = 2;
	
	// Animal type list (specific sprites and animation)
	var ANIMAL_TYPE_GOOMBA = 1;
	var ANIMAL_TYPE_TURTLE = 2;
	
	// Movement direction
	var MOVE_LEFT = -1;
	var MOVE_STOP = 0;
	var MOVE_RIGHT = 1;
	
	// Number of cells displayed on screen
	var SCREEN_WIDTH = 20; 
	var SCREEN_HEIGHT = 12;
	
	// Animal position on tileset
	var GOOMBA_SPRITE_X = 2;
	var GOOMBA_SPRITE_Y = 12;
	var GOOMBA_VELOCITY_X = 1.5; // The number of pixels a animal moves every frame
	var GOOMBA_TICK_FRAME_NUMBER = 8; // Number of frame between each animation

	var TURTLE_SPRITE_X = 0;
	var TURTLE_SPRITE_Y = 12;
	var TURTLE_VELOCITY_X = .8; // The number of pixels a animal moves every frame
	var TURTLE_TICK_FRAME_NUMBER = 24;
	var TURTLE_IMAGE_NUMBER = 2;
	
	var CELL_PLATFORM = 1;
	var CELL_BLOCK = 2;
	var CELL_EMPTY = 3;
	var CENTER_Y_LIMIT = CELL_SIZE * 2; // The number of pixels to let's peach centered on screen and move world instead of peach

	var isWorldMapReady = false;

	// The world map. Array on tiles par cell.
	var startBlock = {
		"data":[9, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 14, 15, 0, 0, 0, 0, 41, 0, 0, 0, 0, 0, 13, 14, 14, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 10, 10, 10, 10, 11, 0, 12, 41, 0, 0, 0, 0, 0, 13, 14, 14, 14, 14, 15, 0, 16, 0, 0, 0, 0, 0, 0, 13, 14, 14, 14, 14, 15, 0, 16, 41, 0, 12, 0, 0, 0, 17, 10, 10, 10, 10, 10, 11, 16, 0, 0, 16, 0, 0, 0, 13, 14, 14, 14, 14, 14, 15, 16, 0, 0, 16, 0, 0, 0, 13, 14, 14, 14, 14, 14, 15, 16, 0, 0, 16, 0, 45, 0, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 27],
		"height":10,
		"width":14,
		"animalList": [
      	 	{x: 0, y: 5, type: ANIMAL_TYPE_TURTLE},
    	 	{x: 0, y: -1, type: ANIMAL_TYPE_GOOMBA},
    	]
	};
	var endBlock = {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 9, 10, 11, 0, 0, 0, 4, 0, 0, 0, 16, 0, 13, 14, 15, 0, 0, 0, 8, 0, 45, 0, 16, 0, 13, 14, 15, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 19, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15],
         "height":10,
         "width":12,
	};
	var blockList = 
	[
	 	{	//block-2
		    "data":[0, 0, 0, 0, 0, 0, 41, 0, 0, 41, 0, 0, 41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 41, 0, 0, 41, 0, 0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 29, 30, 30, 30, 30, 30, 30, 30, 30, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 9, 10, 11, 0, 12, 0, 0, 13, 14, 14, 14, 15, 33, 33, 33, 33, 33, 33, 33, 33, 13, 14, 15, 33, 33, 33, 33, 13, 14, 15, 0, 16, 0, 0, 13, 14, 14, 14, 15, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 37, 37, 13, 14, 15, 12, 16, 0, 0, 13, 21, 10, 10, 19, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 37, 37, 13, 21, 19, 16, 16, 0, 0, 13, 13, 14, 14, 15, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 37, 37, 13, 13, 15, 16, 16, 0, 0, 18, 13, 14, 14, 15, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 37, 37, 13, 13, 15, 10, 11, 0, 0, 22, 13, 14, 14, 15, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 37, 37, 13, 13, 15, 14, 15, 45, 0, 22, 13, 14, 14, 15, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 37, 25, 26, 26, 26, 26, 26, 27, 0],
		    "height":11,
		    "width":27,
			"animalList": [
         	 	{x: 19, y: 9, type: ANIMAL_TYPE_TURTLE},
	       	 	{x: 1, y: 5, type: ANIMAL_TYPE_GOOMBA},
	       	]
	    },
	    {
	    	//block-3
	         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 30, 30, 31, 0, 0, 0, 0, 0, 41, 0, 0, 0, 41, 0, 0, 0, 0, 0, 0, 18, 0, 0, 41, 0, 41, 0, 0, 41, 0, 41, 0, 0, 41, 0, 41, 0, 0, 0, 9, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 15, 0, 0, 0, 29, 30, 30, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 0, 0, 29, 30, 31, 0, 0, 29, 30, 31, 0, 0, 29, 30, 31, 0, 0, 0, 13, 15, 33, 33, 33, 33, 9, 11, 0, 0, 0, 29, 30, 30, 31, 0, 0, 0, 0, 22, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 13, 15, 37, 37, 37, 37, 13, 15, 33, 33, 33, 33, 9, 11, 0, 0, 0, 0, 0, 22, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 13, 15, 37, 37, 37, 37, 13, 15, 37, 37, 37, 37, 13, 15, 33, 33, 33, 33, 33, 22, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 13, 15, 37, 37, 37, 37, 13, 15, 37, 37, 37, 37, 13, 15, 37, 37, 37, 37, 37],
	         "height":10,
	         "width":38,
			 "animalList": [
         	 	{x: 9, y: 5, type: ANIMAL_TYPE_TURTLE},
	       	 	{x: 24, y: 4, type: ANIMAL_TYPE_GOOMBA},
	       	]
        },
        {	//block-4
            "data":[0, 0, 0, 0, 29, 30, 30, 30, 30, 30, 30, 30, 30, 31, 0, 0, 0, 0, 0, 0, 29, 30, 30, 31, 0, 0, 0, 0, 9, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 10, 10, 10, 10, 10, 11, 0, 0, 9, 10, 11, 0, 0, 13, 14, 14, 15, 0, 0, 0, 41, 41, 0, 0, 0, 13, 14, 14, 14, 14, 14, 14, 15, 0, 0, 13, 14, 15, 0, 0, 13, 14, 14, 15, 0, 41, 0, 0, 0, 0, 41, 0, 13, 14, 14, 14, 14, 14, 14, 15, 0, 0, 13, 14, 15, 0, 0, 13, 14, 14, 15, 33, 33, 33, 33, 33, 33, 33, 33, 13, 14, 14, 14, 14, 14, 14, 15, 33, 33, 13, 14, 15, 0, 0, 13, 14, 14, 15, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 14, 14, 14, 14, 14, 15, 37, 37, 13, 14, 15, 0, 9, 10, 10, 23, 15, 37, 37, 37, 37, 37, 37, 37, 37, 17, 10, 23, 14, 14, 21, 10, 19, 37, 37, 17, 23, 15, 0, 13, 14, 14, 15, 15, 37, 37, 37, 9, 11, 37, 37, 37, 13, 14, 15, 14, 14, 13, 14, 15, 37, 37, 13, 15, 15, 0, 13, 14, 14, 15, 15, 37, 37, 37, 13, 15, 37, 37, 37, 13, 14, 15, 14, 14, 13, 14, 15, 37, 37, 13, 15, 15, 0, 13, 14, 14, 21, 19, 37, 37, 37, 13, 15, 37, 37, 37, 13, 14, 15, 14, 14, 13, 14, 15, 37, 37, 13, 15, 15, 0, 13, 14, 14, 13, 15, 37, 37, 37, 13, 15, 37, 37, 37, 13, 14, 15, 14, 14, 13, 14, 15, 37, 37, 13, 15, 15, 0, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 27, 0],
            "height":12,
            "width":27,
			 "animalList": [
         	 	{x: 18, y: 5, type: ANIMAL_TYPE_TURTLE},
	       	 	{x: 7, y: -1, type: ANIMAL_TYPE_GOOMBA},
	       	]
        },
        {	//block-5
            "data":[0, 0, 0, 0, 29, 30, 30, 30, 30, 30, 30, 30, 30, 31, 0, 29, 30, 30, 31, 0, 29, 30, 30, 31, 0, 0, 0, 0, 9, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 9, 10, 11, 0, 0, 9, 10, 11, 0, 0, 13, 14, 14, 15, 0, 0, 0, 41, 41, 0, 0, 0, 13, 14, 15, 0, 0, 13, 14, 15, 0, 0, 13, 14, 15, 0, 0, 13, 14, 14, 15, 0, 41, 0, 0, 0, 0, 41, 0, 13, 14, 15, 0, 0, 13, 14, 15, 0, 0, 13, 14, 15, 0, 0, 13, 14, 14, 15, 33, 33, 33, 33, 33, 33, 33, 33, 13, 14, 15, 33, 33, 13, 14, 15, 33, 33, 13, 14, 15, 0, 9, 10, 23, 14, 15, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 13, 14, 15, 37, 37, 13, 14, 15, 0, 13, 14, 15, 14, 15, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 13, 14, 15, 37, 37, 13, 14, 15, 0, 13, 14, 15, 14, 15, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 13, 14, 15, 37, 37, 13, 14, 15, 0, 13, 14, 15, 14, 21, 11, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 13, 14, 15, 37, 37, 17, 23, 15, 0, 13, 14, 15, 14, 13, 15, 37, 37, 37, 37, 37, 37, 37, 17, 10, 19, 37, 37, 13, 21, 19, 37, 37, 13, 15, 15, 0, 13, 14, 15, 14, 13, 15, 37, 37, 9, 11, 37, 37, 37, 13, 14, 15, 37, 37, 13, 13, 15, 37, 37, 13, 15, 15, 0, 13, 14, 15, 14, 13, 15, 37, 37, 13, 15, 37, 37, 37, 13, 14, 15, 37, 37, 13, 13, 15, 37, 37, 13, 15, 15, 0],
            "height":12,
            "width":27,
			"animalList": [
	     	 	{x: 19, y: 8, type: ANIMAL_TYPE_TURTLE},
	       	 	{x: 7, y: -1, type: ANIMAL_TYPE_GOOMBA},
	       	]
       },
       {	//block-6
           "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 41, 0, 0, 41, 0, 0, 41, 0, 0, 41, 0, 0, 41, 0, 0, 41, 0, 0, 41, 0, 0, 41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 0, 0, 0, 0, 0, 18, 0, 0, 41, 0, 0, 18, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 9, 11, 0, 22, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 22, 0, 0, 22, 0, 0, 0, 0, 0, 18, 0, 0, 13, 15, 0, 22, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 22, 0, 0, 22, 0, 0, 18, 0, 0, 22, 0, 0, 18, 15, 0, 22, 33, 33, 18, 33, 33, 22, 33, 33, 18, 33, 33, 22, 33, 33, 22, 33, 33, 22, 33, 33, 22, 33, 33, 22, 15, 0, 22, 37, 37, 22, 37, 37, 22, 37, 37, 22, 37, 37, 22, 37, 37, 22, 37, 37, 22, 37, 37, 22, 37, 37, 22, 15, 0, 22, 37, 37, 22, 37, 37, 22, 37, 37, 22, 25, 27, 22, 37, 37, 22, 37, 37, 22, 37, 37, 22, 37, 37, 22, 15],
           "height":10,
           "width":27,
		   "animalList": [
         	 	{x: 17, y: 2, type: ANIMAL_TYPE_TURTLE},
	       	 	{x: 12, y: 8, type: ANIMAL_TYPE_GOOMBA},
	       	]
      },
      {	//block-7
          "data":[0, 9, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 14, 15, 0, 41, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 14, 15, 0, 0, 0, 16, 0, 12, 0, 0, 0, 0, 0, 9, 10, 10, 23, 15, 0, 41, 0, 16, 0, 16, 0, 41, 0, 0, 0, 13, 14, 14, 15, 15, 0, 0, 0, 16, 0, 16, 41, 0, 41, 0, 0, 13, 14, 14, 15, 15, 10, 10, 10, 10, 11, 41, 0, 0, 0, 41, 0, 13, 14, 14, 15, 15, 14, 14, 14, 14, 15, 16, 0, 41, 12, 0, 0, 13, 14, 14, 21, 10, 10, 10, 23, 14, 15, 16, 0, 0, 16, 12, 0, 13, 14, 14, 13, 14, 14, 14, 21, 10, 10, 10, 11, 41, 16, 16, 0, 13, 14, 14, 13, 14, 14, 14, 13, 14, 14, 14, 15, 0, 16, 16, 0, 13, 14, 14, 13, 14, 14, 14, 13, 14, 14, 14, 15, 0, 16, 16, 0, 13, 21, 10, 10, 23, 14, 14, 13, 14, 14, 14, 15, 10, 10, 11, 0, 13, 13, 14, 14, 15, 14, 14, 13, 14, 14, 14, 15, 14, 14, 15, 0, 13, 13, 14, 14, 15, 14, 14, 13, 14, 14, 14, 15, 14, 14, 15, 0, 13, 13, 14, 14, 15, 14, 14, 13, 21, 10, 10, 10, 23, 14, 15, 0, 13, 13, 21, 10, 10, 23, 14, 13, 13, 14, 14, 14, 15, 14, 15, 0, 13, 13, 13, 14, 14, 15, 14, 13, 13, 14, 14, 14, 15, 14, 15, 0, 13, 13, 13, 14, 14, 15, 14, 13, 13, 14, 14, 14, 15, 14, 15, 0, 13, 13, 13, 14, 14, 15, 14, 13, 13, 14, 14, 14, 15, 14, 15, 0, 13, 13, 13, 14, 14, 15, 14, 13, 13, 14, 14, 14, 15, 14, 15, 0],
          "height":20,
          "width":16,
		   "animalList": [
        	 	{x: 2, y: 14, type: ANIMAL_TYPE_TURTLE},
	       	 	{x: 1, y: -1, type: ANIMAL_TYPE_GOOMBA},
	       	]
     }
    ]

	// Specific tiles list
	var PLATFORM_TILE_LIST = [9, 10, 11, 17, 19, 21, 23];
	var BLOCK_TILE_LIST = [18, 22, 25, 26, 27, 29, 30, 31];
	var ANIMATED_TILE_LIST = [33, 37, 41, 45];

	var TILE_PER_LINE = 4; // The number of tile per line on tile image
	
	/*
	 * The world map
	 */
	var WorldMap = function() {
		// World is made of 2 images, to animate some elements (waterfalls...)
		this.currentAnimationSprite = 0; // The current frame of current image, to know when we have to change it
		this.currentDisplayedImage = 0; // The current displayed image (0 or 1)
		this.imageList = []; // The world image list
	};
	
	WorldMap.prototype.create = function() {
		this.blockList = [endBlock];
		for(var index = 0; index < WORLD_LENGTH; ++index) {
			this.blockList.push(blockList[Math.floor(Math.random() * blockList.length)])
		}
		this.blockList.push(startBlock);//, startBlock];

		this.width = 0;
		this.height = 0;
		this.cellList = [];
		this.animalList = [];

		for(var blockIndex in this.blockList) {
			this.height = Math.max(this.blockList[blockIndex].height, this.height);
		}
		for(var blockIndex in this.blockList) {
			var block = this.blockList[blockIndex];
			var blockOffsetHeight = this.height - block.height; // If the block is less high than the highest bock
			// Adds empty cells for less high blocks
			for(var cellIndex = 0; cellIndex < blockOffsetHeight * block.width; ++cellIndex) {
				if(typeof this.cellList[Math.floor(cellIndex / block.width)] === 'undefined') {
					this.cellList[Math.floor(cellIndex / block.width)] = [];
				}
				this.cellList[Math.floor(cellIndex / block.width)].push(0);
			}

			for(var cellIndex in block.data) {
				var cellLine = Math.floor(cellIndex / block.width) + blockOffsetHeight;
				if(typeof this.cellList[cellLine] === 'undefined') {
					this.cellList[cellLine] = [];
				}
				this.cellList[cellLine].push(block.data[cellIndex]);
			}
			
			for(var animalIndex in block.animalList) {
				var animal = block.animalList[animalIndex];
				this.animalList.push(new Animal(animal.x + this.width + 1, animal.y - (block.height - SCREEN_HEIGHT), animal.type));
			}

		
			this.width += block.width;
		}
		// Draws the first image
		for(var imageNumber = 0; imageNumber < WORLD_IMAGE_NUMBER; ++imageNumber) {
			// Clear canvas and draws the second image. The only difference is that we add an offset for alternative images (always just after on tile map)
			context.clearRect(0, 0, canvas.width, canvas.height);
			this.imageList.push(this.generateImage(imageNumber));
		}
		this.offsetY = (SCREEN_HEIGHT - this.height);
		isWorldMapReady = true;
	};
	WorldMap.prototype.generateImage = function(offset) {
		// Inits world images. Creates a tmp canvas to draw full world images
		var canvas = document.createElement("canvas");
		canvas.width = this.width * CELL_SIZE;
		canvas.height = this.height * CELL_SIZE;
		var context = canvas.getContext("2d");

		for(var y in this.cellList) {
			for(var x in this.cellList[y]) {
				var tile = this.cellList[y][x] - 1;
				if(tile < 0) {
					continue;
				}
				if(ANIMATED_TILE_LIST.indexOf(tile + 1) !== -1) {
					tile += offset;
				}
				var tileX = tile % TILE_PER_LINE;
				var tileY = Math.floor(tile / TILE_PER_LINE);
				context.drawImage(game.tileSet, tileX * CELL_SIZE, tileY * CELL_SIZE, CELL_SIZE, CELL_SIZE, CELL_SIZE * x, CELL_SIZE * y, CELL_SIZE, CELL_SIZE);
			}
		}
		var image = new Image();
		image.src = canvas.toDataURL();
		return image;
	};
	WorldMap.prototype.getCellState = function(x, y) {
		if(x < 0 || y - this.offsetY < 0 || y - this.offsetY >= this.height || this.cellList[y - this.offsetY].length < x) {
			return CELL_EMPTY;
		}
		var cell = this.cellList[y - this.offsetY][x];

		if(PLATFORM_TILE_LIST.indexOf(cell) !== -1) {
			return CELL_PLATFORM;
		}
		if(BLOCK_TILE_LIST.indexOf(cell) !== -1) {
			return CELL_BLOCK;
		}
		return CELL_EMPTY;
	};
	WorldMap.prototype.updatePosition = function() {
		if(!peach.hasBlockCollision) {
			this.x -= 1.2 * peach.moveDirection * PEACH_VELOCITY_X;
		}
		
		this.y = this.offsetY * CELL_SIZE + (peach.y < CENTER_Y_LIMIT ? CENTER_Y_LIMIT - peach.y : 0);
	};

	// Inits canvas
	var canvas = document.getElementById('peach');
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	var context = canvas.getContext('2d');
	var canvasWidth = canvas.width;
	var canvasHeight = canvas.height;
	
	function Animal(x, y, type) {
		this.x = x * CELL_SIZE;
		this.y = y * CELL_SIZE;
		this.type = type;
		this.isCollected = false;
		this.moveDirection = MOVE_RIGHT;
		this.currentAnimationSprite = 0; // The current frame of current image, to know when we have to change it
		this.currentDisplayedImage = 0; // The current displayed image (0 or 1)
		switch(this.type) {
		case ANIMAL_TYPE_TURTLE: 
			this.spriteX = TURTLE_SPRITE_X;
			this.spriteY = TURTLE_SPRITE_Y;
			this.speed = TURTLE_VELOCITY_X;
			this.height = 2;
			break;
		case ANIMAL_TYPE_GOOMBA:
			this.spriteX = GOOMBA_SPRITE_X;
			this.spriteY = GOOMBA_SPRITE_Y;
			this.speed = GOOMBA_VELOCITY_X;
			this.height = 1;
			break;
		}
	};
	Animal.prototype.updatePosition = function() {
		this.x += this.speed * this.moveDirection;
		// Checks collision/fall state
		if(this.moveDirection === MOVE_LEFT) {
			// Checks left cells (peach is 2 cells high) While jumping, peach can be in contact with 3 cells. (floor, floor + 1, ceil + 1). When exactly on a ceil, floor = ceil
			var leftCellState = worldMap.getCellState(Math.floor(this.x / CELL_SIZE) - 1, Math.floor(this.y / CELL_SIZE));
			var bottomLeftCellState = worldMap.getCellState(Math.floor(this.x / CELL_SIZE) - 1, Math.floor(this.y / CELL_SIZE) + 1);
			if(leftCellState === CELL_BLOCK || bottomLeftCellState === CELL_EMPTY) {
				this.setOppositeDirection();
			}
		} else {
			var rightCellState = worldMap.getCellState(Math.floor(this.x / CELL_SIZE), Math.floor(this.y / CELL_SIZE));
			var bottomRightCellState = worldMap.getCellState(Math.floor(this.x / CELL_SIZE), Math.floor(this.y / CELL_SIZE) + 1);
			if(rightCellState === CELL_BLOCK || bottomRightCellState === CELL_EMPTY) {
				this.setOppositeDirection();
			}
		}
		var distanceToPeachX = this.x + worldMap.x - peach.x;
		var distanceToPeachY = this.y + worldMap.y - peach.y - CELL_SIZE - worldMap.offsetY * CELL_SIZE;
		if(distanceToPeachX > 0 && distanceToPeachX < CELL_SIZE && distanceToPeachY >= 0 && distanceToPeachY < CELL_SIZE) {
			this.isCollected = true;
			++game.score;
		}
	};
	Animal.prototype.setOppositeDirection = function() {
		this.moveDirection = this.moveDirection === MOVE_LEFT ?  MOVE_RIGHT : MOVE_LEFT;
	}
	
	function Peach() {
		// Inits Peach
		this.isJumping = false;
		window.addEventListener('keydown', function(k) {
		    switch(k.keyCode) {
		        case 32: //up
		        case 38: //space
		        	// Player has to release and press again to make a new jump
		        	if(!this.isJumping) {
			        	this.startJump();
		        	}
		            break;
		        case 37: //left
		        	this.moveDirection = MOVE_LEFT;
		        	this.spriteDirection = MOVE_LEFT;
		            break;
		        case 39: //right
		        	this.moveDirection = MOVE_RIGHT;
		        	this.spriteDirection = MOVE_RIGHT;
		            break;
		    }
		}.bind(this));

		window.addEventListener('keyup', function(k) {
		    switch(k.keyCode) {
		        case 32: //up
		        case 38: //up
		        	this.isJumping = false;
		        	this.stopJump();
		            break;
		        case 37: //left
		        case 39: //right
		        	this.moveDirection = MOVE_STOP;
		        	this.currentSprite = 0; // Resets move animation
		            break;
		    }
		}.bind(this));
	};
	
	Peach.prototype.startJump = function() {
		if(this.isOnGround) {
			this.currentVelocityY = -12;
			this.isOnGround = false;
			this.isJumping = true;
		}
	};

	Peach.prototype.stopJump = function() {
	    if(this.currentVelocityY < -4) {
	    	this.currentVelocityY = -4;
	    }
	};

	Peach.prototype.startFall = function() {
		if(this.isOnGround) {
			this.currentVelocityY = .5;
			this.isOnGround = false;
		}
	};

	Peach.prototype.stopFall = function() {
		this.currentVelocityY = 0;
		this.isOnGround = true;
		this.y = Math.floor(this.y / CELL_SIZE) * CELL_SIZE;
	};

	Peach.prototype.updatePosition = function() {
		var hasTouchFloor = false;
		// Gets the current cell where peach is (center bottom position, at her feets). For collision detection, add/remove 0.5 * PEACH_WIDTH to get correct cell to check
		var cellX = (worldMap.x - canvas.width / 2 + PEACH_WIDTH) / CELL_SIZE;
		var cellY = Math.floor((this.y) / CELL_SIZE);	

		// Updates X position
		if(this.moveDirection !== MOVE_STOP) {
			if(++this.currentAnimationSprite > MOVE_TICK_FRAME_NUMBER) {
				this.currentAnimationSprite = 0;
				this.currentSprite = ++this.currentSprite % 2;
			}
			this.hasBlockCollision = false;
			if(this.moveDirection === MOVE_LEFT) {
				// Checks left cells (peach is 2 cells high) While jumping, peach can be in contact with 3 cells. (floor, floor + 1, ceil + 1). When exactly on a ceil, floor = ceil
				var topLeftCellState = worldMap.getCellState(- Math.floor(cellX + .5 * PEACH_WIDTH / CELL_SIZE), cellY);
				var leftCellState = worldMap.getCellState(- Math.floor(cellX  + .5 * PEACH_WIDTH / CELL_SIZE), cellY + 1);
				var bottomLeftCellState = worldMap.getCellState(- Math.floor(cellX  + .5 * PEACH_WIDTH / CELL_SIZE), Math.ceil((this.y) / CELL_SIZE) + 1);
				if(topLeftCellState === CELL_BLOCK || leftCellState === CELL_BLOCK || bottomLeftCellState === CELL_BLOCK) {
					this.hasBlockCollision = true;
				}
			} else {
				// Checks right cells (peach is 2 cells high, we have to check 3 cells)
				var topRightCellState = worldMap.getCellState(- Math.floor(cellX - .5 * PEACH_WIDTH / CELL_SIZE), cellY);
				var rightCellState = worldMap.getCellState(- Math.floor(cellX - .5 * PEACH_WIDTH / CELL_SIZE), cellY + 1);
				var bottomRightCellState = worldMap.getCellState(- Math.floor(cellX - .5 * PEACH_WIDTH / CELL_SIZE), Math.ceil((this.y) / CELL_SIZE) + 1);
				if(topRightCellState === CELL_BLOCK || rightCellState === CELL_BLOCK || bottomRightCellState === CELL_BLOCK) {
					this.hasBlockCollision = true;
				}
			}
		}

		// Updates Y position
		if(!this.isOnGround) {
			this.currentSprite = PEACH_JUMP;
			this.currentVelocityY = Math.min(this.currentVelocityY + GRAVITY, 11);
			this.y += this.currentVelocityY;
		}
		// At the bottom of the game = death, resets game
		if(this.y > SCREEN_HEIGHT * CELL_SIZE) {
			game.reset();
			return;
		}

		// Checks Y collision/platform
		// TODO fix bug with modulo when y < 0
		if(this.currentVelocityY > 0 || (this.currentVelocityY === 0 && this.moveDirection !== MOVE_STOP)) { // If is not jumping top, checks the cell below
			var bottomCellState = worldMap.getCellState(- Math.floor(cellX), Math.floor((this.y + PEACH_HEIGHT) / CELL_SIZE));
			if(bottomCellState === CELL_PLATFORM || bottomCellState === CELL_BLOCK) {
				if(this.currentVelocityY > 0 && this.y % CELL_SIZE <= 12) {
					this.stopFall();
					this.currentSprite = 0;
					hasTouchFloor = true;
				}
			}
			else {
				this.startFall();
			}
		} else if(this.currentVelocity < 0 ){
			// If is jumping top, checks if there is a block above. Checks a little before and after peach center (20%)
			var topLeftCellState = worldMap.getCellState(- Math.floor(cellX + .2 * PEACH_WIDTH / CELL_SIZE), cellY);
			var topRightCellState = worldMap.getCellState(- Math.floor(cellX - .2 * PEACH_WIDTH / CELL_SIZE), cellY);
			if(topLeftCellState === CELL_BLOCK || topRightCellState === CELL_BLOCK) {
				this.currentVelocityY = 0; // Stops jump at this height
			}
		}
	}
	
	/**
	 * Constructor
	 */
	function Game() {
		this.backgroundElement = document.getElementById('bg');
	};

	Game.prototype.draw = function() {
		if(!isWorldMapReady)
			return;

		context.clearRect(0, 0, canvasWidth, canvasHeight);
		// Draws world
		if(++worldMap.currentAnimationSprite > WORLD_TICK_FRAME_NUMBER) {
			worldMap.currentAnimationSprite = 0;
			worldMap.currentDisplayedImage = ++worldMap.currentDisplayedImage % WORLD_IMAGE_NUMBER;
		}
		var worldImage = worldMap.imageList[worldMap.currentDisplayedImage];
		context.drawImage(worldImage, Math.floor(worldMap.x), worldMap.y);

		// Draws animals
		for(var animalIndex in worldMap.animalList) {
			var animal = worldMap.animalList[animalIndex];
			if(animal.isCollected) {
				continue;
			}
			context.save();
			switch(animal.type) {
			case ANIMAL_TYPE_TURTLE: 
				if(++animal.currentAnimationSprite > TURTLE_TICK_FRAME_NUMBER) {
					animal.currentAnimationSprite = 0;
					animal.currentDisplayedImage = ++animal.currentDisplayedImage % TURTLE_IMAGE_NUMBER;
				}
				if(animal.moveDirection === MOVE_RIGHT) {
					context.translate(Math.floor(worldMap.x) + animal.x,  worldMap.y + animal.y - CELL_SIZE);
					context.scale(-1, 1);
				} else {
					context.translate(Math.floor(worldMap.x) + animal.x - CELL_SIZE,  worldMap.y + animal.y - CELL_SIZE);
				}
				break;
			case ANIMAL_TYPE_GOOMBA:
				if(worldMap.currentDisplayedImage % 2 === 0) {
					context.translate(Math.floor(worldMap.x) + animal.x,  worldMap.y + animal.y);
					context.scale(-1, 1);
				} else {
					context.translate(Math.floor(worldMap.x) + animal.x - CELL_SIZE,  worldMap.y + animal.y);
				}
				break;
			}
			context.translate(0, - worldMap.offsetY * CELL_SIZE);
			context.drawImage(game.tileSet, (animal.spriteX + animal.currentDisplayedImage) * CELL_SIZE, animal.spriteY * CELL_SIZE, CELL_SIZE, CELL_SIZE * animal.height, 0, 0, CELL_SIZE, CELL_SIZE * animal.height);
			context.restore();
		}
		
		// Draws peach
		context.save();
		context.translate(peach.x, Math.max(CENTER_Y_LIMIT, peach.y));
		if(peach.spriteDirection === MOVE_LEFT) {
			context.scale(-1, 1);
		}
		context.drawImage(game.tileSet, peach.currentSprite * PEACH_WIDTH, 0, PEACH_WIDTH, PEACH_HEIGHT, -PEACH_WIDTH / 2, 0, PEACH_WIDTH, PEACH_HEIGHT);
		context.restore();
		/*
		context.beginPath();
		context.rect(0, 0, canvasWidth, canvasHeight);
		context.fillStyle = 'rgba(0, 0, 0, 0.5)';
		context.fill();

		context.beginPath();
		var scoreText = textManager.text({ctx: context, x: canvasWidth / 2, y: 50, text: "PEACH IS BORED AND DECIDES TO FIND MARIO\n\nAS HER DRESS HAS NO POCKET\nSHE CANNOT COLLECT COINS,\n\nBUT AS A PRINCESS\nSHE CAN COLLECT THE ANIMALS SHE MEETS.", valign: 'top', halign: 'center', scale: 2, render: 1, vspacing: 10, hspacing: 2, snap: 0});
		context.fillStyle = 'hsla(0, 100%, 100%, 1)';
		context.fill();*/

		context.beginPath();
		var scoreText = textManager.text({ctx: context, x: 10, y: 10, text: "SCORE: " + this.score, valign: 'top', halign: 'left', scale: 2, render: 1, vspacing: 10, hspacing: 2, snap: 0});
		context.fillStyle = 'hsla(0, 100%, 100%, 1)';
		context.fill();
	}
	
	Game.prototype.updateBackgroundPosition = function() {
		this.backgroundElement.style.backgroundPositionX = Math.floor(0.5 * worldMap.x) + 'px';
		this.backgroundElement.style.backgroundPositionY = Math.floor(0.3 * worldMap.y ) + 'px';
		document.getElementById('game').style.backgroundPositionY = Math.floor(0.05 * worldMap.y ) + 'px';
	}
	
	Game.prototype.reset = function() {
		// Initial position, far on right (peach starts on right side on go back to left, from negative x value to 0
		worldMap.x = - (worldMap.width - SCREEN_WIDTH) * CELL_SIZE;

		// Inits peach
		peach.currentAnimationSprite = 0;
		peach.currentSprite = 0;
		// Start position
		peach.x = CELL_SIZE * SCREEN_WIDTH / 2;
		peach.y = CELL_SIZE * (SCREEN_HEIGHT - 5);
		peach.currentVelocityY = 0;
		peach.moveDirection = MOVE_STOP; // If Peach is moving, and its direction (-1 = left, 0 = stop, 1 = right)
		peach.spriteDirection = MOVE_LEFT; // when movement is stopped, keeps the curret sprite direction
		peach.hasBlockCollision = false;

		this.score = 0;
	}

	Game.prototype.start = function() {
		// Loads assets
		this.tileSet = new Image();
		this.tileSet.src = 'assets/img/tileset.png';
		this.tileSet.addEventListener('load', function() {
			worldMap.create();
			this.reset();
			this.loop();
		}.bind(this));
	}
	Game.prototype.loop = function() {
		window.requestAnimationFrame(this.loop.bind(this));
		peach.updatePosition();
		worldMap.updatePosition();
		for(var index in worldMap.animalList) {
			if(!worldMap.animalList[index].isCollected) {
				worldMap.animalList[index].updatePosition();
			}
		}
		this.updateBackgroundPosition();
		this.draw();
	}

	var worldMap = new WorldMap();
	var peach = new Peach();
	var game = new Game();
	game.start();
	
	var textManager = {};
	textManager.definitions = {};
	textManager.textLine = function( opt ) {
		var textLength = opt.text.length,
			letterHeight = 5;
		var letterX = 0;
		for( var i = 0; i < textLength; ++i ) {
			var letter = textManager.definitions.letters[ ( opt.text.charAt( i ) ) ] || textManager.definitions.letters[ 'unknown' ];
			for( var y = 0; y < letterHeight; ++y ) {
				for( var x = 0; x < letterHeight; ++x ) {
					if( letter[ y ][ x ] === 1 ) {
						opt.ctx.rect( opt.x + ( x * opt.scale ) + ( ( letterX * opt.scale ) + opt.hspacing * i ), opt.y + y * opt.scale, opt.scale, opt.scale );
					}
				}
			}
			letterX += letter[0].length;
		}
	};

	textManager.text = function( opt ) {
		var size = 5,
			letterSize = size * opt.scale,
			lines = opt.text.split('\n'),
			linesCopy = lines.slice( 0 ),
			lineCount = lines.length,
			longestLine = linesCopy.sort( function ( a, b ) { return b.length - a.length; } )[ 0 ],
			textWidth = ( longestLine.length * letterSize ) + ( ( longestLine.length - 1 ) * opt.hspacing ),
			textHeight = ( lineCount * letterSize ) + ( ( lineCount - 1 ) * opt.vspacing );

		var sx = opt.x,
			sy = opt.y,
			ex = opt.x + textWidth,
			ey = opt.y + textHeight;

		if( opt.halign == 'center' ) {
			sx = opt.x - textWidth / 2;
			ex = opt.x + textWidth / 2;
		} else if( opt.halign == 'right' ) {
			sx = opt.x - textWidth;
			ex = opt.x;
		}

		if( opt.valign == 'center' ) {
			sy = opt.y - textHeight / 2;
			ey = opt.y + textHeight / 2;
		} else if( opt.valign == 'bottom' ) {
			sy = opt.y - textHeight;
			ey = opt.y;
		}

		var	cx = sx + textWidth / 2,
			cy = sy + textHeight / 2;

		if( opt.render ) {
			for( var i = 0; i < lineCount; ++i ) {
				var line = lines[ i ],			
					lineWidth = (line.length - 1) * opt.hspacing,
					x = opt.x,
					y = opt.y + ( letterSize + opt.vspacing ) * i;
				
				for( var letterNumber = 0; letterNumber < line.length; ++letterNumber ) {
					var letter = textManager.definitions.letters[ ( line.charAt( letterNumber ) ) ] || textManager.definitions.letters[ 'unknown' ];
					lineWidth += letter[0].length * opt.scale;
				}

				if( opt.halign == 'center' ) {
					x = opt.x - lineWidth / 2;
				} else if( opt.halign == 'right' ) {
					x = opt.x - lineWidth;
				}

				if( opt.valign == 'center' ) {
					y = y - textHeight / 2;
				} else if( opt.valign == 'bottom' ) {
					y = y - textHeight;
				}

				if( opt.snap ) {
					x = Math.floor( x );
					y = Math.floor( y );
				}

				textManager.textLine( {
					ctx: opt.ctx,
					x: x,
					y: y,
					text: line,
					hspacing: opt.hspacing,
					scale: opt.scale
				} );
			}
		}

		return {
			sx: sx,
			sy: sy,
			cx: cx,
			cy: cy,
			ex: ex,
			ey: ey,
			width: textWidth,
			height: textHeight
		}
	};

	textManager.definitions.letters = {
		'1': [
			 [ ,  1, 0 ],
			 [ 1, 1, 0 ],
			 [  , 1, 0 ],
			 [  , 1, 0 ],
			 [ 1, 1, 1 ]
			 ],
		'2': [
			 [  , 1, 1, 0 ],
			 [ 1,  ,  , 1 ],
			 [  ,  , 1, 0 ],
			 [  , 1,  , 0 ],
			 [ 1, 1, 1, 1 ]
			 ],
		'3': [
			 [ 1, 1, 1, 0 ],
			 [  ,  ,  , 1 ],
			 [  , 1, 1, 0 ],
			 [  ,  ,  , 1 ],
			 [ 1, 1, 1, 0 ]
			 ],
		'4': [
			 [  ,  , 1, 1 ],
			 [  , 1,  , 1 ],
			 [ 1,  ,  , 1 ],
			 [ 1, 1, 1, 1 ],
			 [  ,  ,  , 1 ]
			 ],
		'5': [
			 [ 1, 1, 1, 1 ],
			 [ 1,  ,  , 0 ],
			 [ 1, 1, 1, 1 ],
			 [  ,  ,  , 1 ],
			 [ 1, 1, 1, 0 ]
			 ],
		'6': [
			 [  , 1, 1, 0 ],
			 [ 1,  ,  , 0 ],
			 [ 1, 1, 1, 0 ],
			 [ 1,  ,  , 1 ],
			 [  , 1, 1, 0 ]
			 ],
		'7': [
			 [ 1, 1, 1, 1 ],
			 [  ,  ,  , 1 ],
			 [  ,  , 1, 0 ],
			 [  ,  , 1, 0 ],
			 [  ,  , 1, 0 ]
			 ],
		'8': [
			 [  , 1, 1, 0 ],
			 [ 1,  ,  , 1 ],
			 [  , 1, 1, 0 ],
			 [ 1,  ,  , 1 ],
			 [  , 1, 1, 0 ]
			 ],
		'9': [
			 [  , 1, 1, 0 ],
			 [ 1,  ,  , 1 ],
			 [  , 1, 1, 1 ],
			 [  ,  ,  , 1 ],
			 [  , 1, 1, 0 ]
			 ],
		'0': [
			 [  , 1, 1, 0 ],
			 [ 1,  ,  , 1 ],
			 [ 1,  ,  , 1 ],
			 [ 1,  ,  , 1 ],
			 [  , 1, 1, 0 ]
			 ],
		'A': [
			 [  , 1, 0 ],
			 [ 1,  , 1 ],
			 [ 1, 1, 1 ],
			 [ 1,  , 1 ],
			 [ 1,  , 1 ]
			 ],
		'B': [
			 [ 1, 1, 0 ],
			 [ 1,  , 1 ],
			 [ 1, 1, 0 ],
			 [ 1,  , 1 ],
			 [ 1, 1, 0 ]
			 ],
		'C': [
			 [  , 1, 1 ],
			 [ 1,  , 0 ],
			 [ 1,  , 0 ],
			 [ 1,  , 0 ],
			 [  , 1, 1 ]
			 ],
		'D': [
			 [ 1, 1, 0 ],
			 [ 1,  , 1 ],
			 [ 1,  , 1 ],
			 [ 1,  , 1 ],
			 [ 1, 1, 0 ]
			 ],
		'E': [
			 [ 1, 1, 1 ],
			 [ 1,  , 0 ],
			 [ 1, 1, 1 ],
			 [ 1,  , 0 ],
			 [ 1, 1, 1 ]
			 ],
		'F': [
			 [ 1, 1, 1 ],
			 [ 1,  , 0 ],
			 [ 1, 1, 1 ],
			 [ 1,  , 0 ],
			 [ 1,  , 0 ]
			 ],
		'G': [
			 [  , 1, 1, 1 ],
			 [ 1,  ,  , 0 ],
			 [ 1,  , 1, 1 ],
			 [ 1,  ,  , 1 ],
			 [  , 1, 1, 0 ]
			 ],
		'H': [
			 [ 1,  ,  , 1 ],
			 [ 1,  ,  , 1 ],
			 [ 1, 1, 1, 1 ],
			 [ 1,  ,  , 1 ],
			 [ 1,  ,  , 1 ]
			 ],
		'I': [
			 [ 1, 1, 1 ],
			 [  , 1, 0 ],
			 [  , 1, 0 ],
			 [  , 1, 0 ],
			 [ 1, 1, 1 ]
			 ],
		'J': [
			 [  ,  ,  , 1 ],
			 [  ,  ,  , 1 ],
			 [  ,  ,  , 1 ],
			 [ 1,  ,  , 1 ],
			 [  , 1, 1, 0 ]
			 ],
		'K': [
			 [ 1,  ,  , 1 ],
			 [ 1,  , 1, 0 ],
			 [ 1, 1,  , 0 ],
			 [ 1,  , 1, 0 ],
			 [ 1,  ,  , 1 ]
			 ],
		'L': [
			 [ 1,  , 0 ],
			 [ 1,  , 0 ],
			 [ 1,  , 0 ],
			 [ 1,  , 0 ],
			 [ 1, 1, 1 ]
			 ],
		'M': [
			 [ 1,  ,  ,  , 1 ],
			 [ 1, 1,  , 1, 1 ],
			 [ 1,  , 1,  , 1 ],
			 [ 1,  ,  ,  , 1 ],
			 [ 1,  ,  ,  , 1 ]
			 ],
		'N': [
			 [ 1,  ,  , 1 ],
			 [ 1, 1,  , 1 ],
			 [ 1,  , 1, 1 ],
			 [ 1,  ,  , 1 ],
			 [ 1,  ,  , 1 ]
			 ],  
		'O': [
			 [  , 1, 1, 0 ],
			 [ 1,  ,  , 1 ],
			 [ 1,  ,  , 1 ],
			 [ 1,  ,  , 1 ],
			 [  , 1, 1, 0 ]
			 ],
		'P': [
			 [ 1, 1, 1, 0 ],
			 [ 1,  ,  , 1 ],
			 [ 1, 1, 1, 0 ],
			 [ 1,  ,  , 0 ],
			 [ 1,  ,  , 0 ]
			 ],
		'Q': [
			 [  , 1, 1, 0 ],
			 [ 1,  ,  , 1,],
			 [ 1,  ,  , 1 ],
			 [ 1,  , 1, 0 ],
			 [  , 1,  , 1 ]
			 ],
		'R': [
			 [ 1, 1, 1, 0 ],
			 [ 1,  ,  , 1 ],
			 [ 1, 1, 1, 0 ],
			 [ 1,  , 1, 0 ],
			 [ 1,  ,  , 1 ]
			 ],
		'S': [
			 [  , 1, 1, 1 ],
			 [ 1,  ,  , 0 ],
			 [  , 1, 1, 0 ],
			 [  ,  ,  , 1 ],
			 [ 1, 1, 1, 0 ]
			 ],
		'T': [
			 [ 1, 1, 1 ],
			 [  , 1, 0 ],
			 [  , 1, 0 ],
			 [  , 1, 0 ],
			 [  , 1, 0 ]
			 ],
		'U': [
			 [ 1,  , 1 ],
			 [ 1,  , 1 ],
			 [ 1,  , 1 ],
			 [ 1,  , 1 ],
			 [  , 1, 0 ]
			 ],
		'V': [
			 [ 1,  ,  ,  , 1 ],
			 [ 1,  ,  ,  , 1 ],
			 [  , 1,  , 1, 0 ],
			 [  , 1,  , 1, 0 ],
			 [  ,  , 1,  , 0 ]
			 ],
		'W': [
			 [ 1,  , 1,  , 1 ],
			 [ 1,  , 1,  , 1 ],
			 [ 1,  , 1,  , 1 ],
			 [  , 1,  , 1, 0 ],
			 [  , 1,  , 1, 0 ]
			 ],
		'X': [
			 [ 1,  ,  , 1 ],
			 [ 1,  ,  , 1 ],
			 [  , 1, 1, 0 ],
			 [ 1,  ,  , 1 ],
			 [ 1,  ,  , 1 ]
			 ],
		'Y': [
			 [ 1,  ,  , 1 ],
			 [ 1,  ,  , 1 ],
			 [ 1, 1, 1, 1 ],
			 [  ,  , ,  1 ],
			 [ 1, 1, 1, 0 ]
			 ],
		'Z': [
			 [ 1, 1, 1, 1 ],
			 [  ,  ,  , 1 ],
			 [  , 1, 1, 0 ],
			 [ 1,  ,  , 0 ],
			 [ 1, 1, 1, 1 ]
			 ],   
		' ': [
			 [  ,  , 0 ],
			 [  ,  , 0 ],
			 [  ,  , 0 ],
			 [  ,  , 0 ],
			 [  ,  , 0 ]
			 ],
		',': [
			 [   ,  , 0 ],
			 [   ,  , 0 ],
			 [   ,  , 0 ],
			 [  1,  , 0 ],
			 [  1,  , 0 ]
			 ],
		'.': [
			 [   ,  , 0 ],
			 [   ,  , 0 ],
			 [   ,  , 0 ],
			 [   ,  , 0 ],
			 [  1,  , 0 ]
			 ],
		 '+': [
			 [  ,  ,  ,  , 0 ],
			 [  ,  , 1,  , 0 ],
			 [  , 1, 1, 1, 0 ],
			 [  ,  , 1,  , 0 ],
			 [  ,  ,  ,  , 0 ]
			 ],
		'/': [
			 [  ,  ,  ,  , 1 ],
			 [  ,  ,  , 1, 0 ],
			 [  ,  , 1,  , 0 ],
			 [  , 1,  ,  , 0 ],
			 [ 1,  ,  ,  , 0 ]
			 ],
		':': [
			 [  ,  , 0 ],
			 [  , 1, 0 ],
			 [  ,  , 0 ],
			 [  , 1, 0 ],
			 [  ,  , 0 ]
			 ],
		'@': [
			 [  1, 1, 1, 1, 1 ],
			 [   ,  ,  ,  , 1 ],
			 [  1, 1, 1,  , 1 ],
			 [  1,  , 1,  , 1 ],
			 [  1, 1, 1, 1, 1 ]
			 ]
	};
	
}(window, document));