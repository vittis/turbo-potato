import { useEffect, useMemo, useState } from "react";
import { useUserStore } from "../User/useUserStore";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { SOCKET_URL } from "@/services/api/websocket";
import { queryClient } from "@/services/api/queryClient";
import { Id, ToastOptions, toast } from "react-toastify";
import { WifiOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const useGlobalConnection = () => {
  const userData = useUserStore((state) => state.userData);
  const [toastId, setToastId] = useState<Id | undefined>();

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

  /* useEffect(() => {
    const connectionStatus = {
      [ReadyState.CONNECTING]: "Connecting",
      [ReadyState.OPEN]: "Open",
      [ReadyState.CLOSING]: "Closing",
      [ReadyState.CLOSED]: "Closed",
      [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    }[readyState];

    const options: ToastOptions = {
      className: "w-max px-4 border border-zinc-800 !bg-pattern-gradient-error",
      icon: () => <WifiOffIcon className="pb-1 w-6 text-yellow-500" />,
      position: "top-center",
      containerId: "B",
      autoClose: false,
    };

    if (!toastId) {
      const id = toast.warning("Awaiting connection status...", options);
      setToastId(id);
      return;
    }

    switch (readyState) {
      case ReadyState.UNINSTANTIATED:
        toast.update(toastId, {
          ...options,
          render: connectionStatus,
          icon: () => <WifiOffIcon className="pb-1 w-6 text-yellow-500" />,
        });
        break;
      case ReadyState.CONNECTING:
        toast.update(toastId, {
          ...options,
          render: connectionStatus,
          icon: () => <WifiOffIcon className="pb-1 w-6 text-yellow-500" />,
        });
        break;
      case ReadyState.OPEN:
        toast.update(toastId, {
          ...options,
          render: connectionStatus,
          icon: () => <WifiOffIcon className="pb-1 w-6 text-yellow-500" />,
        });
        break;
      case ReadyState.CLOSING:
        toast.update(toastId, {
          ...options,
          render: connectionStatus,
          icon: () => <WifiOffIcon className="pb-1 w-6 text-yellow-500" />,
        });
        break;
      case ReadyState.CLOSED:
        toast.update(toastId, {
          ...options,
          render: connectionStatus,
          icon: () => <WifiOffIcon className="pb-1 w-6 text-yellow-500" />,
        });
        break;
    }
  }, [readyState, toastId]); */

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
