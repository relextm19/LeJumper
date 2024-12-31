import { getMapDimension } from "./map.js";
let [limitX, limitY] = [0, 0]; 
export function initCollision(){
    [limitX, limitY] = getMapDimension();
    console.log("Collision initalzied");
}
export function checkEntityBounds(entity, state) {
    if (entity.y + entity.height > limitY) {
        entity.y = limitY - entity.height; 
        entity.vy = 0;
        state.onGround = true;
    } 
    if (entity.y < 0) {
        entity.y = 0; 
        entity.vy = 0;
    }
    if (entity.x < 0) {
        entity.x = 0;
        entity.vx = -entity.vx;
    }
    if (entity.x > limitX - entity.width) {
        entity.x = limitX - entity.width;
        entity.vx = -entity.vx;
    }
}
export function checkEntityTileCollision(entity, tile, state) {
    // Vertical collision
    if (entity.x + entity.width > tile.x && entity.x < tile.x + tile.width) {
        if (entity.y + entity.height > tile.y && entity.y < tile.y && entity.vy > 0) {
            state.collidingTop = true;
        } else if (entity.y < tile.y + tile.height && entity.y + entity.height > tile.y + tile.height && entity.vy < 0) {
            state.collidingBot = true;
        }
    }

    // Horizontal collision
    if (entity.y + entity.height > tile.y && entity.y < tile.y + tile.height) {
        if (entity.x + entity.width > tile.x && entity.x < tile.x) {
            state.collidingLeft = true;
        } else if (entity.x < tile.x + tile.width && entity.x + entity.width > tile.x + tile.width) {
            state.collidingRight = true;
        }
    }
}