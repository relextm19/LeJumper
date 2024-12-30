import * as MapModule from "./map.js";
import { gravity, friction, airResistance } from "./main.js";
import { checkPlayerTileCollision, checkPlayerBounds } from "./collison.js";
import { updateCameraX, updateCameraY } from "./camera.js";
let tileWidth, tileHeight;

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
    onGround: false,
    collidingTop: false,
    collidingBot: false,
    collidingLeft: false,
    collidingRight: false
};


export function initPlayer(callback) {
    [tileWidth, tileHeight] = MapModule.getTileDimension();
    player.x = 0; 
    player.y = 0;
    player.width = tileHeight - 10;
    player.height = tileHeight - 10; //if the player size gets higher than the tile the collision breaks
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
    
    applyResistanceForces(equalizer);

    // Update player velocity based on key states
    playerMovement();
    updatePlayerPosition(equalizer);

    state.onGround = false;

    //check collision with screen bounds
    checkPlayerBounds(player, state);
    //check collision with map elements
    checkMapCollision(); //FIXME: the player cant fucking jump when he is running into a tile

    updateCameraY(player.y);
    updateCameraX(player.x);
}

function applyResistanceForces(equalizer){
    // Apply gravity to the vertical
    player.vy += gravity * equalizer;
    // Apply friction to the horizontal
    if(state.onGround) player.vx *= Math.pow(friction, equalizer);
    else player.vx *= Math.pow(airResistance, equalizer);
}

function updatePlayerPosition(equalizer){
    player.y += player.vy * equalizer;
    player.x += player.vx * equalizer;
}

function checkMapCollision() {
    const mapTiles = MapModule.getMapTiles();
    let collisionDetected = false;
    mapTiles.forEach((row) => {
        row.forEach((tile) => {
            if (!tile.solid) return;
            clearCollisionState();
            checkPlayerTileCollision(player, tile, state);
            if (state.collidingTop) {
                player.vy = 0;
                player.y = tile.y - player.height;
                state.onGround = true;
                collisionDetected = true;
            } else if (state.collidingBot && !state.onGround) {
                player.vy = 0;
                player.y = tile.y + tile.height;
                collisionDetected = true;
            } else if (state.collidingLeft) {
                player.vx = 0;
                player.x = tile.x - player.width;
                collisionDetected = true;
            } else if (state.collidingRight) {
                player.vx = 0;
                player.x = tile.x + tile.width;
                collisionDetected = true;
            }

            if (collisionDetected) return true;
        });
    });
    return false;
}


function clearCollisionState() {
    state.collidingLeft = false;
    state.collidingRight = false;
    state.collidingTop = false;
    state.collidingBot = false;
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
