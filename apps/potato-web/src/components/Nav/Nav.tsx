import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { ThemeModeToggle } from "../ThemeModeToggle/ThemeModeToggle";
import { useAuth } from "@/services/state/useAuth";
import { useUserStore } from "@/services/features/User/useUserStore";

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
      <div className="grow flex justify-end gap-4">
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
        <ThemeModeToggle />
      </div>
    </div>
  );
}
