import { getMapDimension, getTileDimension } from "./map.js";
import { canvas } from "./main.js";

const camera = {
    x: 0,
    y: 0,
}

let limitX, limitY;
let tileWidth, tileHeight;

export function initCamera(){
    camera.x = 0;
    camera.y = 0;
    [tileWidth, tileHeight] = getTileDimension();   
    console.log("camera initialzied");
}

export function getCameraPosition(){
    return [camera.x,camera.y];
}

export function updateCameraX(x){
    [limitX, limitY] = getMapDimension();
    camera.x = x - canvas.width / 2; // Center horizontally
    if(camera.x < 0) camera.x = 0; 
    else if(camera.x > limitX - canvas.width) camera.x = limitX - canvas.width;
}
export function updateCameraY(y){
    [limitX, limitY] = getMapDimension();
    camera.y = y - canvas.height / 2; // Center vertically
    if(camera.y < 0) camera.y = 0;
    else if(camera.y > limitY - canvas.height) camera.y = limitY - canvas.height;
}