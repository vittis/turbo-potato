import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { WebSocketServer, WebSocket } from "ws";
import type { Server as HTTPSServer } from "node:http";
import { connectRedis, redisClient, redisSub } from "./redis";
import { logger } from "hono/logger";
import {
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie,
  deleteCookie,
} from "hono/cookie";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { nanoid } from "nanoid";
import { EntityData, EntityId, Schema, Repository } from "redis-om";

interface Room {
  id: string;
  creatorId: string;
  name: string;
  members: string[];
}

const roomSchema = new Schema("room", {
  id: { type: "string" },
  creatorId: { type: "string" },
  name: { type: "string" },
  members: { type: "string[]" },
  capacity: { type: "number" },
  createdAt: { type: "date", sortable: true },
});

const roomRepository = new Repository(roomSchema, redisClient);

type Variables = {
  session: any;
};

const APPID = process.env.APPID;
const PORT = 8080;

const app = new Hono<{ Variables: Variables }>();

app.use("*", prettyJSON()); // With options: prettyJSON({ space: 4 })

app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("*", logger());
const wsConnections: {
  socket: WebSocket;
  userId?: string;
  channels: string[];
}[] = [];

// attach session data middleware
app.use("/api/*", async (c, next) => {
  const sId = getCookie(c, "sId");

  if (!sId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Validate the session ID against the Redis store
  const sessionData = await redisClient.hGetAll(`session:${sId}`);

  if (Object.keys(sessionData).length === 0) {
    deleteCookie(c, "sId");
    return c.json({ error: "Invalid session ID" }, 401);
  }

  // Attach session data to the request for later use
  c.set("session", { id: sId, ...sessionData });
  await next();
});

app.post("/login", async (c) => {
  // You would typically validate user credentials here
  let randomUserId = Math.floor(Math.random() * 1000);
  const userData = {
    name: `John-${randomUserId}`,
    userId: randomUserId,
  };

  const sId = getCookie(c, "sId");

  if (sId) {
    const sessionData = await redisClient.hGetAll(`session:${sId}`);

    if (Object.keys(sessionData).length > 0) {
      return c.json({ message: "You are already logged in" }, 500);
    }
  }

  // Create a session
  const sessionId = Math.floor(Math.random() * 1000).toString();
  redisClient.hSet(`session:${sessionId}`, userData);

  // Set the session ID as a cookie
  setCookie(c, "sId", sessionId, {
    httpOnly: true,
    sameSite: "Lax",
    secure: false,
  });

  return c.json({ ok: true });
});

app.post("/logout", async (c) => {
  const sId = getCookie(c, "sId");

  if (!sId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Delete the session from Redis
  await redisClient.del(`session:${sId}`);

  // Delete the session ID cookie
  deleteCookie(c, "sId");

  return c.json({ ok: true });
});

app.get("/api/chat/:channel", async (c) => {
  const channel = c.req.param("channel");
  const allMessages = await redisClient.lRange(
    `chat:${channel}:messages`,
    0,
    -1
  );

  return c.json({
    data: allMessages.map((m) => JSON.parse(m)),
  });
});

app.post("/api/rooms/:roomId/join", async (c) => {
  const roomId = c.req.param("roomId");
  const session = c.get("session");

  const room = await roomRepository.fetch(roomId);

  const userNumberOfRooms = await redisClient.sCard(
    `user_rooms:${session.userId}`
  );

  if (!room.id || !Array.isArray(room.members)) {
    return c.json({ error: "Room not found" }, 404);
  }

  if (userNumberOfRooms > 0) {
    return c.json({ error: "You are already in a room" }, 400);
  }

  room.members = [...room.members, session.userId];

  const updatedRoom = await roomRepository.save(room);

  redisClient.sAdd(`user_rooms:${session.userId}`, roomId);
  // todo publish user state

  redisClient.publish("update-room", JSON.stringify({ room: updatedRoom }));

  return c.json({ room: updatedRoom });
});

app.post("/api/rooms/:roomId/leave", async (c) => {
  const roomId = c.req.param("roomId");
  const session = c.get("session");

  const room = await roomRepository.fetch(roomId);

  const userNumberOfRooms = await redisClient.sCard(
    `user_rooms:${session.userId}`
  );
  if (!room.id || !Array.isArray(room.members)) {
    return c.json({ error: "Room not found" }, 404);
  }

  if (userNumberOfRooms === 0) {
    return c.json({ error: "You are not in a room" }, 400);
  }

  if (!room.members.includes(session.userId)) {
    return c.json({ error: "User is not a member of the room" }, 400);
  }

  const newMembers = room.members.filter((m) => m !== session.userId);

  if (newMembers.length === 0) {
    await roomRepository.remove(roomId);

    await redisClient.sRem(`user_rooms:${session.userId}`, roomId);
    // todo publish user state

    redisClient.publish("remove-room", JSON.stringify({ roomId }));

    return c.json({ ok: true });
  }

  room.members = newMembers;
  room.creatorId = room.members?.[0];

  const updatedRoom = await roomRepository.save(room);

  await redisClient.sRem(`user_rooms:${session.userId}`, roomId);
  // todo publish user state

  redisClient.publish("update-room", JSON.stringify({ room: updatedRoom }));

  return c.json({ room: updatedRoom });
});

app.post("/api/rooms/:roomId/remove", async (c) => {
  const session = c.get("session");

  const roomId = c.req.param("roomId");
  const room = await roomRepository.fetch(roomId);

  if (room.creatorId !== session.userId) {
    return c.json({ error: "You are not the room creator" }, 400);
  }

  await roomRepository.remove(roomId);

  redisClient.publish("remove-room", JSON.stringify({ roomId }));

  return c.json({ ok: true });
});

app.post("/api/rooms/create", async (c) => {
  const session = c.get("session");
  const body = await c.req.json();
  const { name, description, capacity } = body;

  const userNumberOfRooms = await redisClient.sCard(
    `user_rooms:${session.userId}`
  );

  if (userNumberOfRooms > 0) {
    return c.json({ error: "You are already in a room" }, 400);
  }

  const id = nanoid(8);

  const room = {
    id,
    name,
    creatorId: session.userId,
    members: [session.userId],
    capacity,
    description,
    createdAt: new Date(),
  };

  const savedRoom = await roomRepository.save(id, room);

  await redisClient.sAdd(`user_rooms:${session.userId}`, id);

  redisClient.publish("create-room", JSON.stringify({ room: savedRoom }));

  return c.json({ room: savedRoom });
});

app.get("/api/rooms", async (c) => {
  const rooms = await roomRepository
    .search()
    .sortDescending("createdAt")
    .return.all();

  const roomsWithIds = rooms.map((room) => ({
    id: room[EntityId],
    ...room,
  }));

  return c.json({ rooms: roomsWithIds });
});

app.post("/api/chat/:channel/:message", async (c) => {
  const channel = c.req.param("channel");
  const msg = c.req.param("message");
  const finalMsg = `${c.get("session").name}: ${msg}`;

  const session = c.get("session");
  console.log({ session });

  redisClient.rPush(
    `chat:${channel}:messages`,
    JSON.stringify({
      message: finalMsg,
      timestamp: Date.now(),
    })
  );

  await redisClient.publish(
    "live-chat",
    JSON.stringify({ message: finalMsg, channel })
  );

  return c.json({
    message: `published successfully by ${session.name} ${APPID}`,
  });
});

app.get("/api/me/profile", async (c) => {
  const session = c.get("session");

  return c.json({
    data: session,
  });
});

app.get("/api/me/rooms", async (c) => {
  const session = c.get("session");

  const rooms = await redisClient.sMembers(`user_rooms:${session.userId}`);

  return c.json({
    rooms,
  });
});

const connectAll = async () => {
  await connectRedis();

  try {
    await roomRepository.createIndex();
  } catch (error) {
    console.log(error);
  }

  await redisSub.subscribe("live-chat", (message) => {
    const parsedMessage = JSON.parse(message);
    console.log("live-chat new: ", parsedMessage);

    wsConnections.forEach((c) => {
      console.log(c.channels, parsedMessage.channel);
      if (!c.channels.includes(parsedMessage.channel)) return;
      console.log("sending to socket");
      c.socket.send(JSON.stringify(parsedMessage));
    });
  });

  await redisSub.subscribe("update-room", (message) => {
    const room: Room = JSON.parse(message).room;

    wsConnections.forEach((c) => {
      if (
        c.channels.includes(`rooms:${room.id}`) ||
        c.channels.includes(`global`)
      ) {
        c.socket.send(
          JSON.stringify({
            type: "room_updated",
            room,
          })
        );
      }
    });
  });

  await redisSub.subscribe("create-room", (message) => {
    const room: Room = JSON.parse(message)?.room;
    if (!room) {
      throw Error("no room to create");
    }

    wsConnections.forEach((c) => {
      if (c.channels.includes(`global`)) {
        c.socket.send(
          JSON.stringify({
            type: "room_created",
            room,
          })
        );
      }
    });
  });

  await redisSub.subscribe("remove-room", (message) => {
    const roomId: string = JSON.parse(message)?.roomId;
    if (!roomId) {
      throw Error("no room to remove");
    }

    wsConnections.forEach((c) => {
      if (c.channels.includes(`global`)) {
        c.socket.send(
          JSON.stringify({
            type: "room_removed",
            id: roomId,
          })
        );
      }
    });
  });

  /* await redisSub.subscribe("join-room", (message) => {
    const parsedMessage = JSON.parse(message);
    console.group(parsedMessage);

    console.log("here i am after join");
    wsConnections.forEach((c) => {
      console.log(c.userId, parsedMessage.userId);
      if (c.userId === parsedMessage.userId) {
        console.log("pushing the channel");
        c.channels.push(`rooms:${parsedMessage.roomId}`);

        redisClient.publish(
          "live-chat",
          JSON.stringify({
            message: `${parsedMessage.userId} joined room ${parsedMessage.roomId}`,
            channel: `rooms:${parsedMessage.roomId}`,
          })
        );
      }
    });
  }); */
};

connectAll().then(() => {
  const server = serve({ fetch: app.fetch, port: PORT }, (info) => {
    console.log(
      `${APPID} Listening on port ${info.port}  at ${info.address}: http://${info.address}:${info.port}. To access, check HAProxy config, probably http://${info.address}:8080`
    );
  });

  const wss = new WebSocketServer({ server: server as HTTPSServer });

  wss.on("connection", async (ws, req) => {
    console.log("connecting into: ", req.url);

    const urlParams = new URLSearchParams(req.url?.replace("/", "") || "");
    const paramsArray = [];

    const keys = urlParams.keys();
    let key = keys.next().value;
    while (key) {
      /* if (key !== "userId") {
        paramsArray.push(`${key}:${urlParams.get(key)}`);
      } */
      paramsArray.push(`${key}:${urlParams.get(key)}`);
      key = keys.next().value;
    }

    console.log("All parameters:", paramsArray);

    const userId = urlParams.get("userId");
    const name = urlParams.get("name");

    if (userId === null || name === null) {
      throw Error("Not all query param provided");
    }

    await redisClient
      .multi()
      .sAdd("online_users", userId)
      .hSet("online_users_data", userId, JSON.stringify({ id: userId, name }))
      .exec();

    ws.on("error", console.error);

    ws.on("message", (data) => {
      console.log("on message", data);
    });

    ws.on("close", () => {
      redisClient
        .multi()
        .sRem("online_users", userId)
        .hDel("online_users_data", userId)
        .exec();
    });
  });
});
