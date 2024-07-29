import HomeCalendar from "@/components/HomeCalendar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-6 relative">
      <ScrollArea
        className="h-[calc(100vh-125px)]"
        viewPortClasses="lg:flex lg:items-center"
      >
        <HomeCalendar />
      </ScrollArea>
    </main>
  );
}
