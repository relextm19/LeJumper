import { getMapDimension } from "./map.js";
let [limitX, limitY] = [0, 0]; 
export function initCollision(){
    [limitX, limitY] = getMapDimension();
    console.log("Collision initalzied");
}
export function checkPlayerBounds(player, state) {
    if (player.y + player.height > limitY) {
        player.y = limitY - player.height; 
        player.vy = 0;
        state.onGround = true;
    } 
    if (player.y < 0) {
        player.y = 0; 
        player.vy = 0;
    }
    if (player.x < 0) {
        player.x = 0;
        player.vx = -player.vx;
    }
    if (player.x > limitX - player.width) {
        player.x = limitX - player.width;
        player.vx = -player.vx;
    }
}
export function checkPlayerTileCollision(player, tile, state) {
    const collisionX = (player.x + player.width > tile.x && player.x < tile.x + tile.width);
    const collisionY = (player.y + player.height > tile.y && player.y < tile.y + tile.height);
    if (collisionY && collisionX) {
        if(player.y + player.height > tile.y && player.y < tile.y){ // top
            player.y = tile.y - player.height;
            player.vy = 0;
            state.onGround = true;
        }
        else if(player.y < tile.y + tile.height && player.y + player.height > tile.y + tile.height){ // bottom
            player.y = tile.y + tile.height;
            player.vy = 0;
        }

        if(player.x + player.width > tile.x && player.x < tile.x){ // left
            player.x = tile.x - player.width;
            player.vx = 0;
        } else if(player.x < tile.x + tile.width && player.x + player.width > tile.x + tile.width){ //right
            player.x = tile.x + tile.width;
            player.vx = 0;
        }
    }
}