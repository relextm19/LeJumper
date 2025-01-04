import * as MapModule from "./map.js";
import { checkMapCollision, checkScreenBounds } from "./collison.js";
import { updateCameraX, updateCameraY } from "./camera.js";
import { applyResistanceForces, updateEntityPosition } from "./physics.js";
import { addEntity } from "./gameState.js";
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
    image: new Image(),
    state: {
        onGround: false,
        collidingTop: false,
        collidingBot: false,
        collidingLeft: false,
        collidingRight: false
    }
};

const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

export function initPlayer() {
    [tileWidth, tileHeight] = MapModule.getTileDimension();
    player.x = tileWidth; 
    player.y = 0;
    player.width = tileHeight - 10;
    player.height = tileHeight - 10; //if the player size gets higher than the tile the collision breaks
    player.vy = 0;
    player.vx = 0;  
    player.ax = tileWidth * 0.01;
    player.ay = tileHeight * 0.3;
    player.aax = tileWidth * 0.005;
    player.image.src = "assets/img/lebombom1.png";
    console.log("Player initialized");
    addEntity(player);
}

export function updatePlayer(deltaTime) {
    const equalizer = deltaTime * 0.1;
    
    applyResistanceForces(player, equalizer);

    // Update player velocity based on key states
    playerMovement();
    updateEntityPosition(player, equalizer);    

    player.state.onGround = false;

    checkScreenBounds(player);
    checkMapCollision(player, onCollision); //FIXME: the player can't jump when he is running into a tile

    updateCameraY(player.y);
    updateCameraX(player.x);
}

export function playerMovement() {
    if (keys.left) {
        if (player.state.onGround) player.vx -= player.ax;
        else player.vx -= player.aax;
    }
    if (keys.right) {
        if (player.state.onGround) player.vx += player.ax;
        else player.vx += player.aax;
    }
    if (keys.up && player.state.onGround) {
        player.vy -= player.ay;
    }
    if (keys.down) {
        player.vy += player.ay * 0.1;
    }
}

export function onCollision(entity, tile) {
    if (entity.state.collidingTop) {
        entity.vy = 0;
        entity.y = tile.y - entity.height;
        entity.state.onGround = true;
    } else if (entity.state.collidingBot) {
        entity.vy = 0;
        entity.y = tile.y + tile.height;
    } else if (entity.state.collidingLeft) {
        entity.vx = 0;
        entity.x = tile.x - entity.width;
    } else if (entity.state.collidingRight) {
        entity.vx = 0;
        entity.x = tile.x + tile.width;
    }
}

function keysDown(e) {
    switch (e.key) {
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
    switch (e.key) {
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

// Event listener for player movement
document.addEventListener("keydown", keysDown);
document.addEventListener("keyup", keysUp);