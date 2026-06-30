"use client";

import { Menu, X, LogOut, Building2 } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Accordion } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import { UserContext } from "@/app/(site)/(Context)/Context";
import SiteToggleMode from "../SiteToggleMode";
import { DesktopMenuItem } from "@/components/navbar/DesktopMenuItem";
import { MobileMenuItem } from "@/components/navbar/MobileMenuItem";
import {
  NavbarProps,
  DEFAULT_LOGO,
  DEFAULT_MENU,
  DEFAULT_AUTH,
} from "../../types/navbar";

const Navbar = ({
  logo = DEFAULT_LOGO,
  menu = DEFAULT_MENU,
  auth = DEFAULT_AUTH,
  className,
}: NavbarProps) => {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { UserToken, setUserToken } = useContext(UserContext)!;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setSheetOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("userToken2");
    setUserToken(null);
    window.location.href = "/";
  };

  const reversedMenu = [...menu].reverse();

  return (
    <div className="fixed top-4 left-0 right-0 z-50 w-full flex justify-center px-4 sm:px-6 lg:px-8">
      <header
        dir="rtl"
        className={cn(
          "w-full max-w-7xl border transition-all duration-300",
          scrolled
            ? "bg-white/55 dark:bg-zinc-950/50 backdrop-blur-2xl border-zinc-200/70 dark:border-white/10 rounded-full shadow-xl shadow-zinc-300/30 dark:shadow-black/40 py-1"
            : "bg-white/25 dark:bg-zinc-950/20 backdrop-blur-md border-zinc-200/40 dark:border-white/5 rounded-[2rem] py-2",
          className,
        )}
      >
        <div className="w-full px-6 sm:px-8">
          {/* ───── Desktop ───── */}
          <nav className="hidden lg:flex items-center justify-between h-14 gap-8">
            {/* Logo */}
            <Link
              href={logo.url}
              className="flex items-center gap-2.5 shrink-0 group"
            >
              <div className="relative w-9 h-9 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center transition-all group-hover:scale-105 group-hover:rotate-3 duration-300 shadow-md shadow-green-700/30">
                <Building2 className="size-4.5 text-white" />
              </div>
              <span className="text-base font-black tracking-tight text-zinc-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors duration-200 drop-shadow-[0_1px_3px_rgba(255,255,255,0.4)] dark:drop-shadow-none">
                {logo.title}
              </span>
            </Link>

            {/* Links */}
            <NavigationMenu className="flex-1 flex justify-center text-zinc-900 dark:text-white [&_a]:text-zinc-800 dark:[&_a]:text-zinc-100 [&_span]:text-zinc-900 dark:[&_span]:text-white [&_ul_li_a:hover]:bg-green-50/70 dark:[&_ul_li_a:hover]:bg-white/10 [&_ul_li_a:hover]:text-green-700 dark:[&_ul_li_a:hover]:text-green-400 [&_ul_li_div:hover]:bg-green-50/70 dark:[&_ul_li_div:hover]:bg-white/10 [&_ul_li_div:hover]:text-green-700 dark:[&_ul_li_div:hover]:text-green-400 transition-all">
              <NavigationMenuList className="gap-1">
                {reversedMenu.map((item) => (
                  <DesktopMenuItem
                    key={item.title}
                    item={item}
                    pathname={pathname}
                  />
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-zinc-900 dark:text-white [&_svg]:text-zinc-900 dark:[&_svg]:text-white [&_button]:text-zinc-900 dark:[&_button]:text-white hover:[&_button]:bg-white/40 dark:hover:[&_button]:bg-white/10 rounded-lg transition-colors">
                <SiteToggleMode />
              </div>

              <div className="w-px h-6 bg-zinc-300/50 dark:bg-white/15" />

              {UserToken ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 rounded-full font-medium transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4" />
                  تسجيل الخروج
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-zinc-900 dark:text-white hover:text-green-700 dark:hover:text-green-400 font-bold hover:bg-white/40 dark:hover:bg-white/10 rounded-full px-4 transition-colors"
                  >
                    <Link href={auth.login.url}>{auth.login.title}</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="rounded-full px-5 bg-gradient-to-l from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white font-bold shadow-md shadow-green-900/25 dark:shadow-green-950/40 active:scale-[0.97] transition-all duration-200"
                  >
                    <Link href={auth.signup.url}>{auth.signup.title}</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>

          {/* ───── Mobile ───── */}
          <div className="flex lg:hidden items-center justify-between h-12">
            <Link href={logo.url} className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center shadow-sm shadow-green-700/30">
                <Building2 className="size-3.5 text-white" />
              </div>
              <span className="text-sm font-black text-zinc-900 dark:text-white drop-shadow-[0_1px_3px_rgba(255,255,255,0.4)] dark:drop-shadow-none">
                {logo.title}
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="text-zinc-900 dark:text-white [&_svg]:text-zinc-900 dark:[&_svg]:text-white hover:[&_button]:bg-white/40 dark:hover:[&_button]:bg-white/10 rounded-lg">
                <SiteToggleMode />
              </div>

              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="القائمة"
                    className="text-zinc-900 dark:text-white hover:bg-white/40 dark:hover:bg-white/10"
                  >
                    {sheetOpen ? (
                      <X className="size-5" />
                    ) : (
                      <Menu className="size-5" />
                    )}
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="w-72 flex flex-col p-0 bg-white/80 dark:bg-zinc-950/85 backdrop-blur-2xl border-white/20 dark:border-white/10 text-zinc-900 dark:text-white"
                  dir="rtl"
                >
                  <SheetHeader className="p-5 pb-4">
                    <SheetTitle>
                      <Link
                        href={logo.url}
                        className="flex items-center gap-2"
                        onClick={() => setSheetOpen(false)}
                      >
                        <div className="w-7 h-7 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center shadow-sm shadow-green-700/30">
                          <Building2 className="size-3.5 text-white" />
                        </div>
                        <span className="text-sm font-black text-zinc-900 dark:text-white">
                          {logo.title}
                        </span>
                      </Link>
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                      قائمة التنقل الرئيسية
                    </SheetDescription>
                  </SheetHeader>

                  <Separator className="bg-zinc-200/60 dark:bg-white/10" />

                  {/* Nav links */}
                  <div className="flex-1 overflow-y-auto p-3 [&_span]:text-zinc-900 dark:[&_span]:text-white">
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full space-y-0.5"
                    >
                      {reversedMenu.map((item) => (
                        <MobileMenuItem
                          key={item.title}
                          item={item}
                          pathname={pathname}
                          onClose={() => setSheetOpen(false)}
                        />
                      ))}
                    </Accordion>
                  </div>

                  <Separator className="bg-zinc-200/60 dark:bg-white/10" />

                  {/* Auth buttons */}
                  <div className="p-4 space-y-2">
                    {UserToken ? (
                      <Button
                        variant="destructive"
                        className="w-full gap-2 rounded-full font-medium"
                        onClick={() => {
                          handleLogout();
                          setSheetOpen(false);
                        }}
                      >
                        <LogOut className="size-4" />
                        تسجيل الخروج
                      </Button>
                    ) : (
                      <>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full rounded-full border-zinc-200 dark:border-white/20 text-zinc-900 dark:text-white bg-white/40 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10"
                        >
                          <Link
                            href={auth.login.url}
                            onClick={() => setSheetOpen(false)}
                          >
                            {auth.login.title}
                          </Link>
                        </Button>
                        <Button
                          asChild
                          className="w-full rounded-full bg-gradient-to-l from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white font-bold shadow-md shadow-green-900/20"
                        >
                          <Link
                            href={auth.signup.url}
                            onClick={() => setSheetOpen(false)}
                          >
                            {auth.signup.title}
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
