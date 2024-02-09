import { CollapsibleHeader } from "@/components/CollapsibleHeader/CollapsibleHeader";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useLobbyQueries } from "@/services/features/Lobby/useLobbyQueries";
import { Loader2 } from "lucide-react";
import { LobbyRoom } from "./LobbyRoom/LobbyRoom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/services/supabase/supabase";

async function fetchSupaRooms() {
  let { data: rooms, error } = await supabase.from("rooms").select("*");

  return rooms;
}

const SupaRoomsView = () => {
  const { data: rooms, isLoading } = useQuery({
    queryKey: ["supa", "rooms"],
    queryFn: fetchSupaRooms,
  });

  console.log(rooms);

  return (
    <ScrollArea className="h-full w-full px-4">
      <ScrollBar />

      {/* {userRoom && (
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
      )} */}

      <CollapsibleHeader
        header={<h1 className="text-lg font-bold">Browse rooms</h1>}
        rightElement={isLoading && <Loader2 className="animate-spin ml-3 w-4 mt-1" />}
        defaultIsOpen
      >
        <div className="grid-kk w-full pb-12">
          {rooms?.map((room) => (
            <LobbyRoom
              key={room.id}
              id={room.id}
              name={room.name}
              description={room.description}
              members={room.members.map((member) => ({
                name: member,
                id: member,
                isCreator: true,
                /* avatar: "https://avatars.githubusercontent.com/u/29383947?v=4", */
              }))}
              maxMembers={room.capacity}
              lastUpdated={room.created_at}
              isInAnyRoom={false}
              listIsLoading={isLoading}
            />
          ))}
        </div>
      </CollapsibleHeader>
    </ScrollArea>
  );
};

export default SupaRoomsView;
