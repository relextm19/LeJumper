import * as PlayerModule from "./player.js"; 

// Canvas setup
export const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Game variables
export const gravity = 0.5; 

export const ax = 1;
export const ay = 20;
export const f = 0.9;
PlayerModule.initPlayer(canvas, gravity, f, ax, ay, gameLoop);




function gameLoop() {
    PlayerModule.updatePlayer();
    draw();
    requestAnimationFrame(gameLoop); // Call gameLoop recursively for animation
}

function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the player image
    ctx.drawImage(PlayerModule.player.image, PlayerModule.player.x, PlayerModule.player.y, PlayerModule.player.width, PlayerModule.player.height);
}


