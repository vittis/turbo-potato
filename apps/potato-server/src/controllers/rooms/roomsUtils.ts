import { redisClient } from "../redis";
import { RoomRepository } from "./roomsRoutes";

async function removeUserFromRoom(userId: string, roomId: string) {
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
}
