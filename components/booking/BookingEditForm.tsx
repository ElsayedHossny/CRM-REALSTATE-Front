"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateBooking } from "@/services/bookings.service";
import type { Booking, UpdateBookingDto } from "@/types/booking.types";

// 1. تحديث الـ Interface لاستقبال التوكن اختياريًا أو إجباريًا
interface Props {
  booking: Booking;
  token?: string; 
}

// 2. استقبال الـ token هنا في المتغيرات
export default function BookingEditForm({ booking, token }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<UpdateBookingDto>({
    property_id:
      typeof booking.property_id === "string"
        ? booking.property_id
        : (booking.property_id as any)?._id ?? "",
    name: booking.name,
    email: booking.email,
    phone: booking.phone,
    status: booking.status,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): string | null => {
    if (!form.name?.trim()) return "الاسم مطلوب";
    if (!form.email?.trim()) return "البريد الإلكتروني مطلوب";
    if (!form.phone?.trim()) return "رقم الهاتف مطلوب";
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
      
      // 3. تمرير الـ token كمعامل ثالث للدالة لكي يتم وضعه في الـ Headers
      await updateBooking(booking._id, form, token);
      
      router.push("/bookings");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء التعديل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-sm text-muted-foreground">
            الاسم <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
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
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
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
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-sm text-muted-foreground">الحالة</label>
          <select
            value={form.status}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                status: e.target.value as Booking["status"],
              }))
            }
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
          {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
        </button>
      </div>
    </div>
  );
}