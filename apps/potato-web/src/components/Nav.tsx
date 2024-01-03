import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/services/api/queryClient";
import { useEffect } from "react";
import { useUserStore } from "@/services/state/user";

// todo delete later
export const mockChatNavItems = [
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

interface ExamplesNavProps extends React.HTMLAttributes<HTMLDivElement> {}

async function loginMutation() {
  const res = await fetch("http://localhost:8080/login", {
    method: "POST",
    credentials: "include",
  });
  const data = await res.json();
  return data;
}

async function logoutMutation() {
  const res = await fetch("http://localhost:8080/logout", {
    method: "POST",
    credentials: "include",
  });
  const data = await res.json();
  return data;
}

export function ExamplesNav({ className, ...props }: ExamplesNavProps) {
  const userData = useUserStore((state) => state.userData);
  const { mutate } = useMutation({
    mutationFn: loginMutation,
    mutationKey: ["login"],
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["lobby/rooms"] });
    },
  });

  const { mutate: mutateLogout } = useMutation({
    mutationFn: logoutMutation,
    mutationKey: ["logout"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["lobby/rooms"] });
    },
  });

  return (
    <div className="relative flex">
      <ScrollArea className="max-w-[100%] lg:max-w-none">
        <div className={cn("mb-4 flex items-center", className)} {...props}>
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
          <Button onClick={() => mutate()}>Sign In</Button>
        ) : (
          <div className="">
            Logged as <span className="text-primary mr-2">{userData.name}</span>{" "}
            <Button onClick={() => mutateLogout()} variant="destructive">
              Sign Out
            </Button>
          </div>
        )}
        <ModeToggle />
      </div>
    </div>
  );
}
