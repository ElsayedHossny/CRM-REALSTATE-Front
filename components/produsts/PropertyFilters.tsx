"use client";

import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Plus,
  LayoutGrid,
  List,
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
  categories: FilterOption[]; // ✅ ديناميكية من الـ API
  areaOptions: FilterOption[]; // ✅ ديناميكية من الـ Parent
  activeArea: string;
  onAreaChange: (area: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
};

// ✅ أيقونة افتراضية لكل تصنيف — ممكن تضيف mapping هنا لو عندك أيقونات محددة
const ICON_MAP: Record<string, any> = {
  apartment: Building2,
  villa: Home,
  chalet: Umbrella,
};

export function PropertyTypeFilters({
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
      className="flex flex-wrap items-center justify-between gap-4 w-full border-b border-slate-100 pb-5"
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
                  ? "border-transparent bg-green-700 text-white shadow-sm"
                  : "border-border bg-background text-foreground hover:bg-muted",
              )}
            >
              <span
                className={cn(
                  "flex h-[22px] w-[22px] items-center justify-center rounded-full text-xs font-medium",
                  isActive
                    ? "bg-white/25 text-white"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {counts[cat.id] ?? 0}
              </span>
              <span className="font-medium">{cat.label}</span>
              <Icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-white" : "text-muted-foreground",
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
            className="w-full appearance-none text-right rounded-xl border border-slate-200 bg-white py-2 pr-4 pl-10 text-sm font-medium h-10 outline-none cursor-pointer"
          >
            {categories.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        </div>

        {/* ✅ فلتر المساحة — ديناميكي من الـ areaOptions */}
        <div className="relative min-w-[140px]">
          <select
            value={activeArea}
            onChange={(e) => onAreaChange(e.target.value)}
            className="w-full appearance-none text-right rounded-xl border border-slate-200 bg-white py-2 pr-4 pl-10 text-sm font-medium h-10 outline-none cursor-pointer"
          >
            {areaOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        </div>

        {/* 3. أزرار التحكم في العرض */}
        <div className="flex items-center border border-slate-200 bg-white p-1 rounded-xl h-10">
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={cn(
              "p-1.5 rounded-lg",
              viewMode === "list" && "bg-green-700 text-white",
            )}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "p-1.5 rounded-lg",
              viewMode === "grid" && "bg-green-700 text-white",
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>

        <Link
          href="/products/create"
          className="h-10 px-4 bg-green-700 text-white font-semibold text-sm rounded-xl flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> <span>إضافة عقار جديد</span>
        </Link>
      </div>
    </div>
  );
}
