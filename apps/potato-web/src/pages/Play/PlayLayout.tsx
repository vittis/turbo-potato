import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCallback } from "react";
import { Navigate, Outlet } from "react-router-dom";
import debounce from "lodash.debounce";
import { PlaySideNav } from "./PlaySideNav/PlaySideNav";
import MessagesPanel from "../MessagesPanel/MessagesPanel";

const PlayLayout = () => {
  const layout = localStorage.getItem("react-resizable-panels:layout");
  const collapsed = localStorage.getItem("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed) : undefined;

  const debouncedSaveToLocalStorage = useCallback(
    debounce((sizes) => {
      localStorage.setItem("react-resizable-panels:layout", JSON.stringify(sizes));
    }, 300),
    []
  );

  return (
    <div className="main-panel grow overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={(sizes: number[]) => {
            debouncedSaveToLocalStorage(sizes);
          }}
          className="h-full items-stretch"
        >
          <PlaySideNav
            defaultCollapsed={defaultCollapsed}
            defaultSize={defaultLayout?.[0]}
            navCollapsedSize={1}
          />

          <ResizablePanel defaultSize={defaultLayout?.[1]} minSize={30}>
            <Outlet />
          </ResizablePanel>

          <MessagesPanel defaultSize={defaultLayout?.[2]} />
        </ResizablePanelGroup>
      </TooltipProvider>
    </div>
  );
};

export default PlayLayout;
