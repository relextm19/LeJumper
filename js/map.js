let canvas, mapCanvas, mapCtx, tileWidth, tileHeight;
const mapTiles = [];
export function initMap(canv){
    canvas = canv;
    // Create a canvas for the map
    mapCanvas = document.createElement("canvas");
    mapCanvas.width = canvas.width;
    mapCanvas.height = canvas.height;
    document.body.appendChild(mapCanvas);
    mapCtx = mapCanvas.getContext("2d");
    if(mapCtx){
        console.log("context initalized")
    }
    tileHeight = canvas.height / 20;
    tileWidth = canvas.width / 20;
}

export function splitMap(){
    const rows = Math.floor(mapCanvas.height / tileHeight);
    const cols = Math.floor(mapCanvas.width / tileWidth);
    for (let y = 0; y < rows; y += 1) {
        const row = [];
        for (let x = 0; x < cols; x += 1) {
            const tile = {
                type: 0
            }
            row.push(tile);
        }
        mapTiles.push(row);
    }
}

function drawRect(x, y, width, height, color, context) {
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
    fetch(`assets/maps/map_${nr}.json`)
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
    data.platforms.forEach((platform, rowIndex) => {
        // Assuming each platform in data.platforms is an array [startX, endX, startY, endY]
        const [startX, endX, startY, endY] = platform;
    
        // Ensure that the rowIndex is within bounds
        if (rowIndex < 0 || rowIndex >= mapTiles.length) {
            console.log("Wrong row index:", rowIndex);
            return;
        }
        // Ensure the coordinates are within the bounds of the mapTiles array
        if (startX < 0 || startX >= mapTiles[rowIndex].length || endX < 0 || endX >= mapTiles[rowIndex].length) {
            console.log("Invalid X coordinates:", startX, endX);
            return;
        }
        if (startY < 0 || startY >= mapTiles.length || endY < 0 || endY >= mapTiles.length) {
            console.log("Invalid Y coordinates:", startY, endY);
            return;
        }
        
        // Update the type of map tiles between the coordinates
        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                // Check if the tile exists at the given coordinates
                if (mapTiles[y] && mapTiles[y][x]) {
                    mapTiles[y][x].type = 1; 
                    drawRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight, "FFFF00", mapCtx);
                } else {
                    console.log("Invalid tile at:", x, y);
                }
            }
        }
    });
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