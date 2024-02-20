import { useMemo } from "react";
import { useUserStore } from "../User/useUserStore";
import useWebSocket from "react-use-websocket";
import { SOCKET_URL } from "@/services/api/websocket";
import { queryClient } from "@/services/api/queryClient";

const useGlobalConnection = () => {
  const userData = useUserStore((state) => state.userData);

  const searchParams = useMemo(() => {
    if (!userData?.userId) return null;

    const params = new URLSearchParams({ userId: userData.userId, name: userData.name });
    params.append("channels", "global");
    params.append("channels", "user");

    return params.toString(); // userId=id&channels=global&channels=user
  }, [userData]);

  const { readyState } = useWebSocket(
    `${SOCKET_URL}/?${searchParams}`,
    {
      share: true,
      /* onOpen: () => {
      },
      onError: () => {
      },
      onClose: () => {
      },
      onReconnectStop: () => {
      }, */
      onMessage: (event) => {
        const data = JSON.parse(event.data);
        const type = data?.type;
        const roomId = data?.roomId;

        if (type === "remove-room") {
          queryClient.setQueryData(["user", "rooms"], (oldData: any) => {
            const updatedRooms = oldData.rooms.filter((room: any) => room !== roomId);
            return {
              rooms: updatedRooms,
            };
          });
        }
        if (type === "add-room") {
          queryClient.setQueryData(["user", "rooms"], (oldData: any) => {
            return {
              rooms: [...oldData.rooms, roomId],
            };
          });
        }
      },
    },
    !!searchParams
  );

  return { readyState };
};
export { useGlobalConnection };
/* ReadyState.
const connectionStatus = {
  [ReadyState.CONNECTING]: "Connecting",
  [ReadyState.OPEN]: "Open",
  [ReadyState.CLOSING]: "Closing",
  [ReadyState.CLOSED]: "Closed",
  [ReadyState.UNINSTANTIATED]: "Uninstantiated",
}[readyState]; */
