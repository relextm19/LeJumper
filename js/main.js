import * as PlayerModule from "./player.js"; 
import * as MapModule from "./map.js";

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
export const gravity = 0.5; 
export const ax = 1; // x acceleration
export const ay = 20; // y acceleration
export const f = 0.9; // friction
export const ar = 0.98; // air resistance
export const aax = 0.3; // acceleration while in air
PlayerModule.initPlayer(canvas, gravity, f, ar, ax, ay, aax, gameLoop);

//initalize map
MapModule.initMap(canvas);
MapModule.splitMap();
MapModule.loadMap(1);

function gameLoop() {
    PlayerModule.updatePlayer();
    draw();
    requestAnimationFrame(gameLoop); // Call gameLoop recursively for animation
}

function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(MapModule.getMapCanvas(), 0, 0)
    // Draw the player image
    ctx.drawImage(PlayerModule.player.image, PlayerModule.player.x, PlayerModule.player.y, PlayerModule.player.width, PlayerModule.player.height);
}


