import { useEffect, useState } from "react";

const clientRandomName = `client-${Math.floor(Math.random() * 100)}`;

const WebSocketClient = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputText, setInputText] = useState("");

  const [ws, setWs] = useState<WebSocket>();

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8080");

    // Connection opened
    socket.addEventListener("open", (event) => {
      console.log("connection open");

      socket.send(`${clientRandomName} entrou`);
    });

    // Listen for messages
    socket.addEventListener("message", (event) => {
      if (event.data.startsWith("chatMessages:")) {
        console.log("oi");
        const messages = event.data.replace("chatMessages:", "");
        const messagesArray = JSON.parse(messages);
        console.log({ messagesArray });
        setMessages(messagesArray.data);
      } else {
        setMessages((messages) => [...messages, event.data]);
      }
    });

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

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
          ws?.send(`${clientRandomName}: ${inputText}`);
        }}
      >
        send
      </button>
    </div>
  );
};

export { WebSocketClient };
