import React, { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronsDownUpIcon, ChevronsUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollapsibleHeaderProps {
  children: React.ReactNode;
  defaultIsOpen?: boolean;
  header: React.ReactNode;
}

const CollapsibleHeader = ({ children, header, defaultIsOpen = false }: CollapsibleHeaderProps) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const icon = !isOpen ? (
    <ChevronsUpDownIcon className="h-4 w-4" />
  ) : (
    <ChevronsDownUpIcon className="h-4 w-4" />
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center w-fit mb-4 gap-2 p-0 py-0 hover:bg-transparent hover:opacity-85 transition-all"
        >
          <div>
            {icon}
            <span className="sr-only">Toggle</span>
          </div>
          {header}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent">{children}</CollapsibleContent>
    </Collapsible>
  );
};

export { CollapsibleHeader };
