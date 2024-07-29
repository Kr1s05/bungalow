import { NavBar } from "@/components/NavBar";
import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router-dom";
function SiteLayout() {
  return (
    <div className="h-screen flex flex-col relative">
      <NavBar />
      <div className="flex flex-col bg-background grow">
        <Outlet />
      </div>
      <Toaster />
    </div>
  );
}

export default SiteLayout;
