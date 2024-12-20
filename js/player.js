import * as MapModule from "./map.js";

let canvas, gravity, airRes, friction, ax, ay, onGround, aax;
const [tileWidth, tileHeight] = MapModule.getTileDimension();

export const player = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    vy: 0,
    vx: 0,
    image: new Image()
};

const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};



export function initPlayer(c, g, f, ar ,accelerationx, accelerationy, airaccelearionx, callback) {
    canvas = c;
    gravity = g;
    friction = f;
    airRes = ar;
    aax = airaccelearionx;
    ax = accelerationx;
    ay = accelerationy;
    player.x = canvas.width / 2;
    player.y = 0;
    player.width = 50;
    player.height = 50;
    player.vy = 0;
    player.vx = 0;
    player.image.src = "assets/img/lebombom1.png";
    player.image.onload = callback;
}

export function updatePlayer(deltaTime) {
    const equalizer = deltaTime * 0.1;
    // Apply gravity to the vertical
    player.vy += gravity * equalizer;
    // Apply friction to the horizontal
    if(onGround) player.vx *= friction;
    else player.vx *= airRes ;
    

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
}

function checkPlayerBounds() {
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height; 
        player.vy = 0;
        if(!onGround) onGround = true;
    } 
    if (player.y < 0) {
        player.y = 0; 
        player.vy = -player.vy;
    }
    if (player.x < 0) {
        player.x = 0;
        player.vx = -player.vx;
    }
    if (player.x > canvas.width - player.width) {
        player.x = canvas.width - player.width;
        player.vx = -player.vx;
    }
}
function checkMapCollision() {
    const mapTiles = MapModule.getMapTiles();
    mapTiles.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
            if (tile.type == 1) { 
                const tileX = colIndex * tileWidth;
                const tileY = rowIndex * tileHeight;
                if (player.x + player.width > tileX && player.x < tileX + tileWidth) {
                    // Check if the player is hitting the top of the block
                    if (player.y + player.height > tileY && player.y < tileY) {
                        //player bottom lower than tile height and player top higher than tile top
                        onGround = true;
                        player.vy = 0;
                        player.y = tileY - player.height; // Snap player to the top of the block
                    }
                    // Check if the player is hitting the bottom of the block
                    else if (player.y < tileY + tileHeight && player.y + player.height > tileY + tileHeight && player.vy < 0) {
                        // Player's top is above tile's bottom, player's bottom is below tile's bottom, and player is moving upward
                        player.y = tileY + tileHeight; // Snap player below the block
                        player.vy = 0; // Stop upward movement
                    }
                }
                
            }
        });
    });
}

export function playerMovement() {
    if (keys.left) {
        if(onGround) player.vx -= ax;
        else player.vx -= aax;
    }
    if (keys.right) {
        if(onGround) player.vx += ax;
        else player.vx += aax;
    }
    if (keys.up && onGround) {
        player.vy -= ay;
    }
    if (keys.down) {
        player.vy += ay * 0.02;
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
