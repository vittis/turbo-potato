import * as React from "react";

import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AccountSwitcherProps {
  isCollapsed: boolean;
  accounts: {
    label: string;
    email: string;
    avatar: string;
  }[];
}

export function AccountSwitcher({ isCollapsed, accounts }: AccountSwitcherProps) {
  const [selectedAccount, setSelectedAccount] = React.useState<string>(accounts[0].email);

  const account = accounts.find((account) => account.email === selectedAccount);

  return (
    <Select defaultValue={selectedAccount} onValueChange={setSelectedAccount}>
      <SelectTrigger
        className={cn(
          "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed && "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select an account">
          <div className="flex items-center space-x-1">
            {account?.avatar ? (
              <div className="avatar">
                <div className="w-5 rounded-full">
                  <img alt="Tailwind CSS chat bubble component" src={account?.avatar} />
                </div>
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full dark:bg-stone-800 bg-zinc-800 dark:text-accent-foreground text-primary-foreground flex items-center justify-center text-xs">
                {account?.label?.[0]}
              </div>
            )}

            <div className={`text-ellipsis overflow-hidden text-xs text-left`}>{account?.label}</div>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {accounts.map((account) => (
          <SelectItem key={account.email} value={account.email}>
            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
              <div className="avatar">
                <div className="w-5 rounded-full">
                  <img alt="Tailwind CSS chat bubble component" src={account?.avatar} />
                </div>
              </div>
              {account.email}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
