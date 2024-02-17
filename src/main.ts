import { Bodies, Engine, Render, Runner, World } from "matter-js";
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

const addFruit = () => {
  const index: number = (Math.random() * 5) | 0;
  const fruit: Fruit = FRUITS[index];

  const body = Bodies.circle(300, 50, fruit.radius, {
    // index,
    label: fruit.name,
    restitution: 0.2,
    render: {
      fillStyle: fruit.color,
    },
  });

  World.add(world, body);
};

addFruit();
