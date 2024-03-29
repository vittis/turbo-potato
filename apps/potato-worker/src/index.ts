import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { Game, UnitsDTO } from "../modules/game/game/Game";
import { Classes, Weapons } from "../modules/game/game/data";
import { nanoid } from "nanoid";
import { OWNER } from "../modules/game/game/BoardManager";

/* durable objects exports */
export { Counter } from "./counter";
export { Lobby } from "./lobby";
export { ChatRoom } from "./ChatRoom";

interface Env {
  COUNTER: DurableObjectNamespace;
  LOBBY: DurableObjectNamespace;
  CHAT_ROOM: DurableObjectNamespace;
}

const app = new Hono<{ Bindings: Env }>();

app.use("*", logger());
app.use("/game/*", cors());

app.get("/lobby/*", async (c) => {
  const id = c.env.LOBBY.idFromName("Lobby");
  const obj = c.env.LOBBY.get(id);
  return await obj.fetch(c.req);
});

app.get("/counter/*", async (c) => {
  console.log("kaskd");
  const id = c.env.COUNTER.idFromName("A");
  const obj = c.env.COUNTER.get(id);
  const resp = await obj.fetch(c.req.url);

  if (resp.status === 404) {
    return c.text("404 Not Found", 404);
  }

  const count = parseInt(await resp.text());
  return c.text(`Count is ${count}`);
});

app.get("/socket", async (c) => {
  const id = c.env.LOBBY.idFromName("Lobby");
  const obj = c.env.LOBBY.get(id);
  const resp = await obj.fetch(c.req);

  return resp;
});

app.get("/chat/global", async (c) => {
  const id = c.env.CHAT_ROOM.idFromName("global");
  const obj = c.env.CHAT_ROOM.get(id);
  const resp = await obj.fetch(c.req);

  return resp;
});

app.get("/game/battle/setup", async (c) => {
  const game = new Game();
  const { totalSteps, eventHistory, firstStep } = game.startGame();

  return c.json({
    firstStep,
    totalSteps,
    eventHistory,
  });
});

app.get("/game/setup/allStuff", async (c) => {
  const classes: string[] = [];
  Object.keys(Classes).forEach((key) => {
    classes.push(key);
  });
  const weapons: string[] = [];
  Object.keys(Weapons).forEach((key) => {
    weapons.push(key);
  });

  return c.json({
    classes: classes.map((c) => ({ id: nanoid(4), name: c })),
    weapons: weapons.map((w) => ({ id: nanoid(4), name: w })),
  });
});

app.post("/game/setup/teams", async (c) => {
  const { team1, team2 } = await c.req.json<{
    team1: UnitsDTO[];
    team2: UnitsDTO[];
  }>();

  const game = new Game({ skipConstructor: true });

  game.setTeam(OWNER.TEAM_ONE, team1 as UnitsDTO[]);
  game.setTeam(OWNER.TEAM_TWO, team2 as UnitsDTO[]);

  const { totalSteps, eventHistory, firstStep } = game.startGame();

  return c.json({
    firstStep,
    totalSteps,
    eventHistory,
  });
});

export default app;
