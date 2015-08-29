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

### TODO:
- game logo (if enough space)
- pitch with game rules when starting the game
- animals collection
- scoring
- timer
- random level generation

### OPTIONAL TODO:
- animals collected follow peach
- online scoring with node
- mobile touch
- on borders of the world, move peach, not the camera (level design can avoid that)
- sound
- several level designs (earth and ice)

### PERF TODO:
- set images as base64, not files
