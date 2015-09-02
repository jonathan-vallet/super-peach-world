# Super Peach World

Project realized for the js13k contest 2015. Theme is "reversed".

I decided to make the reverse of Mario, whose goal is to find Peach.
Here we play with peach. She must travel the level in opposite direction than classic mario game.
As she is a princess, her dress has no pocket, then she cannot collect coins.
But as a princess, she is an animal lover, then she collects goombas and turtles.

Your goal is to run through the level to find Mario, while collecting te maximum number of animals in the minimum of time.

## Project installation

> $ npm install
> $ gulp watch

run index.html in generated www folder

## Task list

### Done
- peach animation
- background with parallax
- peach movement
- variable jump height
- platforms
- level design
- collisions with objects
- added goombas and turtles (sprite, animation, movement, collision)
- animals collection
- scoring
- random level generation (- random block cannot be repeated each block once)
- introduction screen / pitch with game rules when starting the game (started but commented)

### TODO:
- timer
- add more block level design
- add pipe tile, and when reaching Mario, he takes the pipe, then level is ended. (or game after 3 levels?)
    - eventually Peach can follow him (add an event on down touch to make her fall when on the pipe)
    - define if the game is over when a global timer is ended, life = 0 and/or a number of levels.

### OPTIONAL TODO:
- life number/game over
- sound
- score saving in local storage
- score screen
- several level designs (earth and ice) => done in psd, but image is too heavy after. We can try: http://www.storminthecastle.com/projects/colormatriximage/ to add color filter on map to add effect)
- random sky color => set the sky image as a white to transparent gradient, and change background color (with time, random at level start...)
- animals collected follow peach
- online scoring with node
- mobile touch
- on borders of the world, move peach, not the camera (level design can avoid that)
- game logo (if enough space)

### PERF TODO:
- set images as base64, not files => as image is a png8, optimized after on tinypng.org, base64 is heavier, even zipped
