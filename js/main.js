import * as PlayerModule from "./player.js"; 
import * as MapModule from "./map.js";

// Canvas setup
export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
export const gravity = 0.5; 
export const f = 0.9; // friction
export const ar = 0.98; // air resistance

//initalize map
MapModule.initMap();
MapModule.splitMap();
MapModule.loadMap(1);

PlayerModule.initPlayer(gravity, f, ar, gameLoop);

let lastTime = Date.now();
function gameLoop() {
    const currentTime = Date.now();
    let deltaTime = currentTime - lastTime;
    PlayerModule.updatePlayer(deltaTime);
    draw();
    lastTime = currentTime;
}

function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(MapModule.getMapCanvas(), 0, 0)
    // Draw the player image
    ctx.drawImage(PlayerModule.player.image, PlayerModule.player.x, PlayerModule.player.y, PlayerModule.player.width, PlayerModule.player.height);
}

const gameLoopInterval = setInterval(gameLoop, 1000 / 144);