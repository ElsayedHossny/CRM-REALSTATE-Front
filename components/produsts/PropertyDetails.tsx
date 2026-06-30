"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getPropertyById } from "../../services/getProperties.services";
import { Property } from "../../types/properites";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  MapPin,
  Loader2,
  Tag,
} from "lucide-react";

export default function PropertyDetailsPage() {
  const params = useParams();
  const id = (params.productID || params.id) as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (err: any) {
        setError(err.message || "حدث خطأ أثناء تحميل تفاصيل العقار");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (isLoading) return <LoadingState />;
  if (error || !property) return <ErrorState />;

  const mainImage =
    property.images?.[0] ||
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6";

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8" dir="rtl">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-neutral-900 transition-colors"
      >
        <ArrowRight className="w-4 h-4" /> الرجوع للعقارات
      </Link>

      <div className="relative w-full h-[300px] md:h-[450px] rounded-2xl overflow-hidden shadow-md">
        <Image
          src={mainImage}
          alt={property.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1200px) 100vw, 1200px"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">
            {property.title}
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 text-sm">
            <MapPin className="w-4 h-4 text-green-700" /> {property.location}
          </div>

          {/* عرض المواصفات الديناميكية */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge
              icon={<Calendar className="w-3.5 h-3.5" />}
              text={property.bookType === "sale" ? "بيع" : "إيجار"}
            />
            {property.features?.map((f, i) => (
              <Badge key={i} text={`${f.filterName}: ${f.value}`} />
            ))}
          </div>

          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed">
            {property.description || "لا يوجد وصف إضافي متوفر."}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="border border-slate-100 rounded-2xl p-6 bg-white shadow-sm space-y-4">
            <span className="text-xs font-bold text-slate-400">
              السعر المطلوب
            </span>
            <div className="text-3xl font-black text-green-700">
              {property.price?.toLocaleString()}{" "}
              <span className="text-xs">ج.م</span>
            </div>
            <button className="w-full bg-green-700 text-white py-3 rounded-xl text-sm font-bold hover:bg-green-800 transition-all">
              احجز العقار الآن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// مكونات صغيرة للتنظيم
const Badge = ({ icon, text }: { icon?: React.ReactNode; text: string }) => (
  <span className="bg-slate-50 border border-slate-100 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1">
    {icon} {text}
  </span>
);

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center min-h-[450px] gap-3">
    <Loader2 className="w-8 h-8 animate-spin text-green-700" />
    <p className="text-sm text-slate-500">جاري تحميل البيانات...</p>
  </div>
);

const ErrorState = () => (
  <div className="text-center p-10">
    <p className="text-red-500">عذراً، لم يتم العثور على هذا العقار.</p>
    <Link href="/products" className="text-green-700 underline">
      العودة للقائمة
    </Link>
  </div>
);
