"use client";

import React, { useMemo, useState, useEffect } from "react";
import PropertyListSite from "@/components/produsts/PropertyListSite";
import { Property } from "@/types/properites";
import { getPropertiesdashboard } from "@/services/getProperties.services";
import { getAllCategories } from "@/services/category.service"; // ✅ جلب الكايجوري من الـ API

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PropertyTypeFiltersSite } from "@/components/produsts/PropertyFiltersSite";
import { Loader2, Sparkles } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

// ✅ تحويل الأرقام العربية/الهندية لأرقام إنجليزية
function arabicToNumber(str: string): number {
  const normalized = str
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[^\d.]/g, "");
  return parseFloat(normalized) || 0;
}

// ✅ استخراج قيمة المساحة من مصفوفة features
function getAreaFromFeatures(
  features: { filterName: string; value: string }[],
): number {
  const areaFeature = features?.find((f) => f.filterName === "المساحة");
  return areaFeature ? arabicToNumber(areaFeature.value) : 0;
}

// ✅ خيارات الفلتر بالمساحة — ثابتة لأنها منطق تطبيق مش بيانات من السيرفر
const AREA_OPTIONS = [
  { id: "all", label: "كل المساحات" },
  { id: "small", label: "صغير (أقل من 100م²)" },
  { id: "medium", label: "متوسط (100 - 250م²)" },
  { id: "large", label: "كبير (250 - 400م²)" },
  { id: "xlarge", label: "كبير جداً (أكثر من 400م²)" },
];

export default function Products() {
  const pathname = usePathname();

  const [dbProperties, setDbProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ State جديدة للكايجوري الديناميكية
  const [categories, setCategories] = useState<{ id: string; label: string }[]>(
    [{ id: "all", label: "الكل" }],
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [activeAreaFilter, setActiveAreaFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const itemsPerPage = 4;

  // ✅ جلب الكايجوري من السيرفر مرة واحدة عند تحميل الصفحة
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();

        // ✅ تعامل مع شكل الرسبونس سواء كان { data: [...] } أو مصفوفة مباشرة
        const list = Array.isArray(res) ? res : (res?.data ?? []);

        const mapped = [
          { id: "all", label: "الكل" },
          ...list.map((cat: any) => ({
            id: cat._id ?? cat.id ?? cat.name, // حسب شكل الـ API بتاعك
            label: cat.name ?? cat.label ?? cat._id,
          })),
        ];

        setCategories(mapped);
      } catch (err) {
        console.error("خطأ في جلب التصنيفات:", err);
      }
    };

    fetchCategories();
  }, []); // مرة واحدة بس

  // ✅ جلب العقارات كل ما تتفتح الصفحة
  useEffect(() => {
    const fetchLiveProperties = async () => {
      try {
        setLoading(true);
        const data = await getPropertiesdashboard();
        setDbProperties(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("خطأ في جلب العقارات:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveProperties();
  }, [pathname]);

  // ✅ حساب العدادات بناءً على الـ category id الجاي من الكايجوري API
  const counts = useMemo(() => {
    const countObj: Record<string, number> = { all: dbProperties.length };
    dbProperties.forEach((p) => {
      // p.category ممكن يكون string (id) أو object { _id, name }
      const cat = p.category as any;
      const catId = typeof cat === "object" && cat ? (cat._id ?? cat.id) : cat;
      if (catId) {
        countObj[catId] = (countObj[catId] || 0) + 1;
      }
    });
    return countObj;
  }, [dbProperties]);

  // ✅ تصفية العقارات حسب الكايجوري والمساحة
  const filteredProperties = useMemo(() => {
    return dbProperties.filter((p) => {
      // مطابقة الـ category
      const cat = p.category as any;
      const catId = typeof cat === "object" && cat ? (cat._id ?? cat.id) : cat;
      const matchType = activeFilter === "all" || catId === activeFilter;

      // ✅ استخراج المساحة من features وتحويلها لرقم
      const area = getAreaFromFeatures(p.features ?? []);
      let matchArea = true;
      if (activeAreaFilter === "small") matchArea = area < 100;
      else if (activeAreaFilter === "medium")
        matchArea = area >= 100 && area <= 250;
      else if (activeAreaFilter === "large")
        matchArea = area > 250 && area <= 400;
      else if (activeAreaFilter === "xlarge") matchArea = area > 400;

      return matchType && matchArea;
    });
  }, [dbProperties, activeFilter, activeAreaFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredProperties.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleFilterChange = (type: string) => {
    setActiveFilter(type);
    setCurrentPage(1);
  };

  const handleAreaFilterChange = (area: string) => {
    setActiveAreaFilter(area);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-6" dir="rtl">
      {/* Header */}
      <div className="w-full max-w-7xl mx-auto pt-32 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-700/10 border border-green-200/70 dark:border-green-700/20 text-green-700 dark:text-green-400 text-xs font-semibold mb-5 shadow-sm shadow-green-100 dark:shadow-none">
          <Sparkles className="size-3.5" />
          <span>الشقق السكنية المتاحة</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-700 animate-pulse" />
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
          ابحث عن{" "}
          <span className="bg-gradient-to-l from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
            شقة أحلامك
          </span>{" "}
          هنا
        </h1>

        <p className="mt-4 text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed font-medium">
          لأنك تستحق المساحة التي تمنحك الراحة والأمان، وفرنا لك تشكيلة واسعة من
          الشقق المميزة والمصممة خصيصاً لتناسب تطلعاتك.
        </p>

        <div className="mt-6 flex items-center gap-2">
          <span className="h-px w-8 bg-green-300 dark:bg-green-800" />
          <span className="h-1.5 w-1.5 rounded-full bg-green-700" />
          <span className="h-px w-8 bg-green-300 dark:bg-green-800" />
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-green-700/10 dark:bg-green-600/10 blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-[200px] h-[200px] bg-green-500/10 dark:bg-green-500/5 blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[250px] h-[150px] bg-emerald-300/10 dark:bg-emerald-600/5 blur-3xl -z-10 pointer-events-none" />
      </div>

      {/* Divider */}
      <div className="w-full max-w-7xl mx-auto px-6 my-4">
        <div className="h-px bg-linear-to-r from-transparent via-gray-700 to-transparent w-full" />
      </div>
      <PropertyTypeFiltersSite
        active={activeFilter}
        onChange={handleFilterChange}
        counts={counts}
        categories={categories} // ✅ من الـ API
        areaOptions={AREA_OPTIONS} // ✅ ثابتة من الأعلى
        activeArea={activeAreaFilter}
        onAreaChange={handleAreaFilterChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <p className="text-sm text-gray-400">
              جاري تحميل أحدث العقارات من السيرفر...
            </p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">
            لا توجد عقارات تطابق خيارات التصفية الحالية
          </p>
        ) : (
          <PropertyListSite properties={currentData} viewMode={viewMode} />
        )}
      </div>

      {!loading && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => goToPage(currentPage - 1)}
                className="cursor-pointer"
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => goToPage(page)}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => goToPage(currentPage + 1)}
                className="cursor-pointer"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
