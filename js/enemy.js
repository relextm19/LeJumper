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
        collidingRight: false
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
    applyResistanceForces(turtleEnemy, equalizer);
    updateEntityPosition(turtleEnemy, equalizer);
    checkMapCollision(turtleEnemy);
}
