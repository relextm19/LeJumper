import * as MapModule from "./map.js";
import { canvas, gravity, friction, airResistance } from "./main.js";
import { updateCameraPosition } from "./camera.js";
let onGround, tileWidth, tileHeight;
//FIXME: the perception of acceleration is dependent on the monitor resolution
let limitX, limitY;

export const player = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    vy: 0,
    vx: 0,
    ax: 0,
    ay: 0,
    aax: 0,
    image: new Image()
};

const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};


export function initPlayer(callback) {
    [limitX, limitY] = MapModule.getMapDimension();
    [tileWidth, tileHeight] = MapModule.getTileDimension();
    player.x = 0; 
    player.y = 0;
    player.width = tileHeight;
    player.height = tileHeight - 1; //if the player size gets higher than the tile the collision breaks
    player.vy = 0;
    player.vx = 0;  
    player.ax = tileWidth * 0.01;
    player.ay = tileHeight * 0.3;
    player.aax = tileWidth * 0.005;
    player.image.src = "assets/img/lebombom1.png";
    player.image.onload = callback;
    console.log("Player initalzied");
}

export function updatePlayer(deltaTime) {
    const equalizer = deltaTime * 0.1;
    // Apply gravity to the vertical
    player.vy += gravity * equalizer;
    // Apply friction to the horizontal
    if(onGround) player.vx *= friction;
    else player.vx *= airResistance;
    

    // Update player velocity based on key states
    playerMovement();

    // Update player position
    player.y += player.vy * equalizer;
    player.x += player.vx * equalizer;
    onGround = false;
    //check collision with screen bounds
    checkPlayerBounds();
    //check collision with map elements
    checkMapCollision();

    updateCameraPosition(player.x, player.y);
}

function checkPlayerBounds() {
    //TODO: fix the function so its compatible with the new map
    console.log("Player y: ", player.y)
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height; 
        player.vy = 0;
        onGround = true;
    } 
    if (player.y < 0) {
        player.y = 0; 
        player.vy = 0;
    }
    if (player.x < 0) {
        player.x = 0;
        player.vx = -player.vx;
    }
    if (player.x > limitX - player.width) {
        player.x = limitX - player.width;
        player.vx = -player.vx;
    }
}
function checkMapCollision() {
    const mapTiles = MapModule.getMapTiles();
    mapTiles.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
            if (tile.type == 1) { 
               type1Collision(rowIndex, colIndex);
            }
        });
    });
}
function type1Collision(rowIndex, colIndex) {
    const tileY = rowIndex * tileHeight;
    const tileX = colIndex * tileWidth;
    // Check collision with bottom and top of a tile
    if (player.x + player.width > tileX && player.x < tileX + tileWidth) {
        // Check if the player is hitting the top of the block
        if (
            player.y + player.height > tileY &&
            player.y < tileY && //create a buffer to account for errors
            player.vy > 0 // Ensure player is falling
        ) {
            onGround = true;
            player.vy = 0;
            player.y = tileY - player.height; // Snap player to the top of the block
        }
        // Check if the player is hitting the bottom of the block
        else if (
            player.y < tileY + tileHeight &&
            player.y + player.height > tileY + tileHeight &&
            player.vy < 0 // Ensure player is moving upward
        ) {
            player.y = tileY + tileHeight; // Snap player below the block
            player.vy = 0; // Stop upward movement
        }
    }

    // Check collision with left and right side of a tile
    if (
        player.y + player.height > tileY &&
        player.y < tileY + tileHeight &&
        !(onGround && player.vy > 0) // Ignore when player is falling off the tile's side
    ) {
        // Left side collision
        if (player.x + player.width > tileX && player.x < tileX) {
            player.vx = 0;
            player.x = tileX - player.width;
        }
        // Right side collision
        else if (player.x < tileX + tileWidth && player.x + player.width > tileX + tileWidth) {
            player.vx = 0;
            player.x = tileX + tileWidth;
        }
    }
}

export function playerMovement() {
    if (keys.left) {
        if(onGround) player.vx -= player.ax;
        else player.vx -= player.aax;
    }
    if (keys.right) {
        if(onGround) player.vx += player.ax;
        else player.vx += player.aax;
    }
    if (keys.up && onGround) {
        player.vy -= player.ay;
    }
    if (keys.down) {
        player.vy += player.ay * 0.02;
    }
}

function keysDown(e) {
    switch(e.key) {
        case "ArrowLeft":
            keys.left = true;
            break;
        case "ArrowRight":
            keys.right = true;
            break;
        case "ArrowUp":
            keys.up = true;
            break;
        case "ArrowDown":
            keys.down = true;
            break;
    }
}

function keysUp(e) {
    switch(e.key) {
        case "ArrowLeft":
            keys.left = false;
            break;
        case "ArrowRight":
            keys.right = false;
            break;
        case "ArrowUp":
            keys.up = false;
            break;
        case "ArrowDown":
            keys.down = false;
            break;
    }
}

export function getSpawnCoords(){
    return [spawnX, spawnY];
}

//event listener for player movement
document.addEventListener("keydown", keysDown);
document.addEventListener("keyup", keysUp);
