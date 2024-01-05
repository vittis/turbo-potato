import useWebSocket from "react-use-websocket";

const SOCKET_URL = "ws://127.0.0.1:8080";

const WebSocketClient = () => {
  function buildUserDataSearchParam() {
    const searchParams = new URLSearchParams();
    searchParams.append("userId", userData.userId);
    searchParams.append("name", userData.name);
    return searchParams;
  }

  console.log(buildUserDataSearchParam());

  useWebSocket(
    `${SOCKET_URL}/?userId=${userData.userId}&name=${userData.name}`,
    {
      onOpen: () => {
        // sendMessage(`${clientRandomName} entrou`);
      },
    },
    userData.userId !== ""
  );

  return null;
};

export { WebSocketClient };
