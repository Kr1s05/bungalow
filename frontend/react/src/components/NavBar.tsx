import { Button } from "@/components/ui/button";
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet";
import { NavLink as Link } from "react-router-dom";
import {
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenu,
} from "@/components/ui/navigation-menu";

import { Menu } from "react-feather";

const linkClassnames =
  "inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-base font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 bg-secondary text-primary hover:text-secondary hover:bg-primary focus:text-secondary focus:bg-primary data-[active]:text-secondary data-[active]:bg-primary data-[state=open]:text-secondary data-[state=open]:bg-primary";

export function NavBar() {
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
        <SheetContent side="right">
          <div className="grid gap-2 py-6">
            <Link
              className="flex w-full items-center py-2 text-lg font-semibold"
              to={"/"}
            >
              Home
            </Link>
            <Link
              className="flex w-full items-center py-2 text-lg font-semibold"
              to={"/game"}
            >
              Game
            </Link>
            <Link
              className="flex w-full items-center py-2 text-lg font-semibold"
              to={"/about"}
            >
              About
            </Link>
            <Link
              className="flex w-full items-center py-2 text-lg font-semibold"
              to={"/scoreboard"}
            >
              Scoreboard
            </Link>
            <Button className="mt-4" variant="outline">
              <Link to={"/login"}>Login</Link>
            </Button>
            <Button className="mt-2">Register</Button>
          </div>
        </SheetContent>
      </Sheet>
      <Link className="mr-6 hidden lg:flex" to={""}>
        <span className="sr-only">Tic Tac Toe</span>
      </Link>
      <div className="flex w-full justify-center">
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuLink asChild>
              <Link className={linkClassnames} to={"/"}>
                Home
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link className={linkClassnames} to={"/game"}>
                Game
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link className={linkClassnames} to={"/about"}>
                About
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link className={linkClassnames} to={"/scoreboard"}>
                Scoreboard
              </Link>
            </NavigationMenuLink>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
