import { initPlayer, player, updatePlayer } from "./player.js";
import { initMap, loadMap, getMapCanvas } from "./map.js";
import { initCollision } from "./collison.js";
import { initCamera, getCameraPosition } from "./camera.js";
import { initTurtleEnemy, updateTurtleEnemy } from "./enemy.js";
import { enemies } from "./gameState.js";

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
    initMap();
    await loadMap(1);

    initCollision();
    initCamera();
    
    initPlayer(gameLoop);
    initTurtleEnemy(100, 100);

    gameLoopInterval = setInterval(gameLoop, 1000 / 60);
}

let lastTime = Date.now();
function gameLoop() {
    const currentTime = Date.now();
    let deltaTime = currentTime - lastTime;

    updatePlayer(deltaTime);
    for(let enemy of enemies){
        updateTurtleEnemy(enemy, deltaTime);
    }
    draw();

    lastTime = currentTime;
}

function draw() {
    const [cameraX, cameraY] = getCameraPosition();
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //draw map
    ctx.drawImage(getMapCanvas(),0 - cameraX, 0 - cameraY);
    // Draw the player image
    ctx.drawImage(player.image, player.x - cameraX, player.y - cameraY, player.width, player.height);
    // Draw the enemies 
    for(let enemy of enemies){
        ctx.drawImage(enemy.image, enemy.x - cameraX, enemy.y - cameraY, enemy.width, enemy.height);
    }
}

export function endGame(){
    console.log("game ended");
    clearInterval(gameLoopInterval);
    showGameOverScreen();
}

async function resetGame(){   
    enemies.length = 0;
    console.log(enemies)
    await initalizeAll();
}

function showGameOverScreen() {
    // Create game over screen elements
    const gameOverScreen = document.createElement("div");
    gameOverScreen.id = "gameOverScreen";
    gameOverScreen.style.position = "absolute";
    gameOverScreen.style.top = "0";
    gameOverScreen.style.left = "0";
    gameOverScreen.style.width = "100%";
    gameOverScreen.style.height = "100%";
    gameOverScreen.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    gameOverScreen.style.display = "flex";
    gameOverScreen.style.flexDirection = "column";
    gameOverScreen.style.justifyContent = "center";
    gameOverScreen.style.alignItems = "center";
    gameOverScreen.style.color = "white";
    gameOverScreen.style.fontSize = "2em";
    gameOverScreen.style.zIndex = "1000";

    const gameOverText = document.createElement("div");
    gameOverText.innerText = "Game Over";

    const replayButton = document.createElement("button");
    replayButton.innerText = "Replay";
    replayButton.style.marginTop = "20px";
    replayButton.style.padding = "10px 20px";
    replayButton.style.fontSize = "1em";
    replayButton.onclick = () => {
        document.body.removeChild(gameOverScreen);
        resetGame();
    };

    gameOverScreen.appendChild(gameOverText);
    gameOverScreen.appendChild(replayButton);
    document.body.appendChild(gameOverScreen);
}


let gameLoopInterval;
initalizeAll();