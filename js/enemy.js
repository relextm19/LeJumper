import { checkMapCollision } from "./collison.js";
import { getTileDimension } from "./map.js";
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
    turtleEnemy.x = tileWidth; 
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
    checkMapCollision(turtleEnemy, onCollision);
}

function changeDirection() {
    turtleEnemy.state.direction *= -1;
}

function isDirectionChangedNeeded(entity){
    /* we need to change the direction when:
    we colide horizontally
    we would drop of a tile which can be indicated by:
        the tile we are on has no next tile and we are aproaching its edge
    */
    if(turtleEnemy.state.collidingBot || turtleEnemy.state.collidingTop || turtleEnemy.state.collidingLeft || turtleEnemy.state.collidingRight) console.log(turtleEnemy.state); 
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
        changeDirection();
    } else if (entity.state.collidingRight) {
        entity.vx = 0;
        entity.x = tile.x + tile.width;
        changeDirection();
    }
}