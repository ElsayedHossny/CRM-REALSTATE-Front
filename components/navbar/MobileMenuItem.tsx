import Link from "next/link";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/types/navbar";
import { SubMenuLink } from "./SubMenuLink";

interface Props {
  item: MenuItem;
  pathname: string;
  onClose: () => void;
}

export const MobileMenuItem = ({ item, pathname, onClose }: Props) => {
  const isActive = pathname === item.url;

  if (item.items) {
    return (
      <AccordionItem value={item.title} className="border-b-0">
        <AccordionTrigger className="py-2 text-sm font-semibold hover:no-underline hover:text-primary">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="pb-1">
          <ul className="flex flex-col gap-1 pr-2">
            {item.items.map((subItem) => (
              <li key={subItem.title}>
                <SubMenuLink
                  item={subItem}
                  active={pathname === subItem.url}
                  onClick={onClose}
                />
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link
      href={item.url}
      onClick={onClose}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors border-r-2",
        isActive
          ? "border-primary bg-primary/5 text-primary"
          : "border-transparent text-foreground hover:bg-muted hover:text-primary",
      )}
    >
      {item.title}
    </Link>
  );
};
