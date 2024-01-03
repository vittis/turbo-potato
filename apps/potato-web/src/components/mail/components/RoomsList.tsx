import { useQuery } from "@tanstack/react-query";
import { LobbyRoom } from "./LobbyRoom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CollapsibleHeader } from "@/components/collapsible-header";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronsDownUpIcon, ChevronsUpDownIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserStore } from "@/services/state/user";

/* interface Room {
  id: string;
  name: string;
} */

/* interface RoomsListProps {} */

export async function fetchLobbyRooms() {
  const response = await fetch("http://localhost:8080/api/rooms", { credentials: "include" });
  const data = await response.json();
  return data;
}

const RoomsList = () => {
  const { data } = useQuery({ queryKey: ["lobby/rooms"], queryFn: fetchLobbyRooms });
  const userData = useUserStore((state) => state.userData);
  const userRoom = data?.rooms?.find((room) => userData.rooms.includes(room.id));

  const [isOpen, setIsOpen] = useState(true);

  const icon = !isOpen ? (
    <ChevronsUpDownIcon className="h-4 w-4" />
  ) : (
    <ChevronsDownUpIcon className="h-4 w-4" />
  );

  return (
    <>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center mb-4">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center w-fit gap-2 p-0 py-0 hover:bg-transparent hover:opacity-85 transition-all"
            >
              <div>
                {icon}
                <span className="sr-only">Toggle</span>
              </div>
              <h1 className="text-lg font-bold">
                Browse rooms
                <span className="text-xs text-primary ml-2">
                  {data?.rooms ? data?.rooms?.length : 0}
                </span>
              </h1>
            </Button>
          </CollapsibleTrigger>

          {/* <Tabs defaultValue="all" className="ml-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="inProgress">In Progress</TabsTrigger>
            </TabsList>
          </Tabs> */}
        </div>
        <CollapsibleContent className="CollapsibleContent">
          <div className="grid-kk w-full pb-12">
            {data?.rooms
              ?.filter((room) => !userData.rooms.includes(room.id))
              .map((room) => (
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
                />
              ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};

export { RoomsList };
