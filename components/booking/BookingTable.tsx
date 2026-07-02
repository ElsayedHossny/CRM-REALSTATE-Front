// components/booking/BookingTable.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { deleteOneBooking } from "@/services/bookings.service";
import type { Booking } from "@/types/booking.types";

interface Props {
  bookings: Booking[];
  token?: string;
}

type StatusStyle = { label: string; bg: string; text: string; dot: string };

// ✅ الـ type على سطر واحد
const statusStyles: Record<Booking["status"], StatusStyle> = {
  PENDING:   { label: "معلق",   bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
  CONFIRMED: { label: "مؤكد",  bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500"  },
  REJECTED:  { label: "مرفوض", bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500"    },
};

export default function BookingTable({ bookings, token }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError]           = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الحجز؟")) return;
    try {
      setDeletingId(id);
      setError(null);
      await deleteOneBooking(id, token);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء الحذف");
    } finally {
      setDeletingId(null);
    }
  };

  if (!bookings?.length) {
    return (
      <div className="rounded-xl border border-border py-16 text-center text-sm text-muted-foreground">
        لا توجد حجوزات بعد
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-xs text-muted-foreground">
              <th className="text-right px-5 py-3 font-medium">الاسم</th>
              <th className="text-right px-5 py-3 font-medium">البريد الإلكتروني</th>
              <th className="text-right px-5 py-3 font-medium">الهاتف</th>
              <th className="text-right px-5 py-3 font-medium">العقار</th>
              <th className="text-right px-5 py-3 font-medium">الحالة</th>
              <th className="text-right px-5 py-3 font-medium">تاريخ الإنشاء</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, i) => {
              const s = statusStyles[booking.status];
              return (
                <tr
                  key={booking._id}
                  className={`border-t border-border hover:bg-muted/40 transition-colors ${i % 2 !== 0 ? "bg-muted/20" : ""}`}
                >
                  <td className="px-5 py-3 font-medium">{booking.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{booking.email}</td>
                  <td className="px-5 py-3 text-muted-foreground">{booking.phone}</td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {typeof booking.property_id === "object"
                      ? booking.property_id?.title
                      : booking.property_id}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${s.bg} ${s.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {new Date(booking.createdAt).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Link href={`/bookings/${booking._id}`}
                        className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        title="عرض">
                        <Eye size={15} />
                      </Link>
                      <Link href={`/bookings/${booking._id}/edit`}
                        className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        title="تعديل">
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(booking._id)}
                        disabled={deletingId === booking._id}
                        className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="حذف">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}