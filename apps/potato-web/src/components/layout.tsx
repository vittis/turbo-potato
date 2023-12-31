import { ExamplesNav } from "./Nav";

interface ExamplesLayoutProps {
  children: React.ReactNode;
}

export default function ExamplesLayout({ children }: ExamplesLayoutProps) {
  return (
    <>
      <div className="relative h-full p-4">
        <section className="flex flex-col h-full">
          <ExamplesNav />
          <div className="grow overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
            {children}
          </div>
        </section>
      </div>
    </>
  );
}
