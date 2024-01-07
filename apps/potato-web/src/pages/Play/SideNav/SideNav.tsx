import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { SideNavItems } from "./SideNavItems";
import { AlertCircle, DoorClosed, Swords, Trophy, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/services/state/useAuth";
import { useUserStore } from "@/services/features/User/useUserStore";

interface SideNavProps {
  defaultCollapsed: boolean;
  defaultSize: number;
  navCollapsedSize: number;
}

const SideNav = ({ defaultCollapsed, defaultSize, navCollapsedSize }: SideNavProps) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const userData = useUserStore((state) => state.userData);

  const { login, loginIsPending } = useAuth();

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
            <Button variant="ghost" onClick={() => login()} disabled={loginIsPending}>
              Sign in
            </Button>
          )}
        </div>
        <Separator />
        <SideNavItems
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
        <SideNavItems
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
    </>
  );
};

export default SideNav;
