import { Nav } from "@/components/Nav/Nav";
import { useCallback, useEffect } from "react";
import debounce from "lodash.debounce";
import { PlaySideNav } from "./Play/PlaySideNav/PlaySideNav";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import LobbyView from "./Play/Views/Lobby/LobbyView";
import MessagesPanel from "./MessagesPanel/MessagesPanel";
import { useFetchProfile } from "@/services/features/User/useFetchProfile";
import { useGlobalConnection } from "@/services/features/Global/useGlobalConnection";
import { supabase } from "@/services/supabase/supabase";
import { useSupabaseUserStore } from "@/services/features/User/useSupabaseUserStore";
import { useSetupState } from "@/services/state/useSetupState";
import App from "@/App";
import { SetupView } from "./Setup/SetupView";
import { Outlet } from "react-router-dom";

const MainWrapper = () => {
  const shouldStartGame = useSetupState((state) => state.shouldStartGame);

  if (shouldStartGame) {
    return <App />;
  }

  return <SetupView />;
};

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

  const setUser = useSupabaseUserStore((state) => state.setUser);

  // useFetchProfile();
  useGlobalConnection();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);
      if (event === "SIGNED_OUT") {
        setUser(null);
      }
      if (session && session.user) {
        console.log(session.user);
        setUser(session.user);
      }
    });
  }, []);

  return (
    <>
      <Outlet />
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
                <PlaySideNav
                  defaultCollapsed={defaultCollapsed}
                  defaultSize={defaultLayout?.[0]}
                  navCollapsedSize={1}
                />

                <LobbyView />

                <MessagesPanel defaultSize={defaultLayout?.[2]} />
              </ResizablePanelGroup>
            </TooltipProvider>
          </div>
        </section>
      </div>
    </>
  );
};

export { MainWrapper, MainLayout };
