import { useEffect, useMemo, useState } from "react";
import { useUserStore } from "../User/useUserStore";
import useWebSocket from "react-use-websocket";
import { SOCKET_URL } from "@/services/api/websocket";
import { queryClient } from "@/services/api/queryClient";
import { toast } from "react-toastify";

const useGlobalConnection = () => {
  const [isConnected, setConnected] = useState(false);
  const userData = useUserStore((state) => state.userData);

  const searchParams = useMemo(() => {
    if (!userData?.userId) return null;

    const params = new URLSearchParams({ userId: userData.userId, name: userData.name });
    params.append("channels", "global");
    params.append("channels", "user");

    return params.toString(); // userId=id&channels=global&channels=user
  }, [userData]);

  useEffect(() => {
    toast.dismiss({ containerId: "B" });
    if (!isConnected) {
      toast.warning("You're not connected. Sign in?", {
        position: "top-center",
        containerId: "B",
        autoClose: false,
      });
    } else {
      toast.success("Connected successfully to server", {
        position: "top-center",
        containerId: "B",
      });
    }
  }, [isConnected]);

  useWebSocket(
    `${SOCKET_URL}/?${searchParams}`,
    {
      share: true,
      onOpen: () => {
        setConnected(true);
      },
      onError: () => {
        setConnected(false);
      },
      onClose: () => {
        setConnected(false);
      },
      onReconnectStop: () => {
        console.log("on reconnect stop");
      },
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

  return null;
};

export { useGlobalConnection };
