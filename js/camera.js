import { canvas } from "./main.js";
const camera = {
    x: 0,
    y: 0,
}

export function initCamera(){
    camera.x = 0;
    camera.y = 0;
}

export function getCameraPosition(){
    return [camera.x,camera.y];
}

export function updateCameraPosition(x, y){
    camera.x = x - canvas.width / 2; // Center horizontally
    camera.y = y - canvas.height / 2; // Center vertically
    if(camera.x < 0) camera.x = 0;
    else if(camera.x > canvas.width) camera.x = canvas.width;
    if(camera.y < 0) camera.y = 0;
    else if(camera.y > canvas.height) camera.y = canvas.height;
    console.log(`Camera Position: (${camera.x}, ${camera.y})`);
}