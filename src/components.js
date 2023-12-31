
/**
 * We define all components as functions. It's not constructor but return objects.
 */

const PositionComponent = (x, y, z,min_x=0,min_y=0,min_z=0,max_x=300,max_y=300,max_z=10) => ({ name: 'PositionComponent', x, y, z,min_x,min_y,min_z,max_x,max_y,max_z });
const GraphicsComponent = (shape, shapeInfo) => ({ name: 'GraphicsComponent', shape, shapeInfo });
const LifeComponent = (maxLife) => ({ name: "LifeComponent", maxLife, life });
const ScoreComponent = () => ({ name: "ScoreComponent", socre: 0 });

const GameStateComponent = (state) => ({ name: "GameStateComponent", state:'running', hits:0, leftControl: false, rightControl: false, life:3 });

const CollisionBoxComponent = (width, height) => ({ name: 'CollisionBoxComponent', width, height , hit:false});
const VelocityComponent = (dx, dy) => ({ name: 'VelocityComponent', dx, dy });
const TransformationComponent = (homothety=[1, 1], rotate=0, translation=[0, 0]) => ({name: 'TransformationComponent', homothety, rotate, translation});

const PhysicsTag = () => ({ name: 'PhysicsTag' });
const CollisionTag = () => ({ name: 'CollisionTag' });
const RenderableTag = () => ({ name: 'RenderableTag' });

const BallTag = () => ({ name: 'BallTag' });
const RaquetteTag = () => ({ name: 'RaquetteTag' });
const BriqueTag = () => ({ name: 'BriqueTag' });
const PiercingTag = () => ({ name: 'PiercingTag' });
const HypnoticTag = () => ({ name: 'HypnoticTag' });
const MurTag = () => ({ name: 'MurTag' });
const DyingSideComponent = (isHitable) => ({ name: 'DyingSideComponent', isHitable});

export { MurTag, BriqueTag, RaquetteTag, BallTag, PositionComponent, CollisionBoxComponent, VelocityComponent, 
    PhysicsTag, CollisionTag, RenderableTag, GraphicsComponent, LifeComponent, ScoreComponent, GameStateComponent,
    DyingSideComponent, TransformationComponent, PiercingTag, HypnoticTag }