import { getMapDimension, getMapTiles } from "./map.js";
let [limitX, limitY] = [0, 0]; 
export function initCollision(){
    [limitX, limitY] = getMapDimension();
    console.log("Collision initalzied");
}

export function checkEntityBounds(entity) {
    if (entity.y + entity.height > limitY) {
        entity.state.onGround = true;
        entity.state.collidingBot = true;
    } 
    if (entity.y < 0) {
        entity.state.collidingTop = true;
    }
    if (entity.x < 0) {
        entity,state.collidingLeft = true;
    }
    if (entity.x > limitX - entity.width) {
        entity.state.collidingRight = true;
    }
    handleCollsionState(entity);
}

export function checkEntityTileCollision(entity, tile) {
    // Vertical collision
    if (entity.x + entity.width > tile.x && entity.x < tile.x + tile.width) {
        if (entity.y + entity.height > tile.y && entity.y < tile.y && entity.vy > 0) {
            entity.state.collidingTop = true;
            entity.state.onGround = true;
        } else if (entity.y < tile.y + tile.height && entity.y + entity.height > tile.y + tile.height && entity.vy < 0) {
            entity.state.collidingBot = true;
        }
    }

    // Horizontal collision
    if (entity.y + entity.height > tile.y && entity.y < tile.y + tile.height) {
        if (entity.x + entity.width > tile.x && entity.x < tile.x) {
            entity.state.collidingLeft = true;
        } else if (entity.x < tile.x + tile.width && entity.x + entity.width > tile.x + tile.width) {
            entity.state.collidingRight = true;
        }
    }
}

export function checkMapCollision(entity) {
    const mapTiles = getMapTiles();
    let collisionDetected = false;
    mapTiles.forEach((row) => {
        row.forEach((tile) => {
            if (!tile.solid) return;
            clearCollisionState(entity);  
            checkEntityTileCollision(entity, tile);
            handleCollsionState(entity, tile);
            if (collisionDetected) return;
        });
        if (collisionDetected) return;
    });
}

export function handleCollsionState(entity, tile) {
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

function clearCollisionState(entity) {
    entity.state.collidingLeft = false;
    entity.state.collidingRight = false;
    entity.state.collidingTop = false;
    entity.state.collidingBot = false;
}

