import { canvas } from "./main.js";
let mapCanvas, mapCtx, tileWidth, tileHeight, columnCount, rowCount;
const mapTiles = [];
export function initMap(){
    // Create a canvas for the map
    mapCanvas = document.createElement("canvas");
    document.body.appendChild(mapCanvas);
    mapCtx = mapCanvas.getContext("2d");
    if(mapCtx){
        console.log("context initalized")
    }
    tileHeight = canvas.height / 20;
    tileWidth = canvas.width / 20;
    console.log("Map initalized");
}

function udpateMapCanvasDimension(width, height){
    mapCanvas.width = width;
    mapCanvas.height = height;
}

export function splitMap(endX, endY){
    [rowCount, columnCount] = [endX, endY];
    for (let y = 0; y <= rowCount; y += 1) {
        const row = [];
        for (let x = 0; x <= columnCount; x += 1) {
            const tile = {
                type: 0,
                solid: false,
                y: y * tileHeight,
                x: x * tileWidth,
                width: tileWidth,
                height: tileHeight
            };
            row.push(tile);
        }
        mapTiles.push(row);
    }
}

export function drawRect(x, y, width, height, color, context) {
    if(!context){
        console.log("context not provided");
        return;
    }
    context.beginPath();
    context.fillStyle = `#${color}`;
    context.fillRect(x, y, width, height);
    context.stroke();
}

export function loadMap(nr){
    console.log("loading map")
    return fetch(`assets/maps/map_${nr}.json`)
        .then((res) => {
            if(!res.ok){
                console.log("Error loading map");
            } else{
                return res.json();
            }
        }).then(updateTiles)
}
function updateTiles(data){
    if(!data) return;
    splitMap(...data.map_size);
    data.platforms.forEach((platform) => {
        // Assuming each platform in data.platforms is an array [startX, endX, startY, endY]
        const [startX, endX, startY, endY] = platform;

        if(startX < 0) return;
        if(startY < 0) return;
        
        // Update the type of map tiles between the coordinates
        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                // Check if the tile exists at the given coordinates
                if (mapTiles[y] && mapTiles[y][x]) {
                    mapTiles[y][x].type = 1; 
                    mapTiles[y][x].solid = true;
                } else {
                    console.log("Invalid tile at:", x, y);
                }
            }
        }
    });
    udpateMapCanvasDimension(rowCount * tileWidth, columnCount * tileHeight);
    drawMap();
}
export function drawMap(){
    let color = "";
    for (let y = 0; y < rowCount; y += 1) {
        for (let x = 0; x < columnCount; x += 1) {
            const tile = mapTiles[y][x];
            switch(tile.type){
                case 0:
                    color = "000000";
                    break;
                case 1:
                    color = "00FFFF";
                    break;
            }
            drawRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight, color, mapCtx);
        }
    }
    return mapCanvas;
}

export function getMapCanvas() {
    return mapCanvas;
}

export function getMapTiles() {
    return mapTiles;
}

export function getTileDimension(){
    return [tileWidth, tileHeight];
}

export function getContext(){
    return mapCtx;
}

export function getMapDimension(){
    return [rowCount * tileWidth, columnCount * tileHeight];
}