import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import Room from "./Room";

const SOCKET_URL = "ws://127.0.0.1:8080";

const WebSocketClient = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [roomMessages, setRoomMessages] = useState<string[]>([]);

  const [inputText, setInputText] = useState("");

  const [socketUrl, setSocketUrl] = useState<string | null>(null);
  const [hasProfileData, setHasProfileData] = useState(false);
  const [userId, setUserId] = useState("");

  const [rooms, setRooms] = useState<any[]>([]);

  /* const { sendMessage, sendJsonMessage, lastMessage, lastJsonMessage, readyState, getWebSocket } = */ useWebSocket(
    socketUrl,
    {
      onOpen: () => {
        // sendMessage(`${clientRandomName} entrou`);
      },
      onMessage: (event) => {
        const parsedEvent = JSON.parse(event.data);
        console.log(parsedEvent);
        if (parsedEvent.type === "room_created") {
          setRooms((rooms) => [...rooms, parsedEvent.room]);
        }

        if (parsedEvent.type === "room_updated") {
          const newRooms = rooms.map((room) => {
            if (room.id === parsedEvent.room.id) {
              return parsedEvent.room;
            }
            return room;
          });
          setRooms(newRooms);
        }

        /* if (parsedData.channel === "global") {
          setMessages((messages) => [...messages, parsedData.message]);
        }
        if (parsedData.channel === "rooms:333") {
          setRoomMessages((messages) => [...messages, parsedData.message]);
        } */
      },
    },
    socketUrl !== null
  );

  async function fetchProfile() {
    const res = await fetch("http://localhost:8080/api/profile", {
      credentials: "include",
    });
    const data = await res.json();
    console.log(data);
    if (data.data?.name) {
      setSocketUrl(`${SOCKET_URL}/?userId=${data.data.userId}`);
      setUserId(data.data.userId);
      setHasProfileData(true);
    }
  }

  const onClickLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/login", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    console.log(data);
    fetchProfile();
  };

  const onClickSendPOST = async (channel: string) => {
    const res = await fetch(`http://localhost:8080/api/chat/${channel}/${inputText}`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
  };

  useEffect(() => {
    async function fetchInitialMessages() {
      const res = await fetch("http://localhost:8080/api/chat/global", {
        credentials: "include",
      });
      const data = await res.json();
      setMessages(data.data.map((item) => item.message));

      const res2 = await fetch("http://localhost:8080/api/chat/rooms:333", {
        credentials: "include",
      });
      const data2 = await res2.json();
      setRoomMessages(data2.data.map((item) => item.message));
    }
    if (hasProfileData) {
      fetchInitialMessages();
    }
  }, [hasProfileData]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const onCreateRoom = async () => {
    const res = await fetch(`http://localhost:8080/api/rooms/create`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    console.log(data);
  };

  // fetch rooms
  useEffect(() => {
    async function fetchRooms() {
      const res = await fetch("http://localhost:8080/api/rooms", {
        credentials: "include",
      });
      const data = await res.json();
      console.log(data.rooms);
      setRooms(data.rooms);
    }
    if (hasProfileData) {
      fetchRooms();
    }
  }, [hasProfileData]);

  return (
    <div>
      <button onClick={onClickLogin}>login</button>
      <h1>Global</h1>

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
      <button onClick={() => onClickSendPOST("global")}>SEND POST</button>

      <br />

      <button onClick={onCreateRoom}>CREATE ROOM</button>

      {rooms.map((room) => (
        <Room {...room} userId={userId} />
      ))}

      {/* <button onClick={() => onClickSendPOST("rooms:333")}>SEND POST</button> */}
    </div>
  );
};

export { WebSocketClient };
