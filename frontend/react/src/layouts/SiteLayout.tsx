import { NavBar } from "@/components/NavBar";
import { Outlet } from "react-router-dom";
function SiteLayout() {
  return (
    <div className="h-screen flex flex-col relative">
      <NavBar />
      <div className="absolute top-2 right-2">
        <span className="sm:hidden">xs</span>
        <span className="hidden sm:block md:hidden">sm</span>
        <span className="hidden md:block lg:hidden">md</span>
        <span className="hidden lg:block xl:hidden">lg</span>
        <span className="hidden xl:block 2xl:hidden">xl</span>
        <span className="hidden 2xl:block">2xl</span>
      </div>
      <div className="flex flex-col bg-background grow">
        <Outlet />
      </div>
    </div>
  );
}

export default SiteLayout;
