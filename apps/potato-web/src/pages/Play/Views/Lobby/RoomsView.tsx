import { CollapsibleHeader } from "@/components/CollapsibleHeader/CollapsibleHeader";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useLobbyQueries } from "@/services/state/useLobbyQueries";
import { Loader2 } from "lucide-react";
import { LobbyRoom } from "./LobbyRoom/LobbyRoom";
import { useUserStore } from "@/services/state/useUserStore";

const RoomsView = () => {
  // const isLoggedIn = useUserStore((state) => state.isLoggedIn);
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
              name: member,
              id: member,
              isCreator: userRoom.creatorId === member,
            }))}
            maxMembers={userRoom.capacity}
            lastUpdated={userRoom.createdAt}
            isInAnyRoom={!!userRoom}
            listIsLoading={isLoading}
          />
        </CollapsibleHeader>
      )}

      <CollapsibleHeader
        header={<h1 className="text-lg font-bold">Browse rooms</h1>}
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
                name: member,
                id: member,
                isCreator: room.creatorId === member,
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
