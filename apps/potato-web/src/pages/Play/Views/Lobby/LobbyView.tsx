import { Input } from "@/components/ui/input";
import { ResizablePanel } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateRoomDrawer } from "./CreateRoomDrawer";
import RoomsView from "./RoomsView";

interface LobbyViewProps {
  defaultSize: number;
}

const LobbyView = ({ defaultSize }: LobbyViewProps) => {
  return (
    <ResizablePanel defaultSize={defaultSize} minSize={30}>
      <div className="flex flex-col h-full">
        <div>
          <div className="breadcrumbs h-[52px] flex items-center px-4">
            <ul>
              <li>
                <h1 className="text-lg font-bold">Lobby</h1>
              </li>
              <li>
                <h2 className="text-md text-muted-foreground font-bold">Browse Rooms</h2>
              </li>
            </ul>
          </div>
        </div>

        <Separator />

        <form className="px-4 py-3">
          <div className="relative flex gap-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-8" />
            <Tabs defaultValue="all" className="ml-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="inProgress">In Progress</TabsTrigger>
              </TabsList>
            </Tabs>

            <CreateRoomDrawer />
          </div>
        </form>

        <RoomsView />
      </div>
    </ResizablePanel>
  );
};

export default LobbyView;
