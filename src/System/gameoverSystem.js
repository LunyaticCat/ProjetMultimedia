import * as cpn from "../components.js";

const gameoverSystem = (entities, components, ecs,max) => {

    for (const stateEntity of Object.getOwnPropertySymbols(components[cpn.GameStateComponent.name])) {
        {
            if(components.GameStateComponent[stateEntity].hits >= max ||
                components.GameStateComponent[stateEntity].life <=0){
                ecs.eventEmitter.emit('gameover');
            }
        }
    }
};


export { gameoverSystem }