import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Button } from "./ui/button";

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

export function ExamplesNav({ className, ...props }: ExamplesNavProps) {
  return (
    <div className="relative">
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
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}
