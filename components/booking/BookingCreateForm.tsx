// components/booking/BookingCreateForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBooking } from "@/services/bookings.service";
import type { CreateBookingDto } from "@/types/booking.types";

const EMPTY: CreateBookingDto = {
  property_id: "",
  name: "",
  email: "",
  phone: "",
  status: "CONFIRMED", // تأكيد البداية كابيتال
};

export default function BookingCreateForm() {
  const router = useRouter();
  const [form, setForm] = useState<CreateBookingDto>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // دالة موحدة وسهلة لتحديث أي حقل فوراً في الـ State وتجبر الـ React على التحديث
  const handleChange = (field: keyof CreateBookingDto, value: string) => {
    setForm({
      ...form,
      [field]: value
    });
  };

  const validate = (): string | null => {
    if (!form.property_id.trim()) return "معرف العقار مطلوب";
    if (!form.name.trim()) return "الاسم مطلوب";
    if (!form.email.trim()) return "البريد الإلكتروني مطلوب";
    if (!form.phone.trim()) return "رقم الهاتف مطلوب";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      
      // سطر فحص للتأكد 100% في الـ Console قبل الإرسال
      console.log("البيانات المرسلة فعلياً:", form);
      
      await createBooking(form);
      router.push("/bookings");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5" dir="rtl">
      <div className="grid grid-cols-2 gap-4">
        
        {/* 1. حقل معرف العقار - أصبح يستقبل التغييرات بشكل مباشر ومضمون */}
        <div className="space-y-1.5 col-span-2">
          <label className="text-sm text-muted-foreground">
            معرف العقار <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.property_id}
            onChange={(e) => handleChange("property_id", e.target.value)}
            placeholder="ضع الـ ID المكون من 24 حرف ورقم..."
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-sm text-muted-foreground">
            الاسم <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="أحمد محمد"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-sm text-muted-foreground">
            رقم الهاتف <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="01xxxxxxxxx"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-sm text-muted-foreground">
            البريد الإلكتروني <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="example@email.com"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* 2. حقل الحالة - تم تعديله ليحفظ الاختيار فوراً في الـ State بدون تعقيد الـ Type */}
        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-sm text-muted-foreground">الحالة</label>
          <select
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="PENDING">معلق</option>
            <option value="CONFIRMED">مؤكد</option> 
            <option value="REJECTED">مرفوض</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
        >
          إلغاء
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 px-4 py-2 text-sm rounded-lg bg-foreground text-background hover:opacity-85 transition-opacity disabled:opacity-50"
        >
          {loading ? "جاري الإنشاء..." : "إنشاء الحجز"}
        </button>
      </div>
    </div>
  );
}