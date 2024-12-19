let canvas, ctx, mapCanvas, mapCtx;
const mapTiles = [];
const width = 50, height = 50;
export function initMap(canv){
    canvas = canv;
    ctx = canvas.getContext("2d");
    // Create a canvas for the map
    mapCanvas = document.createElement("canvas");
    mapCanvas.width = canvas.width;
    mapCanvas.height = canvas.height;
    document.body.appendChild(mapCanvas);
    mapCtx = mapCanvas.getContext("2d");
    if(mapCtx){
        console.log("context initalized")
    }
}

export function splitMap(){
    const rows = Math.floor(mapCanvas.height / height);
    const cols = Math.floor(mapCanvas.width / width);
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

export function getMapCanvas() {
    return mapCanvas;
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
                    mapTiles[y][x].type = 1; // Set the type to 1 (assuming type 1 is for platforms)
                    drawRect(x * width, y * height, width, height, "FFFF00", mapCtx)
                } else {
                    console.log("Invalid tile at:", x, y);
                }
            }
        }
    });
}