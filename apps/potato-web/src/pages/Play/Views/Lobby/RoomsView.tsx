import { CollapsibleHeader } from "@/components/CollapsibleHeader/CollapsibleHeader";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useLobbyQueries } from "@/services/features/Lobby/useLobbyQueries";
import { Loader2 } from "lucide-react";
import { LobbyRoom } from "./LobbyRoom/LobbyRoom";

const RoomsView = () => {
  const { userRoom, allRoomsExceptUserRoom, isLoading } = useLobbyQueries();

  return (
    <ScrollArea className="h-full w-full px-4">
      <ScrollBar />

      {userRoom && (
        <CollapsibleHeader header={<h1 className="text-lg font-bold">Your rooms</h1>} defaultIsOpen>
          <LobbyRoom
            id={userRoom.id}
            name={userRoom.name}
            description={userRoom.description}
            members={userRoom.members.map((member) => ({
              name: member.name,
              id: member.id,
              isCreator: userRoom.creatorId === member.id,
            }))}
            maxMembers={userRoom.capacity}
            lastUpdated={userRoom.createdAt}
            isInAnyRoom={!!userRoom}
            listIsLoading={isLoading}
          />
        </CollapsibleHeader>
      )}

      <CollapsibleHeader
        header={
          <h1 className="text-lg font-bold">
            Browse rooms
            <span className="text-xs text-primary ml-2">{allRoomsExceptUserRoom.length}</span>
          </h1>
        }
        rightElement={isLoading && <Loader2 className="animate-spin ml-3 w-4 mt-1" />}
        defaultIsOpen
      >
        <div className="grid-kk w-full pb-12">
          {allRoomsExceptUserRoom.map((room) => (
            <LobbyRoom
              key={room.id}
              id={room.id}
              name={room.name}
              description={room.description}
              members={room.members.map((member) => ({
                name: member.name,
                id: member.id,
                isCreator: room.creatorId === member.id,
                /* avatar: "https://avatars.githubusercontent.com/u/29383947?v=4", */
              }))}
              maxMembers={room.capacity}
              lastUpdated={room.createdAt}
              isInAnyRoom={!!userRoom}
              listIsLoading={isLoading}
            />
          ))}
        </div>
      </CollapsibleHeader>
    </ScrollArea>
  );
};

export default RoomsView;
