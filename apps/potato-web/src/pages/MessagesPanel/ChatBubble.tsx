export const ChatBubble = () => {
  const random = Math.random();
  const isPaul = random > 0.5;
  return (
    <div className={`chat ${isPaul ? "chat-start" : "chat-end"}`}>
      <div className="chat-image avatar">
        <div className="w-8 rounded-full">
          <img
            alt="Tailwind CSS chat bubble component"
            src={
              isPaul
                ? "https://avatars.githubusercontent.com/u/29383947?v=4"
                : "https://i.ytimg.com/vi/H2Y__-IhdKM/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGHIgSihGMA8=&rs=AOn4CLBQgwlWkUWjK3Z1h_f9GsDfwiw9iA"
            }
          />
        </div>
      </div>
      <div className="chat-header">
        <span className="opacity-50">{isPaul ? "Paul" : "Mosquitao"} </span>

        <time className="text-xs opacity-50 ml-1 text-muted-foreground">12:45</time>
      </div>
      <div className="chat-bubble">{isPaul ? "Call me paul" : "Como assim my paul?"}</div>
    </div>
  );
};
