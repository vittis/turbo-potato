import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { WebSocketServer, WebSocket } from "ws";
import type { Server as HTTPSServer } from "node:http";
import { connectRedis, redisClient, redisSub } from "./redis";
import { logger } from "hono/logger";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import rooms, { Room, RoomRepository } from "./controllers/rooms/roomsRoutes";
import { uniqueNamesGenerator, starWars } from "unique-names-generator";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";

const saltRounds = 10;

export type Variables = {
  session: any;
};

const APPID = process.env.APPID;
const PORT = process.env.PORT || 8080;

const SECRET_KEY: Secret = "potato";

interface CustomRequest extends Request {
  token: string | JwtPayload;
}

const supabase = createClient(
  "https://kkvhdzvbelevktmrjwsg.supabase.co",
  process.env.SUPABASE_KEY
);

const app = new Hono<{ Variables: Variables }>();

app.use("*", prettyJSON()); // With options: prettyJSON({ space: 4 })

app.use(
  "*",
  cors({
    /* origin: process.env.FRONTEND_URL || "", */
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/users", async (c, next) => {
  const { data, error } = await supabase.from("user").select();

  return c.json({ data });
});

app.post("/register", async (c, next) => {
  const body = await c.req.json();
  body.password = await bcrypt.hash(body.password, saltRounds);

  if (!body || !body.username || !body.password || !body.email) {
    return c.json({ error: "You need to provide all info" }, 422);
  }

  const { data, error } = await supabase
    .from("user")
    .select()
    .eq("username", body.username)
    .eq("email", body.email);

  if (data?.length != 0) {
    return c.json({ error: "Username or Email Already Registered" }, 422);
  }

  await supabase.from("user").insert({
    username: body.username,
    password: body.password,
    email: body.email,
  });

  return c.json("User Registered");
});

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

app.route("/", rooms);

app.post("/user/login", async (c) => {
  const body = await c.req.json();
  const { data, error } = await supabase
    .from("user")
    .select()
    .eq("email", body.email);
  //@ts-ignore
  let user;
  user = data?.pop();
  if (user) {
    /*     body.password = await bcrypt.hash(user.password, saltRounds);
     */
    const userPass = user.password;

    const isMatch = bcrypt.compareSync(body.password, userPass);
    if (isMatch) {
      const token = jwt.sign(
        { _id: user.uuid, name: user.username },
        SECRET_KEY,
        {
          expiresIn: "2 days",
        }
      );
      return c.json({ token });
    } else {
      return c.json({ error: "Incorrect password or login" }, 422);
    }
  }
});

app.post("/login", async (c) => {
  // You would typically validate user credentials here
  let randomUserId = Math.floor(Math.random() * 1000);
  const userData = {
    name: uniqueNamesGenerator({
      dictionaries: [starWars],
    }),
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
    sameSite: "None",
    secure: true,
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

app.post("/api/chat/:channel/:message", async (c) => {
  const channel = c.req.param("channel");
  const msg = c.req.param("message");
  const finalMsg = `${c.get("session").name}: ${msg}`;

  const session = c.get("session");

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

  /* try {
    await RoomRepository.createIndex();
  } catch (error) {
    console.log(error);
  } */

  await redisSub.subscribe("live-chat", (message) => {
    const parsedMessage = JSON.parse(message);
    console.log("live-chat new: ", parsedMessage);

    wsConnections.forEach((c) => {
      if (!c.channels.includes(parsedMessage.channel)) return;
      c.socket.send(JSON.stringify(parsedMessage));
    });
  });

  await redisSub.subscribe("lobby:update-room", (message) => {
    const room: Room = JSON.parse(message)?.room;
    if (!room) {
      console.log("no room to update");
      return;
    }

    wsConnections.forEach((c) => {
      if (c.channels.includes("lobby")) {
        c.socket.send(
          JSON.stringify({
            type: "room_updated",
            room,
          })
        );
      }
    });
  });

  await redisSub.subscribe("lobby:create-room", (message) => {
    const room: Room = JSON.parse(message)?.room;
    if (!room) {
      console.log("no room to create");
      return;
    }

    wsConnections.forEach((c) => {
      if (c.channels.includes("lobby")) {
        c.socket.send(
          JSON.stringify({
            type: "room_created",
            room,
          })
        );
      }
    });
  });

  await redisSub.subscribe("lobby:remove-room", (message) => {
    const roomId: string = JSON.parse(message)?.roomId;
    if (!roomId) {
      console.log("no room to remove");
      return;
    }

    wsConnections.forEach((c) => {
      if (c.channels.includes("lobby")) {
        c.socket.send(
          JSON.stringify({
            type: "room_removed",
            roomId: roomId,
          })
        );
      }
    });
  });

  await redisSub.subscribe("user:update-rooms", (message) => {
    const parsedMessage = JSON.parse(message);
    const userId: string = parsedMessage?.userId;
    const roomId: string = parsedMessage?.roomId;
    const type: string = parsedMessage?.type;

    if (!roomId || !type) {
      console.log("no room to update");
      return;
    }

    wsConnections.forEach((c) => {
      if (c.channels.includes("user") && userId === c.userId) {
        c.socket.send(
          JSON.stringify({
            type,
            roomId,
          })
        );
      }
    });
  });
};

connectAll().then(() => {
  const server = serve({ fetch: app.fetch, port: Number(PORT) }, (info) => {
    console.log(
      `${APPID} Listening on port ${info.port}  at ${info.address}: http://${info.address}:${info.port}. To access, check HAProxy config, probably http://${info.address}:8080`
    );
  });

  const wss = new WebSocketServer({ server: server as HTTPSServer });

  wss.on("connection", async (ws, req) => {
    console.log("connecting into: ", req.url);

    const urlParams = new URLSearchParams(req.url?.replace("/", "") || "");
    const userId = urlParams.get("userId");
    if (!userId) {
      console.log("userId not provided, closing connection");
      ws.close();
      return;
    }

    const channels = urlParams.getAll("channels");

    console.log("Channels:", channels);

    wsConnections.push({
      socket: ws,
      userId,
      channels,
    });

    const isGlobal = channels.includes("global");

    const name = urlParams.get("name");
    if (isGlobal) {
      if (!name) {
        console.log("name not provided in Global, closing connection");
        ws.close();
        return;
      }

      await redisClient
        .multi()
        .sAdd("online_users", userId)
        .hSet("online_users_data", userId, JSON.stringify({ id: userId, name }))
        .exec();

      /* ws.send(
        JSON.stringify({
          type: "online_users",
          data: await redisClient.hGetAll("online_users_data"),
        })
      ); */
    }

    ws.on("error", console.error);

    ws.on("message", (data) => {
      if (channels.includes("chat") && channels.includes("lobby")) {
        const msg = data?.toString();
        if (!msg) return;
        const finalMsg = `${name}^${msg}`;

        console.log(req.url);

        const timestamp = Date.now();

        redisClient.rPush(
          `chat:lobby:messages`,
          JSON.stringify({
            message: finalMsg,
            timestamp,
          })
        );

        redisClient.publish(
          "live-chat",
          JSON.stringify({
            type: "chat_message",
            message: finalMsg,
            channel: "lobby",
            timestamp,
          })
        );
      }
    });

    ws.on("close", async () => {
      wsConnections.splice(
        wsConnections.findIndex((c) => c.userId === userId),
        1
      );
      if (isGlobal) {
        const userRooms = await redisClient.sMembers(`user_rooms:${userId}`);

        if (!userRooms || userRooms?.length === 0) {
          redisClient
            .multi()
            .sRem("online_users", userId)
            .hDel("online_users_data", userId)
            .exec();
          return;
        }
        const roomId = userRooms[0];
        await redisClient.sRem(`user_rooms:${userId}`, roomId);

        const room = await RoomRepository.fetch(roomId);
        if (!room || typeof room.members !== "string") return;

        const roomMembers = JSON.parse(room.members);
        const newMembers = roomMembers.filter((m: any) => m.id !== userId);

        if (newMembers.length === 0) {
          await RoomRepository.remove(roomId);
          redisClient.publish(
            "lobby:remove-room",
            JSON.stringify({ roomId: roomId })
          );
          return;
        }

        room.creatorId = newMembers?.[0]?.id;
        room.members = JSON.stringify(newMembers);

        const updatedRoom = await RoomRepository.save(room);

        redisClient.publish(
          "lobby:update-room",
          JSON.stringify({ room: updatedRoom })
        );
      }
    });
  });
});

// todo extract members from room to: room_members:roomId -> centralized hash with all members. Update: not worth because of /rooms
