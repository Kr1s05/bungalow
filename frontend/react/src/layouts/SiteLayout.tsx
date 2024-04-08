import { NavBar } from "@/components/NavBar";
import { Outlet } from "react-router-dom";
function SiteLayout() {
  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-col bg-background grow">
        <Outlet />
      </div>
    </div>
  );
}

export default SiteLayout;
