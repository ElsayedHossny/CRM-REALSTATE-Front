"use client";

import React from "react";
import { Search } from "lucide-react";

interface TableFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { value: "all", label: "الكل" },
  { value: "debt", label: "المتعثرين" },
];

export default function TableFilters({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
}: TableFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="البحث باسم العميل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-9 py-2 bg-background border rounded-md text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="flex gap-2 border-b pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`pb-2 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.value
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}