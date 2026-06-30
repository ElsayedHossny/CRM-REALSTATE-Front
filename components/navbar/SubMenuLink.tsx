import Link from "next/link";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/types/navbar";

interface SubMenuLinkProps {
  item: MenuItem;
  active?: boolean;
  onClick?: () => void;
}

export const SubMenuLink = ({ item, active, onClick }: SubMenuLinkProps) => (
  <Link
    href={item.url}
    onClick={onClick}
    className={cn(
      "flex items-start gap-3 rounded-lg p-3 text-sm transition-colors",
      "hover:bg-muted hover:text-foreground",
      active && "bg-primary/10 text-primary font-medium",
    )}
  >
    {item.icon && (
      <span className="mt-0.5 shrink-0 text-muted-foreground">{item.icon}</span>
    )}
    <div>
      <p className="font-medium leading-none mb-1">{item.title}</p>
      {item.description && (
        <p className="text-xs text-muted-foreground leading-snug">
          {item.description}
        </p>
      )}
    </div>
  </Link>
);
