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
import { SubmitHandler, useForm } from "react-hook-form";
import { useChatMessages } from "@/services/features/Messages/useChatMessages";
import { useUserStore } from "@/services/features/User/useUserStore";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSupabaseUserStore } from "@/services/features/User/useSupabaseUserStore";

const mockChatNavItems = [
  {
    name: "Lobby",
  },
  /* {
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
  }, */
];

type Inputs = {
  message: string;
};

interface MessagesPanelProps {
  defaultSize: number;
}

const MessagesPanel = ({ defaultSize }: MessagesPanelProps) => {
  const user = useSupabaseUserStore((state) => state.user);
  const userData = useUserStore((state) => state.userData);
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  const { sendChatMessage, messages } = useChatMessages({ channel: "lobby" });

  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatBoxRef.current, messages]);

  const { register, handleSubmit, reset } = useForm<Inputs>({ defaultValues: { message: "" } });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    sendChatMessage(data.message);
    reset();
  };

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
          <TooltipProvider delayDuration={0}>
            <ScrollArea ref={chatBoxRef} className="h-full px-3.5 pb-0">
              <ScrollBar orientation="vertical" />
              {messages.map((message) => (
                <ChatBubble
                  key={message.timestamp}
                  sender={message.sender}
                  message={message.message}
                  timestamp={message.timestamp}
                  isFromMe={message.sender === user.user_metadata.username}
                />
              ))}
            </ScrollArea>
          </TooltipProvider>
          <div className="px-3.5 pb-3">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                disabled={!isLoggedIn}
                {...register("message", { required: true })}
                placeholder={isLoggedIn ? "Send message" : "Sign in to view and send messages"}
              />
            </form>
          </div>
        </div>
      </ResizablePanel>
    </>
  );
};

export default MessagesPanel;
