import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

const clientRandomName = `client-${Math.floor(Math.random() * 100)}`;

const SOCKET_URL = "ws://127.0.0.1:8080";

const WebSocketClient = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputText, setInputText] = useState("");

  const { sendMessage, sendJsonMessage, lastMessage, lastJsonMessage, readyState, getWebSocket } = useWebSocket(
    SOCKET_URL,
    {
      onOpen: () => {
        console.log("opened");
        sendMessage(`${clientRandomName} entrou`);
      },
      onMessage: (event) => {
        if (event.data.startsWith("chatMessages:")) {
          const messages = event.data.replace("chatMessages:", "");
          const messagesArray = JSON.parse(messages);
          console.log({ messagesArray });
          setMessages(messagesArray.data);
        } else {
          setMessages((messages) => [...messages, event.data]);
        }
      },
    }
  );

  return (
    <div>
      <h1>Bate papo</h1>

      <ul>
        {messages.map((message) => (
          <li>{message}</li>
        ))}
      </ul>

      <input
        onChange={(e) => {
          e.preventDefault();
          setInputText(e.target.value);
        }}
        value={inputText}
      />
      <button
        onClick={() => {
          sendMessage(`${clientRandomName}: ${inputText}`);
        }}
      >
        send
      </button>
    </div>
  );
};

export { WebSocketClient };
