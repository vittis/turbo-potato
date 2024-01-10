import useWebSocket from "react-use-websocket";
import { useMemo } from "react";
import { useUserStore } from "@/services/features/User/useUserStore";
import { SOCKET_URL } from "@/services/api/websocket";
import { queryClient } from "@/services/api/queryClient";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/http";

async function fetchChatMessages(channel: string) {
  const { data } = await api.get(`/api/chat/${channel}`, {
    withCredentials: true,
  });
  return data;
}

// todo adjust to allow many channels properly
const useChatMessages = ({ channel }: { channel: string }) => {
  const userData = useUserStore((state) => state.userData);

  const searchParams = useMemo(() => {
    if (!userData?.userId) return null;

    const params = new URLSearchParams({ userId: userData.userId });
    params.append("channels", "chat");
    params.append("channels", channel);
    params.append("name", userData.name);

    return params.toString();
  }, [userData, channel]);

  const { data: messagesData, isLoading: messagesLoading } = useQuery<{ data: any[] }>({
    queryKey: ["chat", channel],
    queryFn: () => fetchChatMessages(channel),
    enabled: userData.name !== "",
  });

  const { sendMessage: sendChatMessage } = useWebSocket(
    `${SOCKET_URL}/?${searchParams}`,
    {
      share: true,
      onMessage: (event) => {
        const data = JSON.parse(event.data);
        console.log(data);

        if (data.type === "chat_message") {
          console.log("chat message received-> ", data.message);
          console.log(data);

          queryClient.setQueryData(["chat", channel], (oldData: any) => {
            return {
              data: [
                ...oldData.data,
                {
                  message: data.message,
                  timestamp: data.timestamp,
                },
              ],
            };
          });
        }
      },
    },
    userData.userId !== ""
  );

  const messages = useMemo(() => {
    if (!messagesData?.data) return [];
    return messagesData.data.map((messageObj) => {
      const sender = messageObj.message.split("^")?.[0];
      const message = messageObj.message.split("^")?.[1];
      return {
        sender,
        message,
        timestamp: messageObj.timestamp,
      };
    });
  }, [messagesData]);

  return { sendChatMessage, messages, messagesLoading };
};

export { useChatMessages };
