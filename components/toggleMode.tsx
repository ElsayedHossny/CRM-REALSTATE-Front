"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export default function ToggleMode() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { open } = useSidebar();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!open) return null;

  return (
    <Button
      variant="ghost"
      className="cursor-pointer p-0 w-auto h-auto"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Moon className="size-4 stroke-gray-100" />
      ) : (
        <Sun className="size-4 stroke-gray-900" />
      )}
    </Button>
  );
}
