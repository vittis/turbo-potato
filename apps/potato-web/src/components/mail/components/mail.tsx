"use client";
import * as React from "react";
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
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
        }}
        className="h-full max-h-[800px] items-stretch"
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
          <div className={cn("flex h-[52px] items-center justify-center", isCollapsed ? "h-[52px]" : "px-2")}>
            {/* <Button variant="ghost">🥔 {isCollapsed ? "" : "Renato"}</Button> */}
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
          <div className="flex h-[52px] items-center px-4 py-2">
            <h1 className="text-xl font-bold">Lobby</h1>

            {/* <div className="ml-auto">
              <Button size="sm" variant="secondary">
                Create Room
              </Button>
            </div> */}
          </div>
          <Separator />

          <div className="bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <form>
              <div className="relative flex gap-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input disabled placeholder="Search" className="pl-8" />
                <Button size="sm" variant="outline">
                  Create Room
                </Button>
              </div>
            </form>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          <div className="flex h-[52px] items-center px-4 py-2">
            <h1 className="text-xl font-bold">Chat</h1>
            <span className="ml-2">
              <MessageCircle size="18px" />
            </span>

            <div className="ml-auto">
              <Button size="icon" variant="ghost">
                <Settings size="16px" />
              </Button>
            </div>
          </div>
          <Separator />

          <div className="flex flex-col w-full h-full">
            <ScrollArea className="max-w-[100%]">
              <div className={cn("px-1 pt-2 mb-3 flex items-center gap-2")}>
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
                    <span className="overflow-hidden text-ellipsis max-w-[100px] ">{navItem.name}</span>
                  </Button>
                ))}
              </div>
              <ScrollBar className="mt-4" orientation="horizontal" />
            </ScrollArea>

            <Separator />

            <div className="bg-pattern-gradient grow  pt-5">content</div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
