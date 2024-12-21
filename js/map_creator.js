import * as MapModule from './map.js';
import { canvas, ctx } from './main.js';

const mapCanvas = MapModule.getMapCanvas();
const mapCtx = MapModule.getContext();
const [tileWidth, tileHeight] = MapModule.getTileDimension();
const [rowCount, columnCount] = MapModule.getMapDimension();
let mapNr = 1;

let clickCount = 0;
let firstClickCoords = null;

let platformsData = {
    platforms: [
        [15, 15, 19, 19]
    ]
};

canvas.addEventListener('click', (e) => {
    const targetX = Math.floor(e.pageX / tileWidth);
    const targetY = Math.floor(e.pageY / tileHeight);
    console.log(targetX, targetY);

    if (clickCount === 0) {
        // First click
        firstClickCoords = { x: targetX, y: targetY };
        MapModule.drawRect(targetX * tileWidth, targetY * tileHeight, tileWidth, tileHeight, "FFFF00", mapCtx);
        clickCount++;
    } else {
        // Second click
        const startX = Math.min(firstClickCoords.x, targetX);
        const endX = Math.max(firstClickCoords.x, targetX);
        const startY = Math.min(firstClickCoords.y, targetY);
        const endY = Math.max(firstClickCoords.y, targetY);

        // Draw the platform
        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                MapModule.drawRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight, "FFFF00", mapCtx);
            }
        }

        // Add the new platform to the platforms data
        platformsData.platforms.push([startX, startY, endX, endY]);

        // Reset click count and coordinates
        clickCount = 0;
        firstClickCoords = null;
    }
});

document.addEventListener("keydown", (e) =>{
    if(e.key == "Enter"){
        savePlatformsToFile(platformsData);
    }
})

function savePlatformsToFile(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'map_1.json'; // The name of the file to be saved
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log("File saved successfully!");
}

