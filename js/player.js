import * as MapModule from "./map.js";
import { gravity, friction, airResistance } from "./main.js";
import { checkPlayerTileCollision, checkPlayerBounds } from "./collison.js";
import { updateCameraX, updateCameraY } from "./camera.js";
let onGround, tileWidth, tileHeight;

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

const state = {
    onGround: false
};


export function initPlayer(callback) {
    [tileWidth, tileHeight] = MapModule.getTileDimension();
    player.x = 0; 
    player.y = 0;
    player.width = tileHeight;
    player.height = tileHeight; //if the player size gets higher than the tile the collision breaks
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
    if(state.onGround) player.vx *= friction;
    else player.vx *= airResistance;
    
    // Update player velocity based on key states
    playerMovement();

    // Update player position
    player.y += player.vy * equalizer;
    player.x += player.vx * equalizer;
    state.onGround = false;

    //check collision with screen bounds
    checkPlayerBounds(player, state);
    //check collision with map elements
    checkMapCollision();

    updateCameraY(player.y);
    updateCameraX(player.x);
}

function checkMapCollision() {
    //TODO: fix the side collision triggering when the player is coming from to bottom of the tile and split it into another file
    const mapTiles = MapModule.getMapTiles();
    mapTiles.forEach((row) => {
        row.forEach((tile) => {
            if(!tile.solid) return;
            checkPlayerTileCollision(player, tile, state)
            if (tile.type == 1) { 
            }
        });
    });
}

export function playerMovement() {
    if (keys.left) {
        if(state.onGround) player.vx -= player.ax;
        else player.vx -= player.aax;
    }
    if (keys.right) {
        if(state.onGround) player.vx += player.ax;
        else player.vx += player.aax;
    }
    if (keys.up && state.onGround) {
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


//event listener for player movement
document.addEventListener("keydown", keysDown);
document.addEventListener("keyup", keysUp);
