import * as engine from "./engine.js";
import * as entitites from "./entities.js";
import * as cpn from "./components.js";



//hard coded scene...
function sceneSetup() {

    const wall01 = entitites.Wall(0, 0, 5, 350);
    const wall02 = entitites.Wall(345, 0, 5, 350);
    const wall03 = entitites.Wall(0, 0, 350, 5);
    const wall04 = entitites.Wall(0, 350, 350, 5, true);

    const ball = entitites.Ball(150, 150, 10, 10, 0.1, 0.05);
    const paddle = entitites.Paddle(0, 300, 50, 10);
    let offsetx = 25;
    let offsety = 10;
    let deltax = 70;
    let deltay = 30;
    for (let i = 0; i < 5; i++)
        for (let j = 0; j < 5; j++) {
            let br;
            if ((j===0 && i === 0) || (i === 4 && j === 0))  br = entitites.PiercingBuffBrick(offsetx + i * deltax, offsety + j * deltay, 20, 15);
            else if (j % 2 && i === 2) br = entitites.HypnoticBuffBrick(offsetx + i * deltax, offsety + j * deltay, 20, 15);
            else br = entitites.Brick(offsetx + i * deltax, offsety + j * deltay, 20, 15);
        }

    

}

window.onload = function () 
{
    engine.init("GLCanvas");
    
    const gameState = entitites.GameState();
    sceneSetup();


    engine.ecs.eventEmitter.on( 'leftDown', handleLeftDown);
    engine.ecs.eventEmitter.on( 'leftUp', handleLeftUp);
    engine.ecs.eventEmitter.on( 'rightDown', handleRightDown);
    engine.ecs.eventEmitter.on( 'rightUp', handleRightUp);
    engine.ecs.eventEmitter.on( 'hit', handleHit);
    engine.ecs.eventEmitter.on( 'gameover', handleGameover);
    engine.ecs.eventEmitter.on('looseLife', handleLooseLife)
    engine.ecs.playSound('src/Sounds/bgMusic.ogg', false);
    engine.update();
}


function handleHit(event)
{
    for (const state of Object.getOwnPropertySymbols(engine.ecs.components[cpn.GameStateComponent.name]))
    {
    engine.ecs.components.GameStateComponent[state].hits += 1;

    }
}

function handleLooseLife(event)
{
    for (const state of Object.getOwnPropertySymbols(engine.ecs.components[cpn.GameStateComponent.name]))
    {
        engine.ecs.components.GameStateComponent[state].life -= 1;
    }
}


function handleGameover(event)
{
    for (const state of Object.getOwnPropertySymbols(engine.ecs.components[cpn.GameStateComponent.name]))
    {
    engine.ecs.components.GameStateComponent[state].state = 'gameover';
    engine.ecs.isRunning = false;    
    }
}

function handleLeftDown(event)
{
    for (const state of Object.getOwnPropertySymbols(engine.ecs.components[cpn.GameStateComponent.name]))
    {
    engine.ecs.components.GameStateComponent[state].leftControl = true;
    }

}

function handleLeftUp(event)
{
    for (const state of Object.getOwnPropertySymbols(engine.ecs.components[cpn.GameStateComponent.name]))
    {
    engine.ecs.components.GameStateComponent[state].leftControl = false;
    }

}

function handleRightUp(event)
{
    for (const state of Object.getOwnPropertySymbols(engine.ecs.components[cpn.GameStateComponent.name]))
    {
    engine.ecs.components.GameStateComponent[state].rightControl = false;
    }
}

function handleRightDown(event)
{
    for (const state of Object.getOwnPropertySymbols(engine.ecs.components[cpn.GameStateComponent.name]))
    {
    engine.ecs.components.GameStateComponent[state].rightControl = true;
    }
    
}