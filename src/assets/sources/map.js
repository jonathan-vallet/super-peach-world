(function(name,data){
 if(typeof onTileMapLoaded === 'undefined') {
  if(typeof TileMaps === 'undefined') TileMaps = {};
  TileMaps[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }})("map",
{ "height":10,
 "layers":[
        {
         "compression":"zlib",
         "data":"eJztlm0LgzAMhPtts9tk7sVtsP\/\/O5ehgbNLE6itKOvBIdiaBh9z6NyvWuFela4deT+6yVy7y1xvLbqSb4bvibU9+TD6OLvTQTwXzAOZl+BeWin98zPSXm2tBI8uuOIZOc9ZSlL\/b8Ne2YtroU5uyh65peb\/P\/B4GfbKXo1HeBbuS81\/i8fZbSu\/1sjDmpUwY9GXoP7W5mVJHlJe8TeLPKxZkbhi\/5XHdA0zAvMh9h6\/dSqPQSV4xP6jKg9bOXnEcp1npCc\/ZvpJ\/gDj9RWA",
         "encoding":"base64",
         "height":10,
         "name":"Calque de Tile 1",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":100,
         "x":0,
         "y":0
        }, 
        {
         "compression":"zlib",
         "data":"eJztwzENAAAIA7B5wL9X3lmAtEkTuGMqAADAJwvwSgA6",
         "encoding":"base64",
         "height":10,
         "name":"Calque 2",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":100,
         "x":0,
         "y":0
        }],
 "nextobjectid":1,
 "orientation":"orthogonal",
 "properties":
    {

    },
 "renderorder":"right-down",
 "tileheight":32,
 "tilesets":[
        {
         "firstgid":1,
         "image":"..\/img\/tileset.png",
         "imageheight":320,
         "imagewidth":96,
         "margin":0,
         "name":"tileset",
         "properties":
            {

            },
         "spacing":0,
         "tilecount":30,
         "tileheight":32,
         "tilewidth":32
        }],
 "tilewidth":32,
 "version":1,
 "width":100
});