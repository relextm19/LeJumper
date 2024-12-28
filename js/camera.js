import { getMapDimension } from "./map.js";
import { canvas } from "./main.js";

const camera = {
    x: 0,
    y: 0,
}
let limitX, limitY;
export function initCamera(){
    camera.x = 0;
    camera.y = 0;
    console.log("camera initialzied");
}

export function getCameraPosition(){
    return [camera.x,camera.y];
}

export function updateCameraPosition(x, y){
    [limitX, limitY] = getMapDimension();
    camera.x = x - limitX / 2; // Center horizontally
    camera.y = y - limitY / 2; // Center vertically
    if(camera.x < 0) camera.x = 0;
    else if(camera.x > limitX - canvas.width) camera.x = limitX - canvas.width;
    if(camera.y < 0) camera.y = 0;
    else if(camera.y > limitY + canvas.height) camera.y = limitY + canvas.height;
    console.log("Camera y: ", camera.y, "limit y / 2: ", limitY / 2)
}