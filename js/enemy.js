import { checkMapCollision, checkScreenBounds } from "./collison.js";
import { getTileDimension, getMapTiles } from "./map.js";
import { updateEntityPosition, applyResistanceForces } from "./physics.js";

export const turtleEnemy = {
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
        collidingRight: false,
        direction: 1 //1 is to the right and -1 to the left
    }
};

let tileWidth = 0;
let tileHeight = 0;

export function initTurtleEnemy() {
    [tileWidth, tileHeight] = getTileDimension();
    turtleEnemy.x = tileWidth * 8; 
    turtleEnemy.y = 0;
    turtleEnemy.width = tileHeight - 10;
    turtleEnemy.height = tileHeight - 10; 
    turtleEnemy.vy = 0;
    turtleEnemy.vx = 0;  
    turtleEnemy.ax = tileWidth * 0.01;
    turtleEnemy.ay = tileHeight * 0.3;
    turtleEnemy.aax = tileWidth * 0.005;
    turtleEnemy.image.src = "assets/img/russel.png";
    console.log("turtleEnemy initalzied");
}

export function updateTurtleEnemy(deltaTime) {
    const equalizer = deltaTime * 0.1;
    turtleEnemy.vx = 1 * turtleEnemy.state.direction;
    applyResistanceForces(turtleEnemy, equalizer);
    updateEntityPosition(turtleEnemy, equalizer);
    checkScreenBounds(turtleEnemy);
    checkMapCollision(turtleEnemy, onCollision);
}

function changeDirection() {
    turtleEnemy.state.direction *= -1;
    turtleEnemy.x += turtleEnemy.state.direction; // move away from the wall to avoid multiple detections 
}

function onCollision(entity, tile){ //TODO: change direction when about to fall of a tile
    //handle basic collision
    if (entity.state.collidingTop) {
        entity.vy = 0;
        entity.y = tile.y - entity.height;
        entity.state.onGround = true;
    } else if (entity.state.collidingBot) {
        entity.vy = 0;
        entity.y = tile.y + tile.height;
    }
    //change direction when colliding horizontally
    else if (entity.state.collidingLeft) {
        entity.vx = 0;
        entity.x = tile.x - entity.width;
        changeDirection();
    } else if (entity.state.collidingRight) {
        entity.vx = 0;
        entity.x = tile.x + tile.width;
        changeDirection();
    }
    if(isAboutToFall(entity)) changeDirection();
}

function isAboutToFall(entity){
    if(!entity.state.onGround) return false;
    
    const nextTileX = entity.vx > 0 ? Math.floor((entity.x + entity.width) / tileWidth) : Math.floor(entity.x / tileWidth); // mmm
    const belowTileY = Math.floor((entity.y + entity.height) / tileHeight);
    const mapTiles = getMapTiles(); 

    if(nextTileX < 0 || nextTileX >= mapTiles[0].length) return true;
    if (belowTileY < 0 || belowTileY >= mapTiles.length) return true;
    if(!mapTiles[belowTileY][nextTileX].solid) return true;
    
    return false;
}