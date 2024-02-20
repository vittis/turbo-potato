import useWebSocket from "react-use-websocket";
import { useMemo } from "react";
import { useUserStore } from "@/services/features/User/useUserStore";
import { SOCKET_URL } from "@/services/api/websocket";
import { queryClient } from "@/services/api/queryClient";

const useLobbyRealtime = () => {
  const userData = useUserStore((state) => state.userData);

  const searchParams = useMemo(() => {
    if (!userData?.userId) return null;

    const params = new URLSearchParams({ userId: userData.userId });
    params.append("channels", "lobby");
    return params.toString();
  }, [userData]);

  useWebSocket(
    `${SOCKET_URL}/?${searchParams}`,
    {
      share: true,
      onMessage: (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "room_created") {
          queryClient.setQueryData(["lobby", "rooms"], (oldData: any) => {
            return {
              rooms: [...oldData.rooms, data.room],
            };
          });
        }
        if (data.type === "room_updated") {
          queryClient.setQueryData(["lobby", "rooms"], (oldData: any) => {
            const updatedRooms = oldData.rooms.map((room: any) =>
              room.id === data.room.id ? data.room : room
            );
            return {
              rooms: updatedRooms,
            };
          });
        }
        if (data.type === "room_removed") {
          const roomId = data.roomId;
          queryClient.setQueryData(["lobby", "rooms"], (oldData: any) => {
            const updatedRooms = oldData.rooms.filter((room: any) => room.id !== roomId);
            return {
              rooms: updatedRooms,
            };
          });
        }
      },
    },
    userData.userId !== ""
  );

  return null;
};

export { useLobbyRealtime };
