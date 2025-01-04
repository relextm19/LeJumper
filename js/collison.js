import { enities } from "./gameState.js";
import { getMapDimension, getMapTiles } from "./map.js";
let [limitX, limitY] = [0, 0]; 
export function initCollision(){
    [limitX, limitY] = getMapDimension();
    console.log("Collision initalzied");
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

export function checkMapCollision(entity, onCollision) {
    const mapTiles = getMapTiles();
    for (let row of mapTiles) {
        for (let tile of row) {
            if (!tile.solid) continue;
            clearCollisionState(entity);
            checkEntityTileCollision(entity, tile);
            onCollision(entity, tile);
        }
    }
}

function clearCollisionState(entity) {
    entity.state.collidingLeft = false;
    entity.state.collidingRight = false;
    entity.state.collidingTop = false;
    entity.state.collidingBot = false;
}

