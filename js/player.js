let canvas, gravity, f, ax, ay;

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

export function initPlayer(c, g, friction, accelerationx, accelerationy, callback) {
    canvas = c;
    gravity = g;
    f = friction;
    ax = accelerationx;
    ay = accelerationy;
    player.x = canvas.width / 2;
    player.y = 0;
    player.width = 80;
    player.height = 80;
    player.vy = 0;
    player.vx = 0;
    player.image.src = "assets/img/lebombom.png";
    player.image.onload = callback;
}

export function updatePlayer() {
    // Apply gravity to the vertical
    player.vy += gravity;
    // Apply friction to the horizontal
    player.vx *= f;

    // Update player velocity based on key states
    playerMovement();

    // Update player position
    player.y += player.vy;
    player.x += player.vx;

    checkPlayerBounds();
}

function checkPlayerBounds(ox = 0, oy = 0) {
    if (player.y + oy + player.height > canvas.height) {
        player.y = canvas.height - player.height; 
        player.vy = 0;
    } 
    if (player.y - oy < 0) {
        player.y = 0; 
        player.vy = -player.vy;
    }
    if (player.x - ox < 0) {
        player.x = 0;
        player.vx = -player.vx;
    }
    if (player.x - ox > canvas.width - player.width) {
        player.x = canvas.width - player.width;
        player.vx = -player.vx;
    }
}

function onGround() {
    return player.y + player.height >= canvas.height;
}

export function playerMovement() {
    if (keys.left) {
        player.vx -= ax;
    }
    if (keys.right) {
        player.vx += ax;
    }
    if (keys.up && onGround()) {
        player.vy -= ay;
    }
    if (keys.down) {
        player.vy += ay;
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
