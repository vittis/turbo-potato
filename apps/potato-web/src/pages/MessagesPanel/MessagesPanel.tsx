import { Input } from "@/components/ui/input";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { ChatBubble } from "./ChatBubble";

const mockChatNavItems = [
  {
    name: "Lobby",
  },
  {
    name: "Test Room",
  },
  {
    name: "Some guy",
  },
  {
    name: "Anti Renato",
  },
  {
    name: "Long Name Guy Who Is Very Long",
  },
  {
    name: "Other guy",
  },
  {
    name: "Settings",
  },
];

interface MessagesPanelProps {
  defaultSize: number;
}

const MessagesPanel = ({ defaultSize }: MessagesPanelProps) => {
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatBoxRef.current]);

  return (
    <>
      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={defaultSize}>
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
    </>
  );
};

export default MessagesPanel;
