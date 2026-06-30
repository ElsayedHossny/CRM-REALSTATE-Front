"use client";

import React, { useMemo, useState, useEffect } from "react";
import PropertyList from "@/components/produsts/PropertyList";
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
import { PropertyTypeFilters } from "@/components/produsts/PropertyFilters";
import { Loader2 } from "lucide-react";
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
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      <PropertyTypeFilters
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
          <PropertyList properties={currentData} viewMode={viewMode} />
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
