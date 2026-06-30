"use client";

import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
  Building2,
  Layers,
  ShoppingBag,
  HandCoins,
  Tags,
  ReceiptText,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

import ToggleMode from "./toggleMode";

const menuItems = [
  { icon: LayoutDashboard, label: "لوحة التحكم", href: "/controlPanel" },
  {
    icon: Layers,
    label: "المبيعات",
    href: "/sales",
    children: [
      { label: "العملاء", href: "/clients" },
      { label: "الفواتير", href: "/invoices" },
      { label: "المدفوعات", href: "/payments" },
    ],
  },

  {
    icon: Tags,
    label: "التصنيفات",
    href: "/profitandloss",
  },
  {
    icon: ShoppingBag,
    label: "المنتجات",
    href: "/products",
  },

  {
    icon: HandCoins,
    label: "خطط التقسيط",
    href: "/installmentPlans",
  },
  { icon: ReceiptText, label: "فواتير المصروفات", href: "/expenses" },
  { icon: ShoppingCart, label: "فواتير المشتريات", href: "/purchaseInvoices" },

  { icon: Settings, label: "الإعدادات", href: "/settings" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      side="right"
      dir="rtl"
      className="border-l border-slate-100 dark:border-slate-800"
    >
      <SidebarHeader className="h-16 border-b border-slate-100 bg-white dark:bg-zinc-950 dark:border-slate-800 px-2 flex justify-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-700 text-white shadow-sm shadow-green-700/20">
              <Building2 className="h-4 w-4" />
            </div>

            <div className="flex flex-col group-data-[collapsible=icon]:hidden text-right leading-tight truncate">
              <span className="font-black text-xs text-slate-900 dark:text-white">
                نظام إدارة CRM
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                لوحة المسؤول
              </span>
            </div>
          </div>

          <div className="group-data-[collapsible=icon]:hidden shrink-0">
            <ToggleMode />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4 bg-white dark:bg-zinc-950">
        <SidebarGroup className="px-2">
          <SidebarMenu className="space-y-1">
            {menuItems.map((item) =>
              item.children ? (
                <Collapsible
                  defaultOpen={pathname.startsWith(item.href)}
                  key={item.label}
                  className="group/collapsible w-full"
                >
                  <SidebarMenuItem className="w-full list-none">
                    <CollapsibleTrigger asChild style={{ cursor: "pointer" }}>
                      <SidebarMenuButton
                        className={cn(
                          "flex items-center justify-between w-full h-10 px-3 rounded-xl transition-all duration-200 text-xs font-bold",
                          pathname.startsWith(item.href)
                            ? "bg-green-700 text-white hover:bg-green-700 hover:text-white shadow-sm shadow-green-700/10"
                            : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-4 h-4 shrink-0 stroke-[2]" />
                          <span className="group-data-[collapsible=icon]:hidden">
                            {item.label}
                          </span>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden shrink-0" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="mt-1 group-data-[collapsible=icon]:hidden">
                      <SidebarMenuSub className="flex flex-col gap-1 border-r border-green-700/20 mr-4 pr-3 py-1">
                        {item.children.map((child) => (
                          <SidebarMenuSubItem
                            key={child.label}
                            className="list-none"
                          >
                            <SidebarMenuSubButton asChild>
                              <Link
                                href={child.href}
                                className={cn(
                                  "flex items-center w-full h-8 px-3 rounded-lg text-[11px] transition-all duration-200 font-medium",
                                  pathname === child.href
                                    ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 font-bold"
                                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900",
                                )}
                              >
                                <span
                                  className={cn(
                                    "w-1 h-1 rounded-full me-2 shrink-0 transition-transform",
                                    pathname === child.href
                                      ? "bg-green-700 dark:bg-green-400 scale-125"
                                      : "bg-slate-300 dark:bg-slate-700",
                                  )}
                                />
                                {child.label}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.label} className="w-full list-none">
                  <SidebarMenuButton
                    className={cn(
                      "flex items-center justify-start w-full h-10 px-3 gap-3 rounded-xl transition-all duration-200 text-xs font-bold",
                      pathname === item.href
                        ? "bg-green-700 text-white hover:bg-green-700 hover:text-white shadow-sm shadow-green-700/10 pointer-events-none"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white",
                    )}
                    asChild
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 shrink-0 stroke-[2]" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ),
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-100 dark:border-slate-800 p-2 bg-white dark:bg-zinc-950">
        <SidebarMenuItem className="w-full list-none">
          <SidebarMenuButton
            className="flex items-center justify-start w-full h-10 px-3 gap-3 rounded-xl transition-all duration-200 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600"
            asChild
          >
            <Link href="/logout" className="flex items-center gap-3">
              <LogOut className="h-4 w-4 shrink-0 stroke-[2]" />
              <span className="group-data-[collapsible=icon]:hidden">
                تسجيل الخروج
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
