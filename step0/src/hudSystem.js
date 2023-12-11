import * as cpn from "./components.js";

const hudSystem = (entities, components, root) => {
    root.innerHTML = '';
    for (const stateEntity of Object.getOwnPropertySymbols(components[cpn.GameStateComponent.name])) {
        {
            let hits = components.GameStateComponent[stateEntity].hits ;
            let score = hits * 10 ; 
            if(components.GameStateComponent[stateEntity].state == 'running')
            {
            root.innerHTML = '<div id="gameHUD"> <div id="score"> Score :  '+ score +'</div> </div>';
            } 
            else if(components.GameStateComponent[stateEntity].state == 'gameover')
            {
            root.innerHTML = '<div id="gameHUD"> <div id="score"> Score :  '+ score +'</div> <div id="gameOver" >Game Over</div></div>';
                
            }
        }
    }
};


export { hudSystem }