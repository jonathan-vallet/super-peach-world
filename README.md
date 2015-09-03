# Super Peach World

Project realized for the js13k contest 2015. Theme is "reversed".

I decided to make the reverse of Mario, whose goal is to find Peach.
Here we play with Peach. She must travel the level in opposite direction than classic mario game.
As she is a princess, her dress has no pocket, then she cannot collect coins, unlike Mario.
But as a princess, she is an animal lover, then she collects goombas and turtles, basic Mario's enemies.

Your goal is to run through the level to find Mario, while collecting te maximum number of animals in the minimum of time.

## Project installation

> $ npm install
> $ gulp watch

run index.html in generated www folder

## Project details

### Compatibility

Developped on Chrome, but tested on IE11 and Firefox as well

### Features

World is randomly generated. Many blocks have been designed with Tiled and are put together randomly.

Each block has 1 turtle and 1 goomba to collect.

2 world designs have been done: forest and desert. An ice design is done in peach.psd source file, but image was too heavy for the contest limitation.

Due to holiday I cannot do the fine tuning, like saving score/best score.

When game is ended it restarts and launch another requestanimationframe loop. I know it's not quite performant, but I found the idea of the 2x speed funny, so I let it, like harder mode on Super Mario bros 1 on game boy once finished :). And after all, don't we say: it's not a bug, it's a feature!
