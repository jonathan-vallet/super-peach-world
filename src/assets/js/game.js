(function(window, document, undefined) {
	'use strict';

	var GRAVITY = 0.5; // Gravity, to make jump go back to the ground. Used for Peach and animals
	var MOVE_TICK_FRAME_NUMBER = 8; // When peach moves, she has 2 sprites to animate her. This defines the number of frame before switching sprite used
	var WORLD_TICK_FRAME_NUMBER = 7; // The number of frame before switching wrld image to animate it
	var WORLD_IMAGE_NUMBER = 4; // The number of world images to animated some elements
	var WORLD_LENGTH = 4; // The number of random block between start and end of the level
	
	var START_TEXT_TICK_FRAME_NUMBER = 15; // The number of frame before switching wrld image to animate it
	
	var CELL_SIZE = 32; // Number of pixels of each cell
	var TILE_SIZE = 16; // Number of pixels of each tile
	var PEACH_WIDTH = CELL_SIZE;
	var PEACH_HEIGHT = CELL_SIZE * 2;
	var PEACH_VELOCITY_X = 3; // The number of pixels to move every frame
	var PEACH_JUMP = 2;
	var JUMP_IMPULSE = 12;
	// Animal type list (specific sprites and animation)
	var ANIMAL_TYPE_GOOMBA = 1;
	var ANIMAL_TYPE_TURTLE = 2;
	var ANIMAL_TYPE_MARIO= 3;
	
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

	var MARIO_SPRITE_X = 3;
	var MARIO_SPRITE_Y = 0;
	var MARIO_VELOCITY_X = 0; // The number of pixels a animal moves every frame
	var MARIO_TICK_FRAME_NUMBER = 24;
	
	var CELL_PLATFORM = 1;
	var CELL_BLOCK = 2;
	var CELL_EMPTY = 3;
	var CENTER_Y_LIMIT = CELL_SIZE * 2; // The number of pixels to let's peach centered on screen and move world instead of peach

	var isWorldMapReady = false;

	// The world map. Array on tiles par cell.
	var startBlock = {
		"data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 14, 15, 0, 0, 0, 0, 41, 0, 0, 0, 0, 0, 13, 14, 14, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 10, 10, 10, 10, 11, 0, 12, 41, 0, 0, 0, 0, 0, 13, 14, 14, 14, 14, 15, 0, 16, 0, 0, 0, 0, 0, 0, 13, 14, 14, 14, 14, 15, 0, 16, 41, 0, 12, 0, 0, 0, 17, 10, 10, 10, 10, 10, 11, 16, 0, 0, 16, 0, 0, 0, 13, 14, 14, 14, 14, 14, 15, 16, 0, 0, 16, 0, 0, 0, 13, 14, 14, 14, 14, 14, 15, 16, 0, 0, 16, 0, 0, 0, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 27],
		"height":11,
		"width":14,
		"animalList": [
      	 	{x: 0, y: 6, type: ANIMAL_TYPE_TURTLE},
    	 	{x: 0, y: 0, type: ANIMAL_TYPE_GOOMBA},
    	]
	};
	var endBlock = {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 16, 0, 13, 14, 15, 0, 0, 0, 0, 0, 45, 0, 16, 0, 13, 14, 15, 9, 10, 10, 20, 10, 10, 10, 10, 10, 10, 10, 19, 13, 14, 14, 24, 14, 14, 14, 14, 14, 14, 14, 15, 13, 14, 14, 24, 14, 14, 14, 14, 14, 14, 14, 15, 13, 14, 14, 24, 14, 14, 14, 14, 14, 14, 14, 15],
         "height":10,
         "width":12,
 		 "animalList": [
       	 	{x: 3, y: 4, type: ANIMAL_TYPE_MARIO},
     	 ]
	};
	var blockList = 
	[
	 	{	//block-2
		    "data":[0, 0, 0, 0, 0, 0, 41, 0, 0, 41, 0, 0, 41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 41, 0, 0, 41, 0, 0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 29, 30, 30, 30, 30, 30, 30, 30, 30, 31, 0, 0, 0, 0, 0, 0, 0, 45, 45, 0, 0, 0, 0, 9, 10, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 9, 10, 11, 0, 12, 0, 0, 13, 14, 14, 14, 15, 33, 33, 33, 33, 33, 33, 33, 33, 13, 14, 15, 33, 33, 33, 33, 13, 14, 15, 0, 16, 0, 0, 13, 14, 14, 14, 15, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 37, 37, 13, 14, 15, 12, 16, 0, 0, 13, 21, 10, 10, 19, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 37, 37, 13, 21, 19, 16, 16, 0, 0, 13, 13, 14, 14, 15, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 37, 37, 13, 13, 15, 16, 16, 0, 0, 18, 13, 14, 14, 15, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 37, 37, 13, 13, 15, 10, 11, 0, 0, 22, 13, 14, 14, 15, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 37, 37, 13, 13, 15, 14, 15, 45, 0, 22, 13, 14, 14, 15, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 37, 25, 26, 26, 26, 26, 26, 27, 0],
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
            "data":[0, 0, 0, 0, 29, 30, 30, 30, 30, 30, 30, 30, 30, 31, 0, 0, 0, 0, 0, 0, 29, 30, 30, 31, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 10, 10, 10, 10, 10, 11, 0, 0, 9, 10, 11, 0, 0, 0, 13, 14, 15, 0, 0, 0, 41, 41, 0, 0, 0, 13, 14, 14, 14, 14, 14, 14, 15, 0, 0, 13, 14, 15, 0, 0, 0, 13, 14, 15, 0, 41, 0, 0, 0, 0, 41, 0, 13, 14, 14, 14, 14, 14, 14, 15, 0, 0, 13, 14, 15, 0, 0, 9, 23, 14, 15, 33, 33, 33, 33, 33, 33, 33, 33, 13, 14, 14, 14, 14, 14, 14, 15, 33, 33, 13, 14, 15, 0, 0, 13, 15, 14, 15, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 14, 14, 14, 14, 14, 15, 37, 37, 13, 14, 15, 0, 0, 13, 15, 14, 15, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 14, 14, 14, 14, 14, 15, 37, 37, 13, 14, 15, 0, 9, 10, 10, 23, 15, 37, 37, 37, 37, 37, 37, 37, 37, 17, 10, 23, 14, 14, 21, 10, 19, 37, 37, 17, 23, 15, 0, 13, 14, 14, 15, 15, 37, 37, 37, 9, 11, 37, 37, 37, 13, 14, 15, 14, 14, 13, 14, 15, 37, 37, 13, 15, 15, 0, 13, 14, 14, 15, 15, 37, 37, 37, 13, 15, 37, 37, 37, 13, 14, 15, 14, 14, 13, 14, 15, 37, 37, 13, 15, 15, 0, 13, 14, 14, 21, 19, 37, 37, 37, 13, 15, 37, 37, 37, 13, 14, 15, 14, 14, 13, 14, 15, 37, 37, 13, 15, 15, 0, 13, 14, 14, 13, 15, 37, 37, 37, 13, 15, 37, 37, 37, 13, 14, 15, 14, 14, 13, 14, 15, 37, 37, 13, 15, 15, 0, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 27, 15, 0],
            "height":13,
            "width":27,
			 "animalList": [
         	 	{x: 18, y: 6, type: ANIMAL_TYPE_TURTLE},
	       	 	{x: 7, y: -1, type: ANIMAL_TYPE_GOOMBA},
	       	]
        },
        {	//block-5
            "data":[0, 0, 0, 0, 29, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 31, 0, 0, 0, 0, 9, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 9, 10, 11, 0, 0, 9, 10, 11, 0, 0, 13, 14, 14, 15, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 15, 0, 0, 13, 14, 15, 0, 0, 13, 14, 15, 0, 0, 13, 14, 14, 15, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 15, 0, 0, 13, 14, 15, 0, 0, 13, 14, 15, 0, 0, 13, 14, 14, 15, 33, 33, 33, 33, 33, 33, 33, 33, 13, 14, 15, 33, 33, 13, 14, 15, 33, 33, 13, 14, 15, 0, 9, 10, 23, 14, 15, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 13, 14, 15, 37, 37, 13, 14, 15, 0, 13, 14, 15, 14, 15, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 13, 14, 15, 37, 37, 13, 14, 15, 0, 13, 14, 15, 14, 15, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 13, 14, 15, 37, 37, 13, 14, 15, 0, 13, 14, 15, 14, 21, 11, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 37, 37, 13, 14, 15, 37, 37, 17, 23, 15, 0, 13, 14, 15, 14, 13, 15, 37, 37, 37, 37, 37, 37, 37, 17, 10, 19, 37, 37, 13, 21, 19, 37, 37, 13, 15, 15, 0, 13, 14, 15, 14, 13, 15, 37, 37, 9, 11, 37, 37, 37, 13, 14, 15, 37, 37, 13, 13, 15, 37, 37, 13, 15, 15, 0, 13, 14, 15, 14, 13, 15, 37, 37, 13, 15, 37, 37, 37, 13, 14, 15, 37, 37, 13, 13, 15, 37, 37, 13, 15, 15, 0], 
            "height":12,
            "width":27,
			"animalList": [
	     	 	{x: 19, y: 8, type: ANIMAL_TYPE_TURTLE},
	       	 	{x: 7, y: -1, type: ANIMAL_TYPE_GOOMBA},
	       	]
       },
       {	//block-6
           "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 41, 0, 0, 41, 0, 0, 41, 0, 0, 41, 0, 0, 41, 0, 0, 41, 0, 0, 41, 0, 0, 41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 0, 0, 0, 0, 0, 18, 0, 0, 0, 0, 0, 18, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 9, 11, 0, 22, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 22, 0, 0, 22, 0, 0, 0, 0, 0, 18, 0, 0, 13, 15, 0, 22, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 22, 0, 0, 22, 0, 0, 18, 0, 0, 22, 0, 0, 18, 15, 0, 22, 33, 33, 18, 33, 33, 22, 33, 33, 18, 33, 33, 22, 33, 33, 22, 33, 33, 22, 33, 33, 22, 33, 33, 22, 15, 0, 22, 37, 37, 22, 37, 37, 22, 37, 37, 22, 37, 37, 22, 37, 37, 22, 37, 37, 22, 37, 37, 22, 37, 37, 22, 15, 0, 22, 25, 27, 22, 37, 37, 22, 37, 37, 22, 25, 27, 22, 37, 37, 22, 37, 37, 22, 37, 37, 22, 37, 37, 22, 15, 0],
           "height":10,
           "width":27,
		   "animalList": [
         	 	{x: 1, y: 8, type: ANIMAL_TYPE_TURTLE},
	       	 	{x: 11, y: 8, type: ANIMAL_TYPE_GOOMBA},
	       	]
      },
      {	//block-7
          "data":[0, 9, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 14, 15, 0, 41, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 14, 15, 0, 0, 0, 16, 0, 12, 0, 0, 0, 0, 0, 9, 10, 10, 23, 15, 0, 41, 0, 16, 0, 16, 0, 41, 0, 0, 0, 13, 14, 14, 15, 15, 0, 0, 0, 16, 0, 16, 41, 0, 41, 0, 0, 13, 14, 14, 15, 15, 9, 10, 10, 10, 11, 41, 0, 0, 0, 41, 0, 13, 14, 14, 15, 15, 13, 14, 14, 14, 15, 16, 0, 41, 12, 0, 0, 13, 14, 14, 21, 10, 10, 10, 23, 14, 15, 16, 0, 0, 16, 12, 0, 13, 14, 14, 13, 14, 14, 14, 21, 10, 10, 10, 11, 41, 16, 16, 0, 13, 14, 14, 13, 14, 14, 14, 13, 14, 14, 14, 15, 0, 16, 16, 0, 13, 14, 14, 13, 14, 14, 14, 13, 14, 14, 14, 15, 0, 16, 16, 0, 13, 21, 10, 10, 23, 14, 14, 13, 14, 14, 14, 15, 9, 10, 11, 0, 13, 13, 14, 14, 15, 14, 14, 13, 14, 14, 14, 15, 13, 14, 15, 0, 13, 13, 14, 14, 15, 14, 14, 13, 14, 14, 14, 15, 13, 14, 15, 0, 13, 13, 14, 14, 15, 14, 14, 13, 21, 10, 10, 10, 23, 14, 15, 0, 13, 13, 21, 10, 10, 23, 14, 13, 13, 14, 14, 14, 15, 14, 15, 0, 13, 13, 13, 14, 14, 15, 14, 13, 13, 14, 14, 14, 15, 14, 15, 0, 13, 13, 13, 14, 14, 15, 14, 13, 13, 14, 14, 14, 15, 14, 15, 0, 13, 13, 13, 14, 14, 15, 14, 13, 13, 14, 14, 14, 15, 14, 15, 0, 13, 13, 13, 14, 14, 15, 14, 13, 13, 14, 14, 14, 15, 14, 15, 0],
          "height":20,
          "width":16,
		   "animalList": [
        	 	{x: 2, y: 14, type: ANIMAL_TYPE_TURTLE},
	       	 	{x: 1, y: -1, type: ANIMAL_TYPE_GOOMBA},
	       	]
     },
     {	//block-8
         "data":[0, 0, 0, 0, 0, 9, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 13, 33, 33, 15, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 13, 37, 37, 15, 0, 16, 0, 0, 0, 0, 0, 9, 10, 10, 11, 16, 13, 37, 37, 15, 0, 16, 0, 41, 0, 0, 0, 13, 14, 14, 15, 16, 13, 37, 37, 15, 0, 16, 0, 0, 0, 0, 0, 13, 14, 14, 15, 16, 13, 37, 37, 21, 10, 11, 0, 41, 0, 0, 0, 13, 14, 14, 15, 16, 13, 37, 37, 13, 14, 15, 0, 0, 0, 0, 0, 13, 14, 21, 10, 11, 13, 37, 37, 13, 14, 15, 0, 41, 0, 0, 0, 13, 14, 13, 14, 15, 13, 37, 37, 13, 14, 15, 0, 0, 0, 0, 0, 13, 14, 13, 14, 15, 13, 37, 37, 13, 14, 15, 0, 41, 0, 0, 0, 13, 14, 13, 14, 15, 13, 37, 37, 13, 14, 15, 0, 0, 45, 0, 0, 13, 21, 10, 10, 23, 13, 37, 37, 13, 14, 15, 0, 9, 10, 11, 0, 13, 13, 14, 14, 15, 13, 37, 37, 13, 14, 15, 0, 13, 14, 15, 0, 13, 13, 14, 14, 15, 13, 37, 37, 13, 14, 15, 0, 13, 14, 15, 0, 13, 13, 14, 14, 15, 13, 37, 37, 13, 14, 15, 0, 13, 14, 15, 0, 13, 13, 21, 10, 10, 23, 37, 37, 13, 14, 15, 0, 13, 33, 15, 0, 13, 13, 13, 14, 14, 15, 37, 37, 29, 30, 30, 30, 31, 37, 15, 0, 13, 13, 13, 14, 14, 15, 37, 37, 13, 14, 18, 14, 13, 37, 15, 0, 13, 13, 13, 14, 14, 15, 37, 37, 13, 14, 22, 14, 13, 37, 15, 0, 13, 13, 13, 14, 14, 15, 37, 37, 13, 14, 22, 14, 13, 37, 15, 0],
         "height":20,
         "width":16,
		   "animalList": [
                {x: 2, y: 14, type: ANIMAL_TYPE_TURTLE},
	       	 	{x: 7, y: -1, type: ANIMAL_TYPE_GOOMBA},
	       	]
    },
    {	//block-9
        "data":[0, 0, 0, 0, 9, 11, 29, 30, 30, 30, 30, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 15, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 9, 11, 0, 0, 0, 12, 0, 0, 13, 15, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 13, 15, 0, 0, 0, 16, 0, 45, 13, 15, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 13, 15, 0, 0, 0, 16, 9, 10, 23, 15, 37, 37, 37, 37, 37, 37, 37, 29, 30, 31, 13, 15, 0, 0, 0, 16, 13, 14, 15, 15, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 13, 15, 0, 0, 9, 10, 23, 14, 15, 15, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 13, 15, 0, 0, 13, 14, 15, 14, 15, 15, 37, 37, 37, 29, 30, 30, 31, 37, 37, 37, 13, 15, 0, 0, 13, 14, 15, 14, 15, 15, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 13, 15, 0, 0, 13, 14, 15, 14, 15, 15, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 13, 15, 0, 0, 13, 14, 15, 14, 15, 15, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 13, 15, 0, 0, 13, 14, 15, 14, 29, 30, 31, 37, 37, 37, 37, 37, 37, 37, 37, 37, 13, 15, 45, 0, 13, 14, 15, 14, 15, 18, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 17, 10, 11, 0, 13, 21, 10, 23, 15, 22, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 0, 13, 13, 14, 15, 15, 22, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 13, 14, 15, 0, 13, 13, 14, 15, 15, 22, 37, 29, 30, 31, 37, 37, 37, 37, 37, 37, 13, 14, 15, 0, 13, 13, 14, 15, 15, 22, 37, 37, 18, 37, 37, 37, 37, 29, 30, 31, 13, 14, 15, 0, 13, 13, 14, 15, 15, 22, 37, 37, 22, 37, 37, 37, 37, 37, 18, 37, 13, 14, 15, 0, 13, 13, 14, 15, 15, 22, 37, 37, 22, 37, 37, 37, 37, 37, 22, 37, 13, 14, 15, 0],
        "height":19,
        "width":20,
		   "animalList": [
                {x: 9, y: 6, type: ANIMAL_TYPE_TURTLE},
	       	 	{x: 7, y: -1, type: ANIMAL_TYPE_GOOMBA},
	       	]
   }
    ];
	
	var LEVEL_BLOCK_NUMBER = {
		1: blockList.length - 5,
		2: blockList.length - 3,
		3: blockList.length
	}
	var MAX_LEVEL_NUMBER = 3;

	// Specific tiles list
	var PLATFORM_TILE_LIST = [9, 10, 11, 17, 19, 20, 21, 23];
	var BLOCK_TILE_LIST = [18, 22, 25, 26, 27, 29, 30, 31];
	var ANIMATED_TILE_LIST = [33, 37, 41, 45];
	var WORLD_DESIGN_TILE_LIST = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27];

	var TILE_PER_LINE = 4; // The number of tile per line on tile image
	
	/*
	 * The world map
	 */
	var WorldMap = function() {
	};
	
	WorldMap.prototype.create = function() {
		// World is made of 4 images, to animate some elements (waterfalls...)
		this.currentAnimationSprite = 0; // The current frame of current image, to know when we have to change it
		this.currentDisplayedImage = 0; // The current displayed image (0 or 1)
		this.imageList = []; // The world image list
		// Sets the blocks componing the world
		function shuffle(o){
		    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		    return o;
		}
		var randomBlockList = shuffle(blockList);
		this.blockList = [];
		for(var index = 0; index < LEVEL_BLOCK_NUMBER[game.levelNumber]; ++index) {
			this.blockList.push(randomBlockList[index]);
		}
		this.blockList.push(startBlock);
		this.blockList.unshift(endBlock);
		this.designOffset = Math.random() > 0.5 ? 0 : 12;
		
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
		canvas.width = this.width * CELL_SIZE / 2;
		canvas.height = this.height * CELL_SIZE / 2;
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
				if(WORLD_DESIGN_TILE_LIST.indexOf(tile + 1) !== -1) {
					tileY += this.designOffset;
				}
				context.drawImage(game.tileSet, tileX * CELL_SIZE/ 2, tileY * TILE_SIZE, TILE_SIZE, TILE_SIZE, CELL_SIZE * x/2, CELL_SIZE * y/2, TILE_SIZE, TILE_SIZE);
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

		if((game.levelNumber < MAX_LEVEL_NUMBER && this.x > CELL_SIZE * 4) || (game.levelNumber >= MAX_LEVEL_NUMBER && this.x > CELL_SIZE * 5)) {
			game.isLevelEnded = true;
			game.endTime = +new Date();
		}
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
		case ANIMAL_TYPE_MARIO:
			this.spriteX = MARIO_SPRITE_X;
			this.spriteY = MARIO_SPRITE_Y;
			this.speed = MARIO_VELOCITY_X;
			this.height = 2;
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
		var distanceToPeachY = this.y - peach.y;
		if(distanceToPeachX > 0 && distanceToPeachX < CELL_SIZE && distanceToPeachY >= -CELL_SIZE && distanceToPeachY <= CELL_SIZE) {
			this.isCollected = true;
			++game.levelScore;
		}
	};
	Animal.prototype.setOppositeDirection = function() {
		this.moveDirection = this.moveDirection === MOVE_LEFT ?  MOVE_RIGHT : MOVE_LEFT;
	}
	
	function Peach() {
		// Inits Peach
		this.isJumping = false;
		this.goLeft = false;
		this.goRight = false;
		window.addEventListener('keydown', function(k) {
			if(game.isLevelEnded) {
				if(k.keyCode === 32) { // Space
					game.nextLevel();
				}
				return;
			}
			if(game.displayStartScreen) {
				if(k.keyCode === 32) { // Space
					game.displayStartScreen = false;
				}
				return;
			}
			if(game.isOver) {
				if(k.keyCode === 32) { // Space
					game.start();
				}	
			}
		    switch(k.keyCode) {
	        	case 32: //space
		        case 38: //up
		        case 87: //W
		        	// Player has to release and press again to make a new jump
		        	if(!this.isJumping) {
			        	this.startJump();
		        	}
		            break;
		        case 65: //A
		        case 37: //left
		        	this.goLeft = true;
		        	this.goRight = false;
		        	this.spriteDirection = MOVE_LEFT;
		            break;
		        case 39: //right
		        case 68: //D
		        	this.goLeft = false;
		        	this.goRight = true;
		        	this.spriteDirection = MOVE_RIGHT;
		            break;
	            //83:S bottom: 40
		    }
		}.bind(this));

		window.addEventListener('keyup', function(k) {
		    switch(k.keyCode) {
		        case 32: //up
		        case 38: //up
		        	this.isJumping = false;
		        	this.stopJump();
		            break;
		        case 65: //A
		        case 37: //left
		        	this.goLeft = false;
	        		break;
		        case 39: //right
		        case 68: //D
		        	this.goRight = false;
		            break;
		    }
		}.bind(this));
	};

	Peach.prototype.startJump = function() {
		if(this.isOnGround) {
			this.currentVelocityY = -JUMP_IMPULSE;
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

		if(this.goLeft) {
			this.moveDirection = MOVE_LEFT;
		} else if (this.goRight) {
			this.moveDirection = MOVE_RIGHT;
		} else {
			this.moveDirection = MOVE_STOP;
        	this.currentSprite = 0; // Resets move animation
		}
    	
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
			--game.lifeNumber;
			if(game.lifeNumber <= 0) {
				game.over();
			} else {
				game.reset();
			}
			return;
		}

		// Checks Y collision/platform
		if(this.currentVelocityY > 0 || (this.currentVelocityY === 0 && this.moveDirection !== MOVE_STOP)) { // If is not jumping top, checks the cell below
			var bottomLeftCellState = worldMap.getCellState(- Math.floor(cellX + .4 * PEACH_WIDTH / CELL_SIZE), Math.floor((this.y + PEACH_HEIGHT) / CELL_SIZE));
			var bottomRightCellState = worldMap.getCellState(- Math.floor(cellX - .4 * PEACH_WIDTH / CELL_SIZE), Math.floor((this.y + PEACH_HEIGHT) / CELL_SIZE));
			var bottomCellState = worldMap.getCellState(- Math.floor(cellX), Math.floor((this.y + PEACH_HEIGHT) / CELL_SIZE));
			if(bottomCellState === CELL_PLATFORM || bottomLeftCellState === CELL_BLOCK || bottomRightCellState === CELL_BLOCK) {
				if(this.currentVelocityY > 0 && ((this.y >= 0 && this.y % CELL_SIZE <= JUMP_IMPULSE) || (this.y < 0 && this.y % CELL_SIZE <= - JUMP_IMPULSE))) {
					this.stopFall();
					this.currentSprite = 0;
					hasTouchFloor = true;
				}
			}
			else {
				this.startFall();
			}
		} else if(this.currentVelocityY < 0 ) {
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
		this.displayStartScreen = true;
	};

	Game.prototype.draw = function() {
		if(!isWorldMapReady)
			return;
		var now = +new Date();
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		
		// Draws Mario behind world for when he leaves the level
		for(var animalIndex in worldMap.animalList) {
			var animal = worldMap.animalList[animalIndex];
			if(animal.isCollected) {
				continue;
			}
			context.save();
			switch(animal.type) {
			case ANIMAL_TYPE_TURTLE: 
			case ANIMAL_TYPE_GOOMBA:
				continue;
				break;
			case ANIMAL_TYPE_MARIO:
				if(++animal.currentAnimationSprite > MARIO_TICK_FRAME_NUMBER) {
					context.translate(Math.floor(worldMap.x) + animal.x,  worldMap.y + animal.y);
					context.scale(-1, 1);
				} else {
					context.translate(Math.floor(worldMap.x) + animal.x - CELL_SIZE,  worldMap.y + animal.y);
				}
				if(this.isLevelEnded && this.levelNumber < MAX_LEVEL_NUMBER) {
					animal.y += 2;
					var marioY = animal.y;
				}
				break;
			}
			context.translate(0, - worldMap.offsetY * CELL_SIZE);
			context.drawImage(game.tileSet, (animal.spriteX + animal.currentDisplayedImage) * TILE_SIZE, animal.spriteY * TILE_SIZE, TILE_SIZE, TILE_SIZE * animal.height, 0, 0, CELL_SIZE, CELL_SIZE * animal.height);
			context.restore();
		}

		
		// Draws world
		if(++worldMap.currentAnimationSprite > WORLD_TICK_FRAME_NUMBER) {
			worldMap.currentAnimationSprite = 0;
			worldMap.currentDisplayedImage = ++worldMap.currentDisplayedImage % WORLD_IMAGE_NUMBER;
		}
		var worldImage = worldMap.imageList[worldMap.currentDisplayedImage];
		context.save()
		context.scale(2,2);
		context.drawImage(worldImage, Math.floor(worldMap.x) / 2, worldMap.y / 2);
		context.restore();

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
			case ANIMAL_TYPE_MARIO:
				continue;
				break;
			}
			context.translate(0, - worldMap.offsetY * CELL_SIZE);
			context.drawImage(game.tileSet, (animal.spriteX + animal.currentDisplayedImage) * TILE_SIZE, animal.spriteY * TILE_SIZE, TILE_SIZE, TILE_SIZE * animal.height, 0, 0, CELL_SIZE, CELL_SIZE * animal.height);
			context.restore();
		}

		// Draws peach
		context.save();
		context.translate(peach.x, Math.floor(Math.max(CENTER_Y_LIMIT, peach.y)));
		if(peach.spriteDirection === MOVE_LEFT) {
			context.scale(-1, 1);
		}
		context.drawImage(game.tileSet, peach.currentSprite * PEACH_WIDTH / 2, 0, PEACH_WIDTH / 2, PEACH_HEIGHT / 2, -PEACH_WIDTH / 2, 0, PEACH_WIDTH, PEACH_HEIGHT);
		context.restore();
		
		if(!this.isOver) {
			textManager.text({ctx: context, x: 10, y: 10, text: 'COLLECTED: ' + this.levelScore + '/' + (2 * LEVEL_BLOCK_NUMBER[game.levelNumber] + 2), valign: 'top', halign: 'left', scale: 2, vspacing: 10, hspacing: 2, color: 'rgb(255,255,255)'});
			textManager.text({ctx: context, x: 550, y: 10, text: 'LIFE: ' + this.lifeNumber, valign: 'top', halign: 'left', scale: 2, vspacing: 10, hspacing: 2, color: 'rgb(255,255,255)'});
			textManager.text({ctx: context, x: 450, y: 10, text: 'LEVEL: ' + this.levelNumber, valign: 'top', halign: 'left', scale: 2, vspacing: 10, hspacing: 2, color: 'rgb(255,255,255)'});
		}
		if(this.displayStartScreen || this.isOver) {
			context.beginPath();
			context.rect(0, 0, canvasWidth, canvasHeight);
			context.fillStyle = 'rgba(0, 0, 0, 0.8)';
			context.fill();
			
			textManager.text({ctx: context, x: 210, y: 30, text: 'SUPER', valign: 'top', halign: 'left', scale: 5, vspacing: 10, hspacing: 2, color: 'rgb(0, 20, 222)'});
			textManager.text({ctx: context, x: 210, y: 65, text: 'PEACH', valign: 'top', halign: 'left', scale: 5, vspacing: 10, hspacing: 2, color: 'rgb(29, 135, 0)'});
			textManager.text({ctx: context, x: 320, y: 65, text: 'WORLD', valign: 'top', halign: 'left', scale: 5, vspacing: 10, hspacing: 2, color: 'rgb(228, 0, 10)'});
			
			if(this.displayStartScreen) {
				textManager.text({ctx: context, x: canvasWidth / 2, y: 120, text: 'PEACH IS BORED AND DECIDES TO FIND MARIO.\nAS HER DRESS HAS NO POCKET SHE CANNOT COLLECT COINS!\nBUT AS A PRINCESS SHE CAN COLLECT THE ANIMALS SHE MEETS.', valign: 'top', halign: 'center', scale: 2, vspacing: 12, hspacing: 2, color: 'rgb(255, 255,255)'});
				textManager.text({ctx: context, x: canvasWidth / 2, y: 220, text: 'FIND MARIO WHILE COLLECTING GOOMBAS AND TURTLES.', valign: 'top', halign: 'center', scale: 2, vspacing: 12, hspacing: 2, color: 'rgb(255, 196,0)'});
				textManager.text({ctx: context, x: 20, y: 330, text: 'MOVE: ARROWS/WASD\nJUMP: SPACE/UP', valign: 'top', halign: 'left', scale: 2, vspacing: 12, hspacing: 2, color: 'rgba(255, 255,255, 0.7)'});
			}
			if(this.isOver) {
				textManager.text({ctx: context, x: canvasWidth / 2, y: 170, text: 'GAME OVER', valign: 'top', halign: 'center', scale: 4, vspacing: 12, hspacing: 2, color: 'rgb(255, 196,0)'});
			}
			textManager.text({ctx: context, x: canvasWidth / 2, y: 250, text: 'PRESS SPACE TO ' + (this.isOver ? 'RE' : '') + 'START', valign: 'top', halign: 'center', scale: 2, vspacing: 12, hspacing: 2, color: 'rgb(29, 135, 0)'});
		}
		if(this.isLevelEnded) {
			var y = 120;
			var text = '';
			var endText = 'PRESS SPACE TO CONTINUE';
			var endTextTime = 2000;
			if(now -this.endTime > 1000) {
				text = 'OH! MARIO';
			}
			if(this.levelNumber === MAX_LEVEL_NUMBER) {
				endText = 'THANK YOU FOR PLAYING! PRESS SPACE TO RESTART GAME IN 2X SPEED!';
				endTextTime = 4500;
				y = 50;
				if(now - this.endTime > 2000) {
					text = 'OH! MARIO\nMARIO';
				}
				if(now - this.endTime > 3500) {
					text = 'OH! MARIO\nMARIO\n\nTHANK YOU PEACH';
				}
			}
			textManager.text({ctx: context, x: canvasWidth / 2, y: y, text: text, valign: 'top', halign: 'center', scale: 4, vspacing: 12, hspacing: 2, color: 'rgb(40, 40, 40)'});

			if(now - this.endTime > endTextTime) {
				textManager.text({ctx: context, x: canvasWidth / 2, y: 350, text: endText, valign: 'top', halign: 'center', scale: 2, vspacing: 12, hspacing: 2, color: 'rgb(70, 70, 70)'});
			}
		}
	}
	Game.prototype.updateBackgroundPosition = function() {
		this.backgroundElement.style.backgroundPositionX = Math.floor(0.5 * worldMap.x) + 'px';
		this.backgroundElement.style.backgroundPositionY = Math.floor(0.3 * worldMap.y + CELL_SIZE) + 'px';
		document.getElementById('game').style.backgroundPositionY = Math.floor(0.05 * worldMap.y ) + 'px';
	}

	Game.prototype.reset = function() {
		// Initial position, far on right (peach starts on right side on go back to left, from negative x value to 0
		worldMap.x = - (worldMap.width - SCREEN_WIDTH) * CELL_SIZE;
		for(var animalIndex in worldMap.animalList) {
			worldMap.animalList[animalIndex].isCollected = false;
		}
		// Inits peach
		peach.currentAnimationSprite = 0;
		peach.currentSprite = 0;
		// Start position
		peach.x = CELL_SIZE * SCREEN_WIDTH / 2;
		peach.y = CELL_SIZE * (SCREEN_HEIGHT - 3);
		peach.currentVelocityY = 0;
		peach.moveDirection = MOVE_STOP; // If Peach is moving, and its direction (-1 = left, 0 = stop, 1 = right)
		peach.spriteDirection = MOVE_LEFT; // when movement is stopped, keeps the curret sprite direction
		peach.hasBlockCollision = false;

		this.levelScore = 0;
		this.isLevelEnded = false;
	}

	Game.prototype.start = function() {
		worldMap = new WorldMap();
		peach = new Peach();
		// Loads assets
		this.levelNumber = 0;
		this.score = 0;
		this.isOver = false;
		this.levelScore = 0;
		this.lifeNumber = 3;
		this.tileSet = new Image();
		this.tileSet.src = 'assets/img/tileset.png';
		this.tileSet.addEventListener('load', function() {
			this.nextLevel();
			this.loop();
		}.bind(this));
	}
	Game.prototype.nextLevel = function() {
		// Loads assets
		this.isLevelEnded = false;
		this.endTime = 0;
		this.score += this.levelScore;
		this.levelScore = 0;
		++this.levelNumber;
		if(this.levelNumber > MAX_LEVEL_NUMBER) {
			this.start();
		}
		worldMap.create();
		this.reset();
	}
	Game.prototype.over = function() {
		this.isOver = true;
		context.restore();
		context.beginPath();
		context.rect(0, 0, canvasWidth, canvasHeight);
		context.fillStyle = 'rgba(0, 0, 0, 0.8)';
		context.fill();
	}
	Game.prototype.loop = function() {
		if(!this.isOver) {
			window.requestAnimationFrame(this.loop.bind(this));
		}
		if(!this.isLevelEnded) {
			peach.updatePosition();
			worldMap.updatePosition();
			for(var index in worldMap.animalList) {
				if(!worldMap.animalList[index].isCollected) {
					worldMap.animalList[index].updatePosition();
				}
			}
		}
		this.updateBackgroundPosition();
		this.draw();
	}

	var worldMap;
	var peach;
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
		context.beginPath();
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

			textManager.textLine( {
				ctx: opt.ctx,
				x: x,
				y: y,
				text: line,
				hspacing: opt.hspacing,
				scale: opt.scale
			} );
		}
		
		context.fillStyle = opt.color;
		context.fill();

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
			 [  , 1, 1, 0 ],
			 [ 1,  ,  , 1 ],
			 [ 1, 1, 1, 1 ],
			 [ 1,  ,  , 1 ],
			 [ 1,  ,  , 1 ]
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
			 [ 1,  ,  , 1 ],
			 [ 1,  ,  , 1 ],
			 [ 1,  ,  , 1 ],
			 [ 1,  ,  , 1 ],
			 [  , 1, 1, 0 ]
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
		'!': [
			 [  1,  , 0 ],
			 [  1,  , 0 ],
			 [  1,  , 0 ],
			 [   ,  , 0 ],
			 [  1,  , 0 ]
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
	};
	
}(window, document));