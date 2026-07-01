"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createBooking } from "@/services/bookings.service";
import type { CreateBookingDto } from "@/types/booking.types";

interface BookingCreateFormProps {
  onClose: () => void;
  propertyId: string;
}

const EMPTY: CreateBookingDto = {
  property_id: "",
  name: "",
  email: "",
  phone: "",
  status: "CONFIRMED",
};

export default function BookingCreateForm({
  onClose,
  propertyId,
}: BookingCreateFormProps) {
  const [form, setForm] = useState<CreateBookingDto>({
    ...EMPTY,
    property_id: propertyId,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const handleChange = (
    field: keyof CreateBookingDto,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validate = (): string | null => {
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

      console.log("Booking Data:", form);

      await createBooking(form);

      setSuccess(true);
setTimeout(() => {
  onClose();
}, 2000)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "حدث خطأ أثناء إنشاء الحجز"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
      <div
        dir="rtl"
        className="w-full max-w-2xl rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 p-4">
          <h2 className="text-lg font-bold">
            حجز العقار
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-sm text-muted-foreground">
                معرف العقار
              </label>
{/* 
              <input
                type="text"
                value={form.property_id}
                disabled
                className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-gray-100 dark:bg-neutral-800"
              /> */}
            </div>

            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <label className="text-sm text-muted-foreground">
                الاسم
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  handleChange("name", e.target.value)
                }
                placeholder="أحمد محمد"
                className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <label className="text-sm text-muted-foreground">
                رقم الهاتف
              </label>

              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  handleChange("phone", e.target.value)
                }
                placeholder="01xxxxxxxxx"
                className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <label className="text-sm text-muted-foreground">
                البريد الإلكتروني
              </label>

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  handleChange("email", e.target.value)
                }
                placeholder="example@email.com"
                className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <label className="text-sm text-muted-foreground">
                الحالة
              </label>

              <select
                value={form.status}
                onChange={(e) =>
                  handleChange("status", e.target.value)
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
            <p className="mt-4 text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}


          {success && (
  <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-green-700 text-sm">
    ✅ تم حجز العقار بنجاح، سيتم التواصل معك قريباً.
  </div>
)}

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-3 text-sm rounded-lg bg-green-700 text-white hover:bg-green-800 transition-colors disabled:opacity-50"
            >
              {loading ? "جاري الحجز..." : "تأكيد الحجز"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}