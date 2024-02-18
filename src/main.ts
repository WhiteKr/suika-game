import { Bodies, Body, Engine, Events, Render, Runner, World } from "matter-js";
import { FRUITS, Fruit } from "./fruits";

// setup world
const [worldHeight, worldWidth]: number[] = [850, 620];
const worldBackgroundColor: string = "#F7F4C8";

const engine: Engine = Engine.create();
const render: Render = Render.create({
  engine,
  element: document.body,
  options: {
    background: worldBackgroundColor,
    height: worldHeight,
    width: worldWidth,
    wireframes: false,
  },
});
const world: World = engine.world;

// setup wall
const wallBackgroundColor: string = "#E6B143";
const wallWidth: number = 10;
const groundWidth: number = 20;
const topLinePosition: number = 130;

const wallPositions: [number, number, number, number, boolean?][] = [
  [wallWidth / 2, worldHeight / 2, wallWidth, worldHeight], // left wall
  [worldWidth - wallWidth / 2, worldHeight / 2, wallWidth, worldHeight], // right wall
  [worldWidth / 2, worldHeight - groundWidth / 2, worldWidth, groundWidth], // ground
  [worldWidth / 2, topLinePosition, worldWidth, 2, true], // top line
];
const walls: Matter.Body[] = wallPositions.map((pos) =>
  Bodies.rectangle(pos[0], pos[1], pos[2], pos[3], {
    isStatic: true,
    isSensor: pos[4] ?? false,
    render: { fillStyle: wallBackgroundColor },
  }),
);

World.add(world, walls);

Render.run(render);
Runner.run(engine);

let currentBody: Body | null = null;
let currentFruit: Fruit | null = null;
let disableAction: boolean = false;

const createFruitBody = (
  x: number,
  y: number,
  fruit: Fruit,
  isSleeping: boolean = false,
  isSensor: boolean = false,
): Body => {
  const body: Body = Bodies.circle(x, y, fruit.radius, {
    label: fruit.name,
    render: {
      sprite: {
        texture: `${fruit.name}.png`,
        xScale: fruit.scale,
        yScale: fruit.scale,
      },
    },
    restitution: 0.2,
    isSleeping,
    isSensor,
  });

  return body;
};

/**
 * Add a random fruit to the world.
 **/
const addFruit = (): void => {
  const index: number = (Math.random() * Math.min(FRUITS.length / 3, 5)) | 0;
  const fruit: Fruit = FRUITS[index];

  const body: Body = createFruitBody(300, 50, fruit, true);

  currentBody = body;
  currentFruit = fruit;

  World.add(world, body);
};

// setup controls
window.onkeydown = (event) => {
  if (currentBody === null) return;
  if (disableAction) return;

  switch (event.code) {
    case "KeyA":
      if (currentBody.position.x - (currentFruit?.radius ?? 0) > wallWidth)
        Body.setPosition(currentBody, {
          x: currentBody.position.x - 10,
          y: currentBody.position.y,
        });
      break;

    case "KeyD":
      if (
        currentBody.position.x + (currentFruit?.radius ?? 0) <
        worldWidth - wallWidth
      )
        Body.setPosition(currentBody, {
          x: currentBody.position.x + 10,
          y: currentBody.position.y,
        });
      break;

    case "KeyS":
      currentBody.isSleeping = false;
      disableAction = true;

      setTimeout(() => {
        addFruit();
        disableAction = false;
      }, 1000);
      break;
  }
};

// setup on collision event
Events.on(engine, "collisionStart", (event: Matter.IEventCollision<Engine>) => {
  event.pairs.forEach((collision) => {
    if (collision.bodyA.label !== collision.bodyB.label) return;

    const index: number = FRUITS.findIndex((fruit: Fruit) => {
      return fruit.name === collision.bodyA.label;
    });
    if (index === FRUITS.length - 1) return;

    World.remove(world, [collision.bodyA, collision.bodyB]);

    const newFruit: Fruit = FRUITS[index + 1];
    const newBody: Body = createFruitBody(
      collision.collision.supports[0].x,
      collision.collision.supports[0].y,
      newFruit,
    );

    World.add(world, newBody);
  });
});

addFruit();
