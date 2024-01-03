import { useQuery } from "@tanstack/react-query";
import { ExamplesNav } from "./Nav";
import { useEffect } from "react";
import { useUserStore } from "@/services/state/user";

interface ExamplesLayoutProps {
  children: React.ReactNode;
}

async function fetchProfile() {
  const res = await fetch("http://localhost:8080/api/profile", {
    credentials: "include",
  });
  const data = await res.json();
  console.log(data);
  return data;
}

export default function ExamplesLayout({ children }: ExamplesLayoutProps) {
  const { data, isSuccess } = useQuery({ queryKey: ["profile"], queryFn: fetchProfile });
  const setUserData = useUserStore((state) => state.setUserData);
  useEffect(() => {
    if (isSuccess && data.data) {
      setUserData({ ...data.data, rooms: JSON.parse(data.data.rooms) });
    } else {
      setUserData({ name: "", userId: "", rooms: [] });
    }
  }, [data, isSuccess]);

  return (
    <>
      <div className="fixed top-4 right-4"></div>
      <div className="relative h-full p-4">
        <section className="flex flex-col h-full">
          <ExamplesNav />
          <div className="main-panel grow overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
            {children}
          </div>
        </section>
      </div>
    </>
  );
}
