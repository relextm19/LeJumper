import * as MapModule from "./map.js";
import { checkEntityTileCollision, checkEntityBounds } from "./collison.js";
import { updateCameraX, updateCameraY } from "./camera.js";
import { applyResistanceForces, updateEntityPosition } from "./physics.js";
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
    console.log("Player initialized");
}

export function updatePlayer(deltaTime) {
    const equalizer = deltaTime * 0.1;
    
    applyResistanceForces(player, equalizer, player.state);

    // Update player velocity based on key states
    playerMovement();
    updateEntityPosition(player, equalizer);    

    player.state.onGround = false;

    // Check collision with screen bounds
    checkEntityBounds(player, player.state);
    // Check collision with map elements
    checkMapCollision(); //FIXME: the player can't jump when he is running into a tile

    updateCameraY(player.y);
    updateCameraX(player.x);
}


function checkMapCollision() {
    const mapTiles = MapModule.getMapTiles();
    let collisionDetected = false;
    mapTiles.forEach((row) => {
        row.forEach((tile) => {
            if (!tile.solid) return;
            clearCollisionState();  
            checkEntityTileCollision(player, tile, player.state);
            if (player.state.collidingTop) {
                player.vy = 0;
                player.y = tile.y - player.height;
                player.state.onGround = true;
                collisionDetected = true;
            } else if (player.state.collidingBot && !player.state.onGround) {
                player.vy = 0;
                player.y = tile.y + tile.height;
                collisionDetected = true;
            } else if (player.state.collidingLeft) {
                player.vx = 0;
                player.x = tile.x - player.width;
                collisionDetected = true;
            } else if (player.state.collidingRight) {
                player.vx = 0;
                player.x = tile.x + tile.width;
                collisionDetected = true;
            }

            if (collisionDetected) return;
        });
        if (collisionDetected) return;
    });
}

function clearCollisionState() {
    player.state.collidingLeft = false;
    player.state.collidingRight = false;
    player.state.collidingTop = false;
    player.state.collidingBot = false;
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
        player.vy += player.ay * 0.02;
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