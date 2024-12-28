import * as PlayerModule from "./player.js"; 
import * as MapModule from "./map.js";
import { initCamera, getCameraPosition } from "./camera.js";

// Game variables
export const gravity = 0.5; 
export const friction = 0.9; 
export const airResistance = 0.98;

// Canvas setup
export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

async function initalizeAll(){
    MapModule.initMap();
    await MapModule.loadMap(1);

    initCamera();
    
    PlayerModule.initPlayer(gameLoop);
}
let lastTime = Date.now();
function gameLoop() {
    const currentTime = Date.now();
    let deltaTime = currentTime - lastTime;
    PlayerModule.updatePlayer(deltaTime);
    lastTime = currentTime;
    draw();
}

function draw() {
    const [cameraX, cameraY] = getCameraPosition();
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //draw map
    ctx.drawImage(MapModule.getMapCanvas(),0 - cameraX, 0 - cameraY);
    // Draw the player image
    ctx.drawImage(PlayerModule.player.image, PlayerModule.player.x - cameraX, PlayerModule.player.y, PlayerModule.player.width, PlayerModule.player.height);
}
initalizeAll();
const gameLoopInterval = setInterval(gameLoop, 1000 / 60);