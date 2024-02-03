import { Hono } from "hono";
import { EntityId, Schema, Repository } from "redis-om";
import { redisClient } from "../../redis";
import { Variables } from "../../index";
import { nanoid } from "nanoid";

const app = new Hono<{ Variables: Variables }>();

export interface Room {
  id: string;
  creatorId: string;
  name: string;
  members: string[];
}

const roomSchema = new Schema(
  "room",
  {
    id: { type: "string" },
    creatorId: { type: "string" },
    name: { type: "string" },
    members: { type: "string" },
    capacity: { type: "number" },
    createdAt: { type: "string" },
  },
  { dataStructure: "HASH" }
);

export const RoomRepository = new Repository(roomSchema, redisClient);

app.post("/api/rooms/:roomId/join", async (c) => {
  const roomId = c.req.param("roomId");
  const session = c.get("session");

  const room = await RoomRepository.fetch(roomId);

  const userNumberOfRooms = await redisClient.sCard(
    `user_rooms:${session.userId}`
  );

  if (!room.id || typeof room.members !== "string") {
    return c.json({ error: "Room not found" }, 404);
  }

  if (userNumberOfRooms > 0) {
    return c.json({ error: "You are already in a room" }, 400);
  }

  const userInfo = await redisClient.hGet("online_users_data", session.userId);
  if (!userInfo) {
    return c.json({ error: "User not found" }, 404);
  }

  const roomMembers = JSON.parse(room.members);
  const newRoomMembers = [...roomMembers, JSON.parse(userInfo)];

  room.members = JSON.stringify(newRoomMembers);

  const updatedRoom = await RoomRepository.save(room);

  await redisClient.sAdd(`user_rooms:${session.userId}`, roomId);
  redisClient.publish(
    "user:update-rooms",
    JSON.stringify({ type: "add-room", roomId, userId: session.userId })
  );

  redisClient.publish(
    "lobby:update-room",
    JSON.stringify({ room: updatedRoom })
  );

  return c.json({ room: updatedRoom });
});

app.post("/api/rooms/:roomId/leave", async (c) => {
  const roomId = c.req.param("roomId");
  const session = c.get("session");

  const room = await RoomRepository.fetch(roomId);
  if (!room.id || typeof room.members !== "string") {
    return c.json({ error: "Room not found" }, 404);
  }

  const userNumberOfRooms = await redisClient.sCard(
    `user_rooms:${session.userId}`
  );

  if (userNumberOfRooms === 0) {
    return c.json({ error: "You are not in a room" }, 400);
  }

  const roomMembers = JSON.parse(room.members);
  if (!roomMembers.find((m: any) => m.id === session.userId)) {
    return c.json({ error: "User is not a member of the room" }, 400);
  }

  const newMembers = roomMembers.filter((m: any) => m.id !== session.userId);

  if (newMembers.length === 0) {
    await RoomRepository.remove(roomId);

    await redisClient.sRem(`user_rooms:${session.userId}`, roomId);
    redisClient.publish(
      "user:update-rooms",
      JSON.stringify({ type: "remove-room", roomId, userId: session.userId })
    );

    redisClient.publish("lobby:remove-room", JSON.stringify({ roomId }));

    return c.json({ ok: true });
  }

  room.creatorId = newMembers?.[0]?.id;
  room.members = JSON.stringify(newMembers);

  const updatedRoom = await RoomRepository.save(room);

  await redisClient.sRem(`user_rooms:${session.userId}`, roomId);
  redisClient.publish(
    "user:update-rooms",
    JSON.stringify({ type: "remove-room", roomId, userId: session.userId })
  );

  redisClient.publish(
    "lobby:update-room",
    JSON.stringify({ room: updatedRoom })
  );

  return c.json({ room: updatedRoom });
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

  const userInfo = await redisClient.hGet("online_users_data", session.userId);

  if (!userInfo) {
    return c.json({ error: "User not found" }, 404);
  }

  const members = JSON.stringify([JSON.parse(userInfo)]);

  const room = {
    id,
    name,
    creatorId: session.userId,
    members,
    capacity,
    description,
    createdAt: new Date().toISOString(),
  };

  const savedRoom = await RoomRepository.save(id, room);

  await redisClient.sAdd(`user_rooms:${session.userId}`, id);
  redisClient.publish(
    "user:update-rooms",
    JSON.stringify({ type: "add-room", roomId: id, userId: session.userId })
  );

  redisClient.publish("lobby:create-room", JSON.stringify({ room: savedRoom }));

  return c.json({ room: savedRoom });
});

app.get("/api/rooms", async (c) => {
  const rooms = [];

  for await (const key of redisClient.scanIterator({
    MATCH: "room:*",
    TYPE: "hash",
  })) {
    const room = await redisClient.hGetAll(key);
    rooms.push(room);
  }

  return c.json({ rooms });
});

/* app.post("/api/rooms/:roomId/remove", async (c) => {
  const session = c.get("session");

  const roomId = c.req.param("roomId");
  const room = await roomRepository.fetch(roomId);

  if (room.creatorId !== session.userId) {
    return c.json({ error: "You are not the room creator" }, 400);
  }

  await roomRepository.remove(roomId);

  // redisClient.publish("lobby:remove-room", JSON.stringify({ roomId }));

  return c.json({ ok: true });
}); */

export default app;
