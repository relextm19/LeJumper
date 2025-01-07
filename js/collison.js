import { getMapDimension, getMapTiles } from "./map.js";
import { playerTakeDamage } from "./player.js";
import { enemyTakeDamage } from "./enemy.js";
let [limitX, limitY] = [0, 0]; 
export function initCollision(){
    [limitX, limitY] = getMapDimension();
    console.log("Collision initalzied");
}

export function checkScreenBounds(entity){
    if(entity.x < 0){
        entity.x = 0;
        entity.vx = 0;
    } 
    if(entity.x + entity.width > limitX){
        entity.x = limitX - entity.width;
        entity.vx = 0;
    } 
    if(entity.y < 0){
        entity.y = 0;
        entity.vy = 0;
    } 
    if(entity.y + entity.height > limitY) {
        entity.y = limitY - entity.height;
        entity.vy = 0;
        entity.state.onGround = true;
    }
}

export function checkEntityTileCollision(entity, tile) {
    // Vertical collision
    if (entity.x + entity.width > tile.x && entity.x < tile.x + tile.width) {
        if (entity.y + entity.height > tile.y && entity.y < tile.y && entity.vy > 0) {
            entity.state.collidingTop = true;
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

//i know i could try to modify player tile so it would be more universal but i lowkey dont care
export function playerEnemyCollision(player, enemy) {
     // Horizontal collision
     if (player.y + player.height > enemy.y && player.y < enemy.y + enemy.height) {
        if (player.x + player.width > enemy.x && player.x < enemy.x) {
            playerTakeDamage(1);
            player.x = enemy.x - player.width;
            player.vx *= -1;
        } else if (player.x < enemy.x + enemy.width && player.x + player.width > enemy.x + enemy.width) {
            playerTakeDamage(1);
            player.vx *= -1;
            player.x = enemy.x + enemy.width;
        }
    }

    // Vertical collision
    if (player.x + player.width > enemy.x && player.x < enemy.x + enemy.width) {
        if (player.y + player.height > enemy.y && player.y < enemy.y && player.vy > 0) {
            enemyTakeDamage(1);
            player.vy *= -1;
            player.y = enemy.y - player.height;
        } else if (player.y < enemy.y + enemy.height && player.y + player.height > enemy.y + enemy.height && player.vy < 0) {
            playerTakeDamage(1);
            player.y = enemy.y + enemy.height;
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

