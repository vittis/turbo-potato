import { Button } from "@/components/ui/button";
import { Crown, User } from "lucide-react";

interface LobbyRoomUserRow {
  name: string;
  avatar?: string;
  isCreator: boolean;
  isYou?: boolean;
}

export const LobbyRoomUserRow = ({
  name = "",
  isCreator = false,
  avatar = "",
  isYou = false,
}: LobbyRoomUserRow) => {
  const maxW = isCreator ? "max-w-[78px]" : "max-w-[95px]";
  const textColor = isYou
    ? "text-green-300"
    : isCreator
    ? "dark:text-yellow-300 text-primary"
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

      <div className="flex gap-2">
        {isYou && <User className="w-3 fill-green-300 text-green-300" />}
        {isCreator && (
          <Crown className="w-3 fill-yellow-700 text-yellow-700 dark:fill-yellow-300 dark:text-yellow-300" />
        )}
      </div>
    </Button>
  );
};
