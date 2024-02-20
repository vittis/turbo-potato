import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { PlaySideNavItems } from "./PlaySideNavItems";
import { AlertCircle, DoorClosed, FlaskConical, Swords, Trophy, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/services/features/User/useAuth";
import { useUserStore } from "@/services/features/User/useUserStore";
import { matchPath, useLocation } from "react-router-dom";

interface PlaySideNavProps {
  defaultCollapsed: boolean;
  defaultSize: number;
  navCollapsedSize: number;
}

const PlaySideNav = ({ defaultCollapsed, defaultSize, navCollapsedSize }: PlaySideNavProps) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const userData = useUserStore((state) => state.userData);

  const { login, loginIsPending } = useAuth();

  const { pathname } = useLocation();

  return (
    <>
      <ResizablePanel
        defaultSize={defaultSize}
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
            "flex h-[52px] items-center justify-start",
            isCollapsed ? "h-[52px]" : "px-2"
          )}
        >
          {userData.name ? (
            <Button
              variant="ghost"
              className={cn(
                "w-full flex items-center space-x-1 justify-start px-2",
                isCollapsed && "px-1 justify-center"
              )}
            >
              <div className="w-5 h-5 rounded-full dark:bg-stone-800 bg-zinc-800 dark:text-accent-foreground text-primary-foreground flex items-center justify-center text-xs">
                {userData?.name[0]?.toUpperCase()}
              </div>

              {!isCollapsed && (
                <div
                  className={`flex text-ellipsis overflow-hidden text-sm text-left items-baseline gap-1`}
                >
                  {userData?.name} <span className="text-[10px] text-primary">In lobby</span>
                </div>
              )}
            </Button>
          ) : (
            <Button disabled={loginIsPending} variant="ghost" onClick={() => login()}>
              Sign in
            </Button>
          )}
        </div>
        <Separator />
        <PlaySideNavItems
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
              path: "#",
            },
            {
              title: "Rooms",
              label: "",
              icon: DoorClosed,
              variant: "ghost",
              selected: !!matchPath("/play/rooms", pathname),
              path: "rooms",
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
              path: "#",
            },
            {
              title: "Sandbox",
              label: "",
              icon: FlaskConical,
              variant: "ghost",
              selected: !!matchPath("/play/sandbox", pathname),
              path: "sandbox",
            },
          ]}
        />
        <Separator />
        <PlaySideNavItems
          isCollapsed={isCollapsed}
          links={[
            {
              title: "Profile",
              label: "1",
              icon: User,
              variant: "ghost",
              selected: false,
              props: {
                disabled: true,
              },
              path: "#",
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
              path: "#",
            },
          ]}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
    </>
  );
};

export { PlaySideNav };
