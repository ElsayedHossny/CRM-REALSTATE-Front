"use client";

import React, { memo, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Bath, BedDouble, Maximize2, Eye } from "lucide-react";
import { Property } from "@/types/properites";

const FALLBACK_IMAGE = "/screen.png";

const convertArabicNumerals = (str: string): string => {
  if (!str) return "";
  return str.replace(/[٠-٩]/g, (d) => "٠١٠٩٤٩١٧٩٧٧".indexOf(d).toString());
};

const getCardImage = (images?: string[]): string => {
  return images && images.length > 0 && images[0].trim() !== ""
    ? images[0]
    : FALLBACK_IMAGE;
};

const PropertyCard = memo(function PropertyCardSite({
  property,
}: {
  property: Property;
}) {
  const router = useRouter();

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

  const liveArea = useMemo(
    () => getDynamicFeature(/مساح/i) || getDynamicFeature(/area/i),
    [getDynamicFeature],
  );

  const liveRooms = useMemo(
    () => getDynamicFeature(/غرف/i) || getDynamicFeature(/room/i),
    [getDynamicFeature],
  );

  const liveBathrooms = useMemo(
    () => getDynamicFeature(/حمام/i) || getDynamicFeature(/bath/i),
    [getDynamicFeature],
  );

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
      className="rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 shadow-sm hover:shadow-md dark:hover:shadow-emerald-950/30 transition-all flex flex-col justify-between group"
    >
      <div>
        <div className="relative h-52 w-full bg-slate-50 dark:bg-neutral-800 overflow-hidden">
          <Image
            src={cardImage}
            alt={property.title || "عقار ديناميكي"}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* تدرج خفيف أسفل الصورة في الوضع الداكن لتحسين التباين */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 dark:from-black/40 to-transparent" />

          <span className="absolute top-3 right-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 text-neutral-800 dark:text-neutral-200 shadow-sm">
            <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            {property.location || "الموقع غير محدد"}
          </span>
        </div>

        <div className="p-4 pb-2 space-y-3">
          <div className="flex items-center gap-3 text-xs font-medium text-neutral-500 dark:text-neutral-400 flex-wrap">
            {liveArea && (
              <span className="flex items-center gap-1 bg-slate-50 dark:bg-neutral-800 border border-slate-100 dark:border-neutral-700 px-2.5 py-1 rounded-xl">
                <Maximize2 className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
                <span>{liveArea} متر</span>
              </span>
            )}

            {liveRooms && (
              <span className="flex items-center gap-1 bg-slate-50 dark:bg-neutral-800 border border-slate-100 dark:border-neutral-700 px-2.5 py-1 rounded-xl">
                <BedDouble className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
                <span>{liveRooms} غرف</span>
              </span>
            )}

            {liveBathrooms && (
              <span className="flex items-center gap-1 bg-slate-50 dark:bg-neutral-800 border border-slate-100 dark:border-neutral-700 px-2.5 py-1 rounded-xl">
                <Bath className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
                <span>{liveBathrooms} حمام</span>
              </span>
            )}
          </div>

          {/* العنوان والوصف */}
          <div className="space-y-1">
            <h3 className="font-bold text-base text-neutral-900 dark:text-white line-clamp-1">
              {property.title}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 min-h-[32px] leading-relaxed">
              {property.description || "لا يوجد وصف إضافي متوفر لهذا العقار."}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 mt-2">
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-neutral-800 pt-3">
          <div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold tracking-wide uppercase">
              السعر
            </p>
            <p className="font-extrabold text-base text-neutral-900 dark:text-white">
              {formattedPrice}{" "}
              <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">
                ج.م
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/properites/${property._id}`}
              className="p-2 bg-slate-50 dark:bg-neutral-800 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-slate-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl transition-colors border border-slate-100 dark:border-neutral-700 shadow-sm"
              title="عرض التفاصيل"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PropertyCard;
