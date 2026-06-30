"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PropertyForm from "@/components/produsts/PropertyForm";
import { Property } from "@/types/properites";
import { getPropertyById } from "../../../../../../services/getProperties.services"; // 👈 استيراد من السيرفيس الموحدة
import { Loader2 } from "lucide-react";

export default function UpdatePage() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchPropertyData = async () => {
      try {
        setIsLoading(true);
        // 🚀 استدعاء الفانكشن من السيرفيس مباشرة
        const data = await getPropertyById(id as string);
        setProperty(data);
      } catch (err: any) {
        setError(err.message || "حدث خطأ أثناء تحميل بيانات العقار");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-green-700" />
        <p className="text-sm text-slate-500 font-medium">
          جاري جلب بيانات العقار الحية...
        </p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-white border border-slate-100 rounded-2xl mt-4 shadow-sm">
        <p className="text-red-500 font-semibold mb-2">
          عذراً، لم يتم العثور على العقار المطلـوب
        </p>
        <p className="text-xs text-slate-400">
          تأكد من الرابط أو أن العقار متاح في السيرفر.
        </p>
      </div>
    );
  }

  return <PropertyForm property={property} />;
}
