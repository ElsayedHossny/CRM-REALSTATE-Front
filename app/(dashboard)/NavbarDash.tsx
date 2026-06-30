"use client";

import { SidebarTrigger } from "../../components/ui/sidebar";
import { Input } from "@/components/ui/input";
import {
  BellRing,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Plus,
  FilePlus,
  DollarSign,
  Package,
  CreditCard,
  UserPlus,
  Search,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import NotificationBell from "@/components/NotificationBell";

export default function NavbarDash() {
  return (

    <div
      className="flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white px-3 md:px-6 shadow-sm sticky top-0 z-50"
      dir="rtl"
    >
      {/* الجزء الأيمن: زر السايدبار + حقل البحث المتجاوب */}
      <div className="flex flex-1 items-center gap-2 md:gap-4">
        <SidebarTrigger className="h-9 w-9 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors shrink-0" />

        {/* صندوق البحث: يظهر كاملاً من الشاشات الصغيرة (sm) فما فوق */}
        <div className="relative max-w-xs md:max-w-md w-full hidden sm:block">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          <Input
            placeholder="بحث سريع..."
            className="w-full pr-9 pl-4 h-10 border-slate-200 bg-slate-50/50 focus-visible:ring-1 focus-visible:ring-green-700 focus-visible:border-green-700 rounded-xl transition-all text-xs md:text-sm"
          />
        </div>

        {/* زر بحث أيقوني بديل يظهر فقط على الموبايل الشديد الصغر */}
        <button
          type="button"
          className="sm:hidden p-2 hover:bg-slate-50 rounded-xl text-slate-500 transition-colors"
          onClick={() => alert("سيتم فتح مودال أو شريط البحث مخصص للموبايل")}
        >
          <Search className="size-5" />
        </button>
      </div>

      {/* الجزء الأيسر: الأزرار السريعة + الإشعارات + البروفايل */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        {/* 1. زر إجراء جديد (يتكيف حسب حجم الشاشة) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-center gap-1.5 bg-green-700 hover:bg-green-800 text-white h-10 px-3 md:px-4 rounded-xl text-xs font-bold transition-all shadow-sm shadow-green-700/10 cursor-pointer whitespace-nowrap select-none"
            >
              <Plus className="size-4 shrink-0" />
              إجراء جديد
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-48 mt-1.5 rounded-xl shadow-md border-slate-100 p-1"
          >
            <DropdownMenuItem className="gap-3 py-2.5 px-3 rounded-lg text-xs font-medium cursor-pointer focus:bg-green-50 focus:text-green-800">
              <FilePlus className="size-4 text-green-700" />
              <span>فاتورة جديدة</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-3 py-2.5 px-3 rounded-lg text-xs font-medium cursor-pointer focus:bg-green-50 focus:text-green-800">
              <DollarSign className="size-4 text-green-700" />
              <span>دفعة جديدة</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-3 py-2.5 px-3 rounded-lg text-xs font-medium cursor-pointer focus:bg-green-50 focus:text-green-800">
              <Package className="size-4 text-green-700" />
              <span>عقار جديد</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-3 py-2.5 px-3 rounded-lg text-xs font-medium cursor-pointer focus:bg-green-50 focus:text-green-800">
              <CreditCard className="size-4 text-green-700" />
              <span>مصروف جديد</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-3 py-2.5 px-3 rounded-lg text-xs font-medium cursor-pointer focus:bg-green-50 focus:text-green-800">
              <UserPlus className="size-4 text-green-700" />
              <span>عميل جديد</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* خط فاصل مرن */}
        <div className="h-5 w-[1px] bg-slate-200" />

        {/* 2. زر الإشعارات */}
        <NotificationBell/>

        {/* خط فاصل مرن */}
        <div className="h-5 w-[1px] bg-slate-200" />

        {/* 3. قائمة معلومات الحساب الشخصي المتجاوبة */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer select-none transition-all max-w-[160px] md:max-w-none">
              <Avatar className="w-8 h-8 border border-slate-100 shadow-inner shrink-0">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                  className="grayscale"
                />
                <AvatarFallback className="bg-green-50 text-green-800 font-bold text-xs">
                  ح
                </AvatarFallback>
              </Avatar>

              {/* النصوص والاسم يختفي تماماً في شاشات الموبايل (hidden) ويظهر في الشاشات اللوحية فما فوق (md:flex) */}
              <div className="flex-col text-right hidden md:flex">
                <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[80px]">
                  السيد حسني
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  مدير النظام
                </span>
              </div>
              <ChevronDown className="size-3 text-slate-400 ms-0.5 hidden md:block shrink-0" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-52 mt-1.5 rounded-xl shadow-md border-slate-100 p-1"
          >
            {/* هيدر البروفايل داخل القائمة يظهر بوضوح في كل الشاشات لتأكيد الحساب الحالي */}
            <div
              dir="rtl"
              className="flex items-center gap-2.5 px-3 py-3 border-b border-slate-50 mb-1"
            >
              <Avatar className="w-8 h-8 border border-slate-100">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                  className="grayscale"
                />
                <AvatarFallback>ح</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-right">
                <span className="text-xs font-black text-slate-900">
                  السيد حسني
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[130px]">
                  hasni@admin.com
                </span>
              </div>
            </div>

            <DropdownMenuItem className="gap-3 py-2.5 px-3 rounded-lg text-xs font-medium cursor-pointer text-slate-700">
              <User className="size-4 text-slate-400" />
              <span>الملف الشخصي</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className="gap-3 py-2.5 px-3 rounded-lg text-xs font-medium cursor-pointer text-slate-700"
            >
              <Link href="/settings">
                <Settings className="size-4 text-slate-400" />
                <span>الإعدادات العامة</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-slate-50" />

            <DropdownMenuItem
              asChild
              className="gap-3 py-2.5 px-3 rounded-lg text-xs font-bold cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-50/70"
            >
              <Link href="/logout">
                <LogOut className="size-4" />
                <span>تسجيل الخروج</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
