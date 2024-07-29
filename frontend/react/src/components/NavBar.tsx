import { Button } from "@/components/ui/button";
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet";
import { NavLink as Link } from "react-router-dom";
import {
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenu,
} from "@/components/ui/navigation-menu";

import { Menu, Search, Calendar, Plus } from "react-feather";
import { LogOut, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useAuth } from "oidc-react";

const linkClassnames =
  "inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-base font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 bg-background text-primary hover:text-secondary hover:bg-primary focus:text-secondary focus:bg-primary data-[active]:text-secondary data-[active]:bg-primary data-[state=open]:text-secondary data-[state=open]:bg-primary shadow-lg px-8";

export function NavBar() {
  const auth = useAuth();
  return (
    <header
      className="flex h-20 w-full shrink-0 items-center px-4 md:px-6"
      role="navigation"
    >
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="lg:hidden aspect-square"
            size="icon"
            variant="outline"
          >
            <Menu />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="px-14">
          <div className="grid gap-2 py-6">
            {/* <Link
              className="flex w-full items-center py-2 text-xl font-semibold"
              to={"/"}
            >
              <Home size={15} className="mr-2" />
              Home
            </Link> */}
            <Link
              className="flex w-full items-center py-2 text-xl font-semibold"
              to={"/private/calendar"}
            >
              <Calendar size={15} className="mr-2" />
              Calendar
            </Link>
            <Link
              className="flex w-full items-center py-2 text-xl font-semibold"
              to={"/private/search"}
            >
              <Search size={15} className="mr-2" />
              Search
            </Link>
            <Link
              className="flex w-full items-center py-2 text-xl font-semibold"
              to={"/private/add"}
            >
              <Plus size={18} className="mr-1" />
              Add
            </Link>
            <Popover>
              <PopoverTrigger asChild>
                <Button className="mt-10" variant={"outline"}>
                  <User size={24} />
                </Button>
              </PopoverTrigger>
              <PopoverContent sideOffset={10} align="center" className="">
                <div className="flex flex-col">
                  <span>{auth.userData?.profile.name}</span>
                  <span className="text-muted-foreground">
                    {auth.userData?.profile.email}
                  </span>
                  <Button
                    className="w-fit mt-4"
                    onClick={() => auth.signOutRedirect()}
                  >
                    <LogOut size={18} />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex w-full justify-center mt-4">
        <div className="hidden lg:flex w-fit rounded-full bg-secondary px-12 py-2">
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="flex flex-row ">
              {/* <NavigationMenuLink asChild>
                <Link className={linkClassnames + " mr-28"} to={"/"}>
                  <Home size={22} />
                </Link>
              </NavigationMenuLink> */}
              <NavigationMenuLink asChild>
                <Link className={linkClassnames} to={"/private/search"}>
                  <Search size={15} className="mr-1" />
                  Search
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link className={linkClassnames} to={"/private/calendar"}>
                  <Calendar size={15} className="mr-1" />
                  Calendar
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link className={linkClassnames} to={"/private/add"}>
                  <Plus size={18} />
                  Add
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className={linkClassnames + " !ms-28"}>
                      <User size={24} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent sideOffset={10} align="end">
                    <div className="flex flex-col">
                      <span>{auth.userData?.profile.name}</span>
                      <span className="text-muted-foreground">
                        {auth.userData?.profile.email}
                      </span>
                      <Button
                        className="w-fit mt-4"
                        onClick={() => auth.signOutRedirect()}
                      >
                        <LogOut size={18} />
                        Logout
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </NavigationMenuLink>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
}
