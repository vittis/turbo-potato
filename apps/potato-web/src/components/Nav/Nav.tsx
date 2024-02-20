import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { ThemeModeToggle } from "../ThemeModeToggle/ThemeModeToggle";
import { useAuth } from "@/services/features/User/useAuth";
import { useUserStore } from "@/services/features/User/useUserStore";
import { useGlobalConnection } from "@/services/features/Global/useGlobalConnection";
import { ReadyState } from "react-use-websocket";
import { WifiIcon, WifiOffIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { RegisterUserDrawer } from "../User/RegisterUserDrawer";
import { useSupabaseUserStore } from "@/services/features/User/useSupabaseUserStore";
import { supabase } from "@/services/supabase/supabase";
import { LoginUserDrawer } from "../User/LoginUserDrawer";
import { Link, matchPath, useLocation, useResolvedPath } from "react-router-dom";

const navItems = [
  {
    name: "Play",
    path: "/play",
    disabled: false,
  },
  {
    name: "Game",
    path: "/game",
    disabled: false,
  },
  {
    name: "Leaderboards",
    disabled: true,
  },
  {
    name: "Guide",
    disabled: true,
  },
  {
    name: "Shop",
    disabled: true,
  },
  {
    name: "Encyclopedia",
    disabled: true,
  },
  {
    name: "Settings",
    disabled: true,
  },
];

export function Nav() {
  const user = useSupabaseUserStore((state) => state.user);

  const { readyState } = useGlobalConnection();

  const { pathname } = useLocation();

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const notConnected = readyState !== ReadyState.OPEN;
  const Icon = notConnected ? WifiOffIcon : WifiIcon;

  const supaBaselogout = async () => {
    let { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  };

  return (
    <div className="relative flex z-20">
      <ScrollArea className="max-w-[100%] lg:max-w-none">
        <div className={cn("mb-4 flex items-center gap-2")}>
          {navItems.map((navItem) => (
            <Link
              key={navItem.name}
              to={navItem.path || ""}
              className={cn(navItem?.disabled && "pointer-events-none")}
            >
              <Button
                variant={"ghost"}
                disabled={navItem?.disabled}
                className={cn(
                  "flex h-7 items-center justify-center rounded-md px-4 text-center text-lg transition-colors hover:text-primary py-6",
                  !!matchPath(`${navItem.path}/*`, pathname)
                    ? "bg-muted font-medium text-primary"
                    : "text-muted-foreground"
                )}
              >
                {navItem.name}
              </Button>
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="grow flex justify-end gap-4 items-center">
        {user ? (
          <>
            <div className="text-muted-foreground">
              Logged as{" "}
              <span className="text-primary mr-2">
                {user.user_metadata.username
                  ? user.user_metadata.username
                  : user.user_metadata.preferred_username
                  ? user.user_metadata.name
                  : user.email}
              </span>
            </div>
            <Button onClick={() => supaBaselogout()} variant="outline">
              Logout
            </Button>
          </>
        ) : (
          <>
            <LoginUserDrawer />
            <RegisterUserDrawer />
          </>
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
