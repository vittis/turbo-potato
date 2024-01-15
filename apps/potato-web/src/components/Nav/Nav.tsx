import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { ThemeModeToggle } from "../ThemeModeToggle/ThemeModeToggle";
import { useAuth } from "@/services/state/useAuth";
import { useUserStore } from "@/services/features/User/useUserStore";
import { useEffect } from "react";
import { useGlobalConnection } from "@/services/features/Global/useGlobalConnection";
import { ReadyState } from "react-use-websocket";
import { WifiIcon, WifiOffIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const navItems = [
  {
    name: "Play",
  },
  {
    name: "Leaderboards",
  },
  {
    name: "Guide",
  },
  {
    name: "Training",
  },
  {
    name: "Shop",
  },
  {
    name: "Encyclopedia",
  },
  {
    name: "Settings",
  },
];

export function Nav() {
  const userData = useUserStore((state) => state.userData);
  const { login, logout, loginIsPending, logoutIsPending } = useAuth();

  const { readyState } = useGlobalConnection();

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const notConnected = readyState !== ReadyState.OPEN;
  const Icon = notConnected ? WifiOffIcon : WifiIcon;

  return (
    <div className="relative flex">
      <ScrollArea className="max-w-[100%] lg:max-w-none">
        <div className={cn("mb-4 flex items-center")}>
          {navItems.map((navItem, index) => (
            <Button
              variant={"ghost"}
              disabled={index !== 0}
              key={navItem.name}
              className={cn(
                "flex h-7 items-center justify-center rounded-md px-4 text-center text-lg transition-colors hover:text-primary py-6",
                index === 0 ? "bg-muted font-medium text-primary" : "text-muted-foreground"
              )}
            >
              {navItem.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="grow flex justify-end gap-4 items-center">
        {!userData?.name ? (
          <Button disabled={loginIsPending} onClick={() => login()}>
            Sign In
          </Button>
        ) : (
          <div className="">
            Logged as <span className="text-primary mr-2">{userData.name}</span>{" "}
            <Button disabled={logoutIsPending} onClick={() => logout()} variant="destructive">
              Sign Out
            </Button>
          </div>
        )}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex gap-2 w-max !bg-pattern-gradient-error rounded-md text-muted-foreground">
                <Icon
                  className={cn(
                    "pb-1 w-6",
                    notConnected ? "text-yellow-500 animate-pulse" : "text-green-500"
                  )}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="flex items-center gap-4">{connectionStatus}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <ThemeModeToggle />
      </div>
    </div>
  );
}
