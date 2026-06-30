"use client";

import React, { memo, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext"; // 1. استدعي الـ Hook
import {
  MapPin,
  Bath,
  BedDouble,
  Maximize2,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { Property } from "@/types/properites";
import { deleteProperty } from "@/services/getProperties.services";

// ─── CONSTANTS ──────────────────────────────────────────────────────────────
const FALLBACK_IMAGE = "/screen.png";

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────
/**
 * تحويل الأرقام العربية/الهندية (مثل: ٢٠٠) إلى أرقام إنجليزية (200) لضمان القراءة والعرض السليم
 */
const convertArabicNumerals = (str: string): string => {
  if (!str) return "";
  return str.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());
};

/**
 * جلب الصورة الأولى للعقار أو إرجاع الصورة الاحتياطية في حال عدم وجود صور
 */
const getCardImage = (images?: string[]): string => {
  return images && images.length > 0 && images[0].trim() !== ""
    ? images[0]
    : FALLBACK_IMAGE;
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const PropertyCard = memo(function PropertyCard({
  property,
}: {
  property: Property;
}) {
  const { showToast } = useToast(); // 2. استخدمه
  const router = useRouter(); // لازم تكون هنا مباشرة
  // دالة حذف العقار (مغلفة بـ useCallback لمنع إعادة الإنشاء غير المبرر)
  const handleDelete = async (id: string) => {
    try {
      await deleteProperty(id);

      showToast("تمت العملية بنجاح!", "success");

      window.location.reload();
    } catch (err: any) {
      // 4. إظهار رسالة الخطأ في التوست
      showToast("فشلت العمليه!", "failed");
    }
  };
  /**
   * 💡 الدالة العبقرية للاستخراج الديناميكي:
   * تبحث بجذر الكلمة (Regex Pattern) لتفادي أخطاء الهاء والتاء المربوطة والزيادات
   */
  const getDynamicFeature = useCallback(
    (pattern: RegExp): string => {
      if (!property.features || !Array.isArray(property.features)) return "";

      const found = property.features.find((f) =>
        pattern.test(f.filterName || ""),
      );

      return found ? convertArabicNumerals(found.value) : "";
    },
    [property.features],
  );

  // ─── DYNAMIC FEATURES EXTRACTION ──────────────────────────────────────────
  // مساح -> يلقط حياً: المساحه، المساحة، مساحة، مساحه، المساحة (م²)، area
  const liveArea = useMemo(
    () => getDynamicFeature(/مساح/i) || getDynamicFeature(/area/i),
    [getDynamicFeature],
  );

  // غرف -> يلقط حياً: عدد الغرف، الغرف، غرف، غرفة، غرفه، room
  const liveRooms = useMemo(
    () => getDynamicFeature(/غرف/i) || getDynamicFeature(/room/i),
    [getDynamicFeature],
  );

  // حمام -> يلقط حياً: عدد الحمامات، الحمامات، حمام، حمامات، bath
  const liveBathrooms = useMemo(
    () => getDynamicFeature(/حمام/i) || getDynamicFeature(/bath/i),
    [getDynamicFeature],
  );

  // ─── MEMOIZED VALUES FOR PERFORMANCE ──────────────────────────────────────
  const cardImage = useMemo(
    () => getCardImage(property.images),
    [property.images],
  );

  const formattedPrice = useMemo(() => {
    const rawPrice =
      typeof property.price === "number"
        ? property.price
        : Number(property.price || 0);
    return rawPrice.toLocaleString("ar-EG");
  }, [property.price]);

  return (
    <div
      dir="rtl"
      className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
    >
      {/* القسم العلوي: الصورة والبيانات الأساسية */}
      <div>
        {/* منطقة عرض الصورة والموقع */}
        <div className="relative h-52 w-full bg-slate-50 overflow-hidden">
          <Image
            src={cardImage}
            alt={property.title || "عقار ديناميكي"}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 text-neutral-800 shadow-sm">
            <MapPin className="w-3 h-3 text-emerald-600" />
            {property.location || "الموقع غير محدد"}
          </span>
        </div>

        {/* منطقة المحتوى والمواصفات الديناميكية */}
        <div className="p-4 pb-2 space-y-3">
          {/* شريط المواصفات: لا يظهر أي أيقونة إلا لو الداتا بتاعتها مبعوثة فعلاً من الباك إند */}
          <div className="flex items-center gap-3 text-xs font-medium text-neutral-500 flex-wrap">
            {liveArea && (
              <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl">
                <Maximize2 className="w-3.5 h-3.5 text-neutral-400" />
                <span>{liveArea} متر</span>
              </span>
            )}

            {liveRooms && (
              <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl">
                <BedDouble className="w-3.5 h-3.5 text-neutral-400" />
                <span>{liveRooms} غرف</span>
              </span>
            )}

            {liveBathrooms && (
              <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl">
                <Bath className="w-3.5 h-3.5 text-neutral-400" />
                <span>{liveBathrooms} حمام</span>
              </span>
            )}
          </div>

          {/* العنوان والوصف */}
          <div className="space-y-1">
            <h3 className="font-bold text-base text-neutral-900 line-clamp-1">
              {property.title}
            </h3>
            <p className="text-xs text-neutral-500 line-clamp-2 min-h-[32px] leading-relaxed">
              {property.description || "لا يوجد وصف إضافي متوفر لهذا العقار."}
            </p>
          </div>
        </div>
      </div>

      {/* القسم السفلي: السعر وأزرار التحكم */}
      <div className="p-4 pt-0 mt-2">
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          {/* كتلة السعر */}
          <div>
            <p className="text-[10px] text-neutral-400 font-bold tracking-wide uppercase">
              السعر
            </p>
            <p className="font-extrabold text-base text-neutral-900">
              {formattedPrice}{" "}
              <span className="text-xs font-normal text-neutral-500">ج.م</span>
            </p>
          </div>

          {/* أزرار التحكم والروابط */}
          <div className="flex items-center gap-2">
            {/* زر العرض */}
            <Link
              href={`/products/${property._id}`}
              className="p-2 bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 rounded-xl transition-colors border border-slate-100 shadow-sm"
              title="عرض التفاصيل"
            >
              <Eye className="w-4 h-4" />
            </Link>

            {/* زر التعديل */}
            <Link
              href={`/products/update/${property._id}`}
              className="p-2 bg-slate-50 hover:bg-amber-50 text-slate-500 hover:text-amber-600 rounded-xl transition-colors border border-slate-100 shadow-sm"
              title="تعديل العقار"
            >
              <Pencil className="w-4 h-4" />
            </Link>

            {/* زر الحذف */}
            <button
              type="button"
              onClick={() => handleDelete(property._id)}
              className="p-2 bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl transition-colors border border-slate-100 shadow-sm cursor-pointer"
              title="حذف العقار"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PropertyCard;
