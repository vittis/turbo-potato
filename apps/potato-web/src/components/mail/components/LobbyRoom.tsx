import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { queryClient } from "@/services/api/queryClient";
import { useMutation } from "@tanstack/react-query";
import {
  ChevronDownIcon,
  CircleIcon,
  ClockIcon,
  CrownIcon,
  DoorOpenIcon,
  FlaskConical,
  LogOutIcon,
  PlusIcon,
  StarIcon,
  SwordsIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useUserStore } from "@/services/state/user";

interface LobbyRoomMember {
  id: string;
  name: string;
  isCreator: boolean;
  avatar?: string;
}

interface LobbyRoomProps {
  id: string;
  name: string;
  description?: string;
  members: LobbyRoomMember[];
  maxMembers: number;
  lastUpdated: string; // todo date
  type?: "Duel" | "Free for All" | "Custom";
}

const Avatar = ({ name = "", isCreator = false, avatar = "", isYou = false }) => {
  const maxW = isCreator ? "max-w-[78px]" : "max-w-[95px]";
  const textColor = isCreator
    ? "dark:text-yellow-300 text-primary"
    : isYou
    ? "text-green-300"
    : "dark:text-stone-300";

  return (
    <Button
      size="sm"
      variant="ghost"
      className="w-full justify-between relative flex space-x-2 items-center px-1.5 h-[30px]"
    >
      <div className="flex items-center space-x-1">
        {avatar ? (
          <div className="avatar">
            <div className="w-5 rounded-full">
              <img alt="Tailwind CSS chat bubble component" src={avatar} />
            </div>
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full dark:bg-stone-800 bg-zinc-800 dark:text-accent-foreground text-primary-foreground flex items-center justify-center text-xs">
            {name?.[0]?.toUpperCase()}
          </div>
        )}

        <div className={`${maxW} ${textColor} text-ellipsis overflow-hidden text-xs text-left`}>
          {name}
        </div>
      </div>

      {isCreator ? (
        <CrownIcon className="w-3 fill-yellow-700 text-yellow-700 dark:fill-yellow-300 dark:text-yellow-300" />
      ) : isYou ? (
        <UserIcon className="w-3 fill-green-300 text-green-300" />
      ) : null}
    </Button>
  );
};

async function joinRoom(id) {
  const res = await fetch(`http://localhost:8080/api/rooms/${id}/join`, {
    method: "POST",
    credentials: "include",
  });
  const data = await res.json();
  return data;
}
async function leaveRoom(id) {
  const res = await fetch(`http://localhost:8080/api/rooms/${id}/leave`, {
    method: "POST",
    credentials: "include",
  });
  const data = await res.json();
  return data;
}

const LobbyRoom = ({
  id,
  name,
  description,
  members = [],
  lastUpdated,
  maxMembers,
  type = "Duel",
}: LobbyRoomProps) => {
  const userData = useUserStore((state) => state.userData);
  const isInRoom = !!members.find((member) => member.id === userData?.userId);
  const isFull = members.length === maxMembers;
  const isInAnyRoom = userData?.rooms?.length > 0;
  const shouldShowJoinButton = !isFull && !isInAnyRoom;
  const hasMoreThan3Members = members.length >= 3;

  const icon =
    type === "Duel" ? (
      <SwordsIcon className="mr-1 h-3 w-3 dark:fill-yellow-400 dark:text-yellow-400" />
    ) : type === "Free for All" ? (
      <UsersIcon className="mr-1 h-3 w-3 dark:fill-yellow-400 dark:text-yellow-400" />
    ) : (
      <FlaskConical className="mr-1 h-3 w-3 dark:fill-black-800 dark:text-yellow-400" />
    );

  const { mutate: joinMutation } = useMutation({
    mutationFn: joinRoom,
    mutationKey: ["join"],
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["lobby/rooms"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const { mutate: leaveMutation } = useMutation({
    mutationFn: leaveRoom,
    mutationKey: ["leave"],
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["lobby/rooms"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  function onClickJoin() {
    joinMutation(id);
  }
  function onClickLeave() {
    leaveMutation(id);
  }

  const orderedMembers = members.sort((a, b) => {
    if (a.isCreator) return -1; // Creator comes first
    if (a.id === userData?.userId && !b.isCreator) return -1; // You come second
    if (b.isCreator) return 1; // Creator comes first
    if (b.id === userData?.userId) return 1; // You come second
    return 0; // Keep the rest in the same order
  });

  return (
    <Card
      className={cn(
        "max-w-[420px] min-h-[180px] flex flex-col m-1 bg-pattern-gradient",
        !isInRoom && !isFull && "bg-pattern-gradient" /* glow-sm-success */,
        !isInRoom && isFull && "bg-pattern-gradient-error" /* glow-sm-error */
      )}
    >
      <CardHeader className="flex flex-row space-y-0 px-0.5">
        <div className="space-y-3 w-1/2 px-4">
          <CardTitle className="text-lg">{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="w-1/2">
          <ScrollArea
            className={cn(
              "max-h-[100px] h-full w-full px-3.5",
              isFull && members.length >= 3 && "max-h-[136px] "
            )}
          >
            <ScrollBar />
            <div className="space-y-1">
              {orderedMembers.map((member) => (
                <Avatar key={member.id} isYou={member.id === userData.userId} {...member} />
              ))}

              {shouldShowJoinButton && !hasMoreThan3Members && (
                <Button
                  onClick={onClickJoin}
                  size="sm"
                  variant="outline"
                  className="justify-between w-full relative flex space-x-2 items-center px-1.5 h-[30px]"
                >
                  Join
                  <PlusIcon className="w-4 fill-red-300 text-red-300" />
                </Button>
              )}
            </div>
          </ScrollArea>
          {shouldShowJoinButton && hasMoreThan3Members && (
            <div className="pt-1 px-4">
              <Button
                onClick={onClickJoin}
                size="sm"
                variant="outline"
                className="justify-between w-full relative flex space-x-2 items-center px-1.5 h-[30px]"
              >
                Join
                <PlusIcon className="w-4 fill-red-300 text-red-300" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col-reverse flex-1 gap-2 mt-3">
        <div className="flex space-x-4 text-sm text-muted-foreground items-center justify-between">
          <div className="flex space-x-3">
            <div className="flex items-center">
              {icon}
              {type}
            </div>

            <div className="flex items-center">
              <CircleIcon
                className={cn(
                  "mr-1 h-3 w-3 fill-green-400 text-green-400",
                  isFull && "text-red-400 fill-red-400"
                )}
              />
              {members.length}/{maxMembers}
            </div>
          </div>

          <div className="text-xs flex items-center gap-1">
            <ClockIcon className="h-3 w-3" /> <time>{formatDistanceToNow(lastUpdated)} ago</time>
            {isInRoom && (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onClickLeave}
                    size="sm"
                    variant="ghost"
                    className="justify-between relative flex items-center px-2 h-[30px]"
                  >
                    <LogOutIcon className="w-4 text-rose-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Leave</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { LobbyRoom };
