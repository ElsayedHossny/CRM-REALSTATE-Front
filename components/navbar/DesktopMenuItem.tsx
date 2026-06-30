import {
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/types/navbar";
import { SubMenuLink } from "./SubMenuLink";

interface Props {
  item: MenuItem;
  pathname: string;
}

export const DesktopMenuItem = ({ item, pathname }: Props) => {
  const isActive = pathname === item.url;

  if (item.items) {
    const isChildActive = item.items.some((s) => pathname === s.url);
    return (
      <NavigationMenuItem>
        <NavigationMenuTrigger
          className={cn(
            "text-sm font-medium bg-transparent hover:bg-transparent hover:text-primary",
            isChildActive ? "text-primary" : "text-muted-foreground",
          )}
        >
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground rounded-xl shadow-lg p-2">
          <ul className="w-64 flex flex-col gap-1">
            {item.items.map((subItem) => (
              <li key={subItem.title}>
                <NavigationMenuLink asChild>
                  <SubMenuLink
                    item={subItem}
                    active={pathname === subItem.url}
                  />
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        href={item.url}
        className={cn(
          "relative inline-flex h-9 items-center justify-center px-3 py-2 text-sm font-medium transition-colors",
          "hover:text-primary focus:outline-none",
          "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:transition-transform",
          isActive
            ? "text-primary after:bg-primary after:scale-x-100"
            : "text-muted-foreground after:bg-primary after:scale-x-0 hover:after:scale-x-100",
        )}
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};
