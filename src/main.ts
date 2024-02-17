import { Bodies, Engine, Render, Runner, World } from "matter-js";

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

const wallPositions: [number, number, number, number][] = [
  [wallWidth / 2, worldHeight / 2, wallWidth, worldHeight], // left wall
  [worldWidth - wallWidth / 2, worldHeight / 2, wallWidth, worldHeight], // right wall
  [worldWidth / 2, worldHeight - groundWidth / 2, worldWidth, groundWidth], // ground
  [worldWidth / 2, topLinePosition, worldWidth, 2], // top line
];
const walls: Matter.Body[] = wallPositions.map((pos: number[]) =>
  Bodies.rectangle(pos[0], pos[1], pos[2], pos[3], {
    isStatic: true,
    render: { fillStyle: wallBackgroundColor },
  }),
);

World.add(world, walls);

Render.run(render);
Runner.run(engine);
