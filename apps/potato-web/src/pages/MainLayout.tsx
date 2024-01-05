import { Nav } from "@/components/Nav/Nav";
import { useCallback } from "react";
import debounce from "lodash.debounce";
import SideNav from "./Play/SideNav/SideNav";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import LobbyView from "./Play/Views/Lobby/LobbyView";
import MessagesPanel from "./MessagesPanel/MessagesPanel";
import { useFetchProfile } from "@/services/state/useFetchProfile";

const MainLayout = () => {
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

  useFetchProfile();

  return (
    <>
      <div className="relative h-full p-4">
        <section className="flex flex-col h-full">
          <Nav />
          <div className="main-panel grow overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
            <TooltipProvider delayDuration={0}>
              <ResizablePanelGroup
                direction="horizontal"
                onLayout={(sizes: number[]) => {
                  debouncedSaveToLocalStorage(sizes);
                }}
                className="h-full items-stretch"
              >
                <SideNav
                  defaultCollapsed={defaultCollapsed}
                  defaultSize={defaultLayout?.[0]}
                  navCollapsedSize={1}
                />

                <LobbyView defaultSize={defaultLayout?.[1]} />

                <MessagesPanel defaultSize={defaultLayout?.[2]} />
              </ResizablePanelGroup>
            </TooltipProvider>
          </div>
        </section>
      </div>
    </>
  );
};

export { MainLayout };
