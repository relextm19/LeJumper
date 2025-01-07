import { checkMapCollision, checkScreenBounds } from "./collison.js";
import { getTileDimension, getMapTiles } from "./map.js";
import { updateEntityPosition, applyResistanceForces } from "./physics.js";
import { enemies } from "./gameState.js";

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
    },
    hp: 0
};

let tileWidth = 0;
let tileHeight = 0;

export function initTurtleEnemy(x, y) {
    [tileWidth, tileHeight] = getTileDimension();
    turtleEnemy.x = x; 
    turtleEnemy.y = y;
    turtleEnemy.width = tileHeight - 3;
    turtleEnemy.height = tileHeight - 3; 
    turtleEnemy.vy = 0;
    turtleEnemy.vx = 0;  
    turtleEnemy.ax = tileWidth * 0.01;
    turtleEnemy.ay = tileHeight * 0.3;
    turtleEnemy.aax = tileWidth * 0.005;
    turtleEnemy.hp = 1;
    turtleEnemy.image.src = "assets/img/russel.png";
    console.log("turtleEnemy initalzied");
    enemies.push(turtleEnemy);
}

export function updateTurtleEnemy(entity, deltaTime) {
    const equalizer = deltaTime * 0.1;
    entity.vx = 1 * entity.state.direction;
    applyResistanceForces(entity, equalizer);
    updateEntityPosition(entity, equalizer);
    checkScreenBounds(entity);
    checkMapCollision(entity, onCollision);
}

export function enemyTakeDamage(amount){
    turtleEnemy.hp -= amount;
    if(turtleEnemy.hp <= 0) {
        turtleEnemy.hp = 0;
        //remove enemy from the game
        const index = enemies.indexOf(turtleEnemy);
        if (index > -1) {
            enemies.splice(index, 1);
        }
    }
}

function changeDirection(entity) {
    entity.state.direction *= -1;
    entity.x += entity.state.direction; // move away from the wall to avoid multiple detections 
}

function onCollision(entity, tile){
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
        changeDirection(entity);
    } else if (entity.state.collidingRight) {
        entity.vx = 0;
        entity.x = tile.x + tile.width;
        changeDirection(entity);
    }
    if(isAboutToFall(entity)) changeDirection(entity);
}

function isAboutToFall(entity){
    if(!entity.state.onGround) return false;
    
    const nextTileX = entity.vx > 0 ? Math.floor((entity.x + entity.width) / tileWidth) : Math.floor(entity.x / tileWidth); // mmm
    const belowTileY = Math.floor((entity.y + entity.height) / tileHeight);
    const mapTiles = getMapTiles(); 

    if (belowTileY < 0 || belowTileY >= mapTiles.length || nextTileX < 0 || nextTileX >= mapTiles[0].length) return false; // i dont care if the enemy is out of bounds but the check is necesary to avoid accesing undefined tiles
    if(!mapTiles[belowTileY][nextTileX].solid) return true;
    
    return false;
}