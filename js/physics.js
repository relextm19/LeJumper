import { gravity, airResistance, friction } from "./main.js";

export function applyResistanceForces(entity, equalizer, state){
    // Apply gravity to the vertical
    entity.vy += gravity * equalizer;
    // Apply friction to the horizontal
    if(state.onGround) entity.vx *= Math.pow(friction, equalizer);
    else entity.vx *= Math.pow(airResistance, equalizer);
}
export function updateEntityPosition(entity, equalizer){
    entity.y += entity.vy * equalizer;
    entity.x += entity.vx * equalizer;
}