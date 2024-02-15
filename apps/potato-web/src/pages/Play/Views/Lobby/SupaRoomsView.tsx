import { CollapsibleHeader } from "@/components/CollapsibleHeader/CollapsibleHeader";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useLobbyQueries } from "@/services/features/Lobby/useLobbyQueries";
import { Loader2 } from "lucide-react";
import { LobbyRoom } from "./LobbyRoom/LobbyRoom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/services/supabase/supabase";
import { useMemo } from "react";
import { useSupabaseUserStore } from "@/services/features/User/useSupabaseUserStore";

async function fetchSupaRooms() {
  let { data: rooms, error } = await supabase.from("rooms").select(`
    id,
    name,
    description,
    capacity,
    created_at,
    last_updated,
    members:room_members (
      is_creator,
      ...profiles (
        id,
        username
      )
    )
  `);

  return rooms;
}

async function fetchProfiles() {
  let { data: rooms, error } = await supabase.from("profiles").select(`
    username
  `);

  return rooms;
}

const SupaRoomsView = () => {
  const user = useSupabaseUserStore((state) => state.user);

  const { data: rooms, isFetching } = useQuery<any>({
    queryKey: ["supa", "rooms"],
    queryFn: fetchSupaRooms,
  });

  const userRoom = useMemo(() => {
    return rooms?.find((room) => room.members.some((member) => member.id === user?.id));
  }, [rooms, user]);

  const otherRooms = useMemo(() => {
    return rooms?.filter((room) => !room.members.some((member) => member.id === user?.id));
  }, [rooms, user]);

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
              name: member.username,
              id: member.id,
              isCreator: member.is_creator,
            }))}
            maxMembers={userRoom.capacity}
            lastUpdated={userRoom.created_at}
            isInAnyRoom={!!userRoom}
            listIsLoading={isFetching}
          />
        </CollapsibleHeader>
      )}

      <CollapsibleHeader
        header={<h1 className="text-lg font-bold">Browse rooms</h1>}
        rightElement={isFetching && <Loader2 className="animate-spin ml-3 w-4 mt-1" />}
        defaultIsOpen
      >
        <div className="grid-kk w-full pb-12">
          {otherRooms?.map((room) => (
            <LobbyRoom
              key={room.id}
              id={room.id}
              name={room.name}
              description={room.description}
              members={room.members.map((member) => ({
                name: member.username,
                id: member.id,
                isCreator: member.is_creator,
                // avatar: "https://avatars.githubusercontent.com/u/29383947?v=4",
              }))}
              maxMembers={room.capacity}
              lastUpdated={room.created_at}
              isInAnyRoom={false}
              listIsLoading={isFetching}
            />
          ))}
        </div>
      </CollapsibleHeader>
    </ScrollArea>
  );
};

export default SupaRoomsView;
