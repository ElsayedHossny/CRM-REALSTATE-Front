"use client";

import { cn } from "@/lib/utils";
import {
  ChevronDown,
  LayoutGrid,
  Building2,
  Home,
  Umbrella,
} from "lucide-react";
import Link from "next/link";

type FilterOption = { id: string; label: string; icon?: any };

type Props = {
  active: string;
  onChange: (id: string) => void;
  counts: Record<string, number>;
  categories: FilterOption[];
  areaOptions: FilterOption[];
  activeArea: string;
  onAreaChange: (area: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
};

const ICON_MAP: Record<string, any> = {
  apartment: Building2,
  villa: Home,
  chalet: Umbrella,
};

export function PropertyTypeFiltersSite({
  active,
  onChange,
  counts,
  categories,
  areaOptions,
  activeArea,
  onAreaChange,
  viewMode,
  onViewModeChange,
}: Props) {
  const getIcon = (id: string) => ICON_MAP[id] ?? LayoutGrid;

  return (
    <div
      dir="rtl"
      className="flex flex-wrap items-center justify-between gap-4 w-full border-b border-slate-100 dark:border-neutral-800 pb-5"
    >
      {/* 1. أزرار الفلتر الديناميكية */}
      <div className="flex flex-wrap gap-2.5">
        {categories.map((cat) => {
          const isActive = active === cat.id;
          const Icon = getIcon(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange(cat.id)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-all cursor-pointer",
                isActive
                  ? "border-transparent bg-green-700 dark:bg-green-600 text-white shadow-sm shadow-green-900/20 dark:shadow-green-950/40"
                  : "border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-zinc-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-neutral-800 hover:border-slate-300 dark:hover:border-neutral-600",
              )}
            >
              <span
                className={cn(
                  "flex h-[22px] w-[22px] items-center justify-center rounded-full text-xs font-medium",
                  isActive
                    ? "bg-white/25 text-white"
                    : "bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400",
                )}
              >
                {counts[cat.id] ?? 0}
              </span>
              <span className="font-medium">{cat.label}</span>
              <Icon
                className={cn(
                  "h-4 w-4",
                  isActive
                    ? "text-white"
                    : "text-slate-400 dark:text-neutral-500",
                )}
              />
            </button>
          );
        })}
      </div>

      {/* 2. القوائم المنسدلة */}
      <div className="flex items-center flex-wrap sm:flex-nowrap gap-3">
        {/* فلتر النوع */}
        <div className="relative min-w-[140px]">
          <select
            value={active}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none text-right rounded-xl border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-zinc-800 dark:text-zinc-200 py-2 pr-4 pl-10 text-sm font-medium h-10 outline-none cursor-pointer focus:border-green-600 dark:focus:border-green-500 transition-colors"
          >
            {categories.map((opt) => (
              <option
                key={opt.id}
                value={opt.id}
                className="bg-white dark:bg-neutral-900 text-zinc-800 dark:text-zinc-200"
              >
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-neutral-400" />
        </div>

        {/* فلتر المساحة */}
        <div className="relative min-w-[140px]">
          <select
            value={activeArea}
            onChange={(e) => onAreaChange(e.target.value)}
            className="w-full appearance-none text-right rounded-xl border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-zinc-800 dark:text-zinc-200 py-2 pr-4 pl-10 text-sm font-medium h-10 outline-none cursor-pointer focus:border-green-600 dark:focus:border-green-500 transition-colors"
          >
            {areaOptions.map((opt) => (
              <option
                key={opt.id}
                value={opt.id}
                className="bg-white dark:bg-neutral-900 text-zinc-800 dark:text-zinc-200"
              >
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-neutral-400" />
        </div>
      </div>
    </div>
  );
}
