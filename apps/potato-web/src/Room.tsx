import { useState } from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";

interface RoomProps {
  id: string;
  name: string;
  members: string[];
  creatorId: string;
  onJoinRoom: (id: string) => void;
  userId: string;
}

const ROOM_SOCKET_URL = "ws://127.0.0.1:8080";

const Room = ({ id, name, members, creatorId, userId }: RoomProps) => {
  const [isJoined, setIsJoined] = useState(members.includes(userId));

  useWebSocket(
    `${ROOM_SOCKET_URL}/?room=${id}&userId=${userId}`,
    {
      onOpen: () => {
        // sendMessage(`${clientRandomName} entrou`);
      },
      onMessage: (event) => {
        const parsedData = JSON.parse(event.data);
        console.log("FROM ROOM: ", parsedData);
      },
    },
    isJoined
  );

  const onJoinRoom = async (roomId) => {
    const res = await fetch(`http://localhost:8080/api/rooms/${roomId}/join`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    console.log(data);
    setIsJoined(true);
  };

  return (
    <div className="backdrop-blur-3xl my-4">
      <h1>
        {name} - creator: {creatorId}
      </h1>

      <h3>members</h3>
      {members.map((member) => (
        <p>{member}</p>
      ))}
      <button className="btn" onClick={() => onJoinRoom(id)}>
        JOIN ROOM
      </button>

      {/* <ul>
      {roomMessages.map((message) => (
        <li>{message}</li>
      ))}
    </ul>
    <input
      onChange={(e) => {
        e.preventDefault();
        setInputText(e.target.value);
      }}
      value={inputText}
    /> */}
    </div>
  );
};

export default Room;
