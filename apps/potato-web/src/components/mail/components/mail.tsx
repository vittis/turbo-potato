import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Swords,
  PenBox,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
  DoorClosed,
  Trophy,
  MessageCircle,
  MessageCircleMore,
  MessageSquare,
  Settings,
  ChevronsUpDownIcon,
  ChevronsDownUpIcon,
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { SideNav } from "./side-nav";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Mail } from "../data";
import { Button } from "@/components/ui/button";
import { AccountSwitcher } from "./account-switcher";
import TestComponent from "./test-component";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { mockChatNavItems } from "@/components/Nav";
import debounce from "lodash.debounce";
import { LobbyRoom } from "./LobbyRoom";
import { useCallback, useEffect, useRef, useState } from "react";
import { CreateRoomDrawer } from "./CreateRoomDrawer";
import { RoomsList, fetchLobbyRooms } from "./RoomsList";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CollapsibleHeader } from "@/components/collapsible-header";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/services/state/user";

interface MailProps {
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
  mails: Mail[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function Mail({
  accounts,
  mails,
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const { data } = useQuery({ queryKey: ["lobby/rooms"], queryFn: fetchLobbyRooms });
  const userData = useUserStore((state) => state.userData);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const userRoom = data?.rooms?.find((room) => userData.rooms.includes(room.id));

  const debouncedSaveToLocalStorage = useCallback(
    debounce((sizes) => {
      console.log("setting");
      localStorage.setItem("react-resizable-panels:layout", JSON.stringify(sizes));
    }, 300),
    []
  );

  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatBoxRef.current]);

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          debouncedSaveToLocalStorage(sizes);
        }}
        className="h-full items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={11}
          maxSize={18}
          onExpand={() => {
            setIsCollapsed(false);
          }}
          onCollapse={() => {
            setIsCollapsed(true);
          }}
          className={cn(isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out")}
        >
          <div
            className={cn(
              "flex h-[52px] items-center justify-center",
              isCollapsed ? "h-[52px]" : "px-2"
            )}
          >
            {/* @ts-expect-error */}
            <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} />
          </div>
          <Separator />
          <SideNav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Matchmaking",
                label: "",
                icon: Swords,
                variant: "ghost",
                selected: false,
                props: {
                  disabled: true,
                },
              },
              {
                title: "Lobby",
                label: "9",
                icon: DoorClosed,
                variant: "ghost",
                selected: true,
              },
              {
                title: "Tournaments",
                label: "",
                icon: Trophy,
                variant: "ghost",
                selected: false,
                props: {
                  disabled: true,
                },
              },
            ]}
          />
          <Separator />
          <SideNav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Social",
                label: "972",
                icon: Users2,
                variant: "ghost",
                selected: false,
                props: {
                  disabled: true,
                },
              },
              {
                title: "Updates",
                label: "342",
                icon: AlertCircle,
                variant: "ghost",
                selected: false,
                props: {
                  disabled: true,
                },
              },
            ]}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
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

            {/* <div className="px-4 py-3 h-full"> */}
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
            <ScrollArea className="h-full w-full px-4">
              <ScrollBar />
              {userRoom && (
                <CollapsibleHeader
                  header={<h1 className="text-lg font-bold">Your rooms</h1>}
                  defaultIsOpen
                >
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
                  />
                </CollapsibleHeader>
              )}

              {/* <Separator className="my-4 bg-zinc-900" /> */}

              <RoomsList />
            </ScrollArea>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          <div className="flex flex-col h-full bg-pattern-gradient">
            <div className="flex h-[52px] items-center px-4 py-2 bg-background">
              <h1 className="text-xl font-bold">Messages</h1>

              <div className="ml-auto">
                <Button size="icon" variant="ghost">
                  <Settings size="16px" />
                </Button>
              </div>
            </div>
            <Separator />

            <div className="h-[48px] bg-background">
              <ScrollArea className="max-w-[100%]">
                <div className={cn("px-1 pt-2 mb-2.5 flex items-center gap-2")}>
                  {mockChatNavItems.map((navItem, index) => (
                    <Button
                      id={index === 0 ? "" : ""}
                      size="sm"
                      variant={"ghost"}
                      key={navItem.name}
                      className={cn(
                        "bg-transparent h-[28px] flex items-center justify-center px-3 text-center  transition-colors hover:text-primary py-1",
                        index === 0 ? "bg-muted font-medium text-primary" : "text-muted-foreground "
                      )}
                    >
                      <span className="overflow-hidden text-ellipsis max-w-[100px] ">
                        {navItem.name}
                      </span>
                    </Button>
                  ))}
                </div>
                <ScrollBar className="mt-4" orientation="horizontal" />
              </ScrollArea>
            </div>
            <Separator />

            <ScrollArea ref={chatBoxRef} className="h-full px-3.5 pb-0">
              <ScrollBar orientation="vertical" />
              {Array.from({ length: 30 }).map((_, index) => (
                <ChatBubble key={index} />
              ))}
            </ScrollArea>
            <div className="px-3.5 pb-3">
              <Input placeholder="Send message" />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}

const ChatBubble = () => {
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
