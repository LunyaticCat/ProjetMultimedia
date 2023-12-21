import * as engine from "./engine.js";

//Ball : Position,Velocity, BallTag,PhysicsTag, CollisionTag.
/**
 * The ball entity.
 *
 * Position
 * @param {int} x - the x position.
 * @param {int} y - the y position.
 *
 * @param {int} w - the entity width.
 * @param {int} h - the entity height.
 * Velocity
 * @param {int} dx - velocity vector x coordinate.
 * @param {int} dy - velocity vector y coordinate.
 * @return gameObject
 */
function Ball(x, y, w, h, dx = 0, dy = 0) {
    const gameObj1 = engine.ecs.createEntity();
    engine.ecs.addComponent(gameObj1, engine.components.BallTag())
    engine.ecs.addComponent(gameObj1, engine.components.PhysicsTag());
    engine.ecs.addComponent(gameObj1, engine.components.PositionComponent(x, y, 1));
    engine.ecs.addComponent(gameObj1, engine.components.VelocityComponent(dx, dy));
    engine.ecs.addComponent(gameObj1, engine.components.RenderableTag());
    engine.ecs.addComponent(gameObj1, engine.components.GraphicsComponent("rectangle", { w: w, h: h, color: 'random' }));
    engine.ecs.addComponent(gameObj1, engine.components.CollisionTag());
    engine.ecs.addComponent(gameObj1, engine.components.CollisionBoxComponent(w*.9, h*.9));
    engine.ecs.addComponent(gameObj1, engine.components.TransformationComponent([0, 0], 0, [0, 0]));
    return gameObj1;
}

/**
 * The paddle entity.
 *
 * Position
 * @param {int} x - the x position.
 * @param {int} y - the y position.
 *
 * @param {int} w - the entity width.
 * @param {int} h - the entity height.
 * @return gameObject
 */
function Paddle(x, y, w, h) {
    const gameObj1 = engine.ecs.createEntity();
    engine.ecs.addComponent(gameObj1, engine.components.RaquetteTag())
    engine.ecs.addComponent(gameObj1, engine.components.PhysicsTag());
    engine.ecs.addComponent(gameObj1, engine.components.PositionComponent(x, y, 0));
    engine.ecs.addComponent(gameObj1, engine.components.RenderableTag());
    engine.ecs.addComponent(gameObj1, engine.components.GraphicsComponent("rectangle", { w: w, h: h, color: '#834141' }));
    engine.ecs.addComponent(gameObj1, engine.components.CollisionTag());
    engine.ecs.addComponent(gameObj1, engine.components.CollisionBoxComponent(w, h));
    return gameObj1;

}

/**
 * The brick entity.
 *
 * Position
 * @param {int} x - the x position.
 * @param {int} y - the y position.
 *
 * @param {int} w - the entity width.
 * @param {int} h - the entity height.
 * @return gameObject
 */
function Brick(x, y, w, h) {
    const gameObj1 = engine.ecs.createEntity();
    engine.ecs.addComponent(gameObj1, engine.components.BriqueTag())
    engine.ecs.addComponent(gameObj1, engine.components.PositionComponent(x, y, 0));
    engine.ecs.addComponent(gameObj1, engine.components.RenderableTag());
    engine.ecs.addComponent(gameObj1, engine.components.GraphicsComponent("rectangle", { w: w, h: h, color: '#5e1f7e' }));
    engine.ecs.addComponent(gameObj1, engine.components.CollisionTag());
    engine.ecs.addComponent(gameObj1, engine.components.CollisionBoxComponent(w, h));
    return gameObj1;

}

/**
 * The wall entity.blue
 * @param {int} y - the y position.
 *
 * @param {int} w - the entity width.
 * @param {int} h - the entity height.
 * @return gameObject
 */
function Wall(x, y, w, h, defeatSide = false) {
    const gameObj1 = engine.ecs.createEntity();
    engine.ecs.addComponent(gameObj1, engine.components.MurTag())
    engine.ecs.addComponent(gameObj1, engine.components.PositionComponent(x, y, 0));
    engine.ecs.addComponent(gameObj1, engine.components.RenderableTag());
    engine.ecs.addComponent(gameObj1, engine.components.GraphicsComponent("rectangle", { w: w, h: h, color: '#4b0c39' }));
    engine.ecs.addComponent(gameObj1, engine.components.CollisionTag());
    engine.ecs.addComponent(gameObj1, engine.components.CollisionBoxComponent(w, h));
    engine.ecs.addComponent(gameObj1, engine.components.DyingSideComponent(defeatSide));
    return gameObj1;

}

/**
 * The paddle entity.
 *
 * @return gameObject
 */
function GameState() {
    const gameObj1 = engine.ecs.createEntity();
    engine.ecs.addComponent(gameObj1, engine.components.GameStateComponent());
    return gameObj1;

}


export { Ball, Paddle, Brick, Wall , GameState}