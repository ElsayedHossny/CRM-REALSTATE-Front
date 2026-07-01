import { getToken } from "@/lib/getToken";
import { getOneBooking } from "@/services/bookings.service";
import Link from "next/link";
import { Pencil } from "lucide-react";

const statusStyles: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  pending: {
    bg: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-500",
    text: "text-amber-700 dark:text-amber-500",
    dot: "bg-amber-500",
    label: "قيد الانتظار",
  },
  confirmed: {
    bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-500",
    text: "text-emerald-700 dark:text-emerald-500",
    dot: "bg-emerald-500",
    label: "مؤكد",
  },
  cancelled: {
    bg: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-500",
    text: "text-rose-700 dark:text-rose-500",
    dot: "bg-rose-500",
    label: "ملغي",
  },
};

// واجهة الـ Props (تأكد من وجودها لديك)
interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({ params }: Props) {
  const { id } = await params;
  const token = await getToken();
  const booking = await getOneBooking(id, token);
  
  // 2. الحماية في حال كانت الحالة القادمة من السيرفر غير معرفة في statusStyles
  const currentStatus = booking.status || "pending";
  const s = statusStyles[currentStatus] || statusStyles["pending"];
  
  const property = booking.property_id;

  return (
    <div className="p-6 max-w-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium">{booking.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">تفاصيل الحجز</p>
        </div>
        <Link
          href={`/bookings/${booking._id}/edit`}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
        >
          <Pencil size={14} /> تعديل
        </Link>
      </div>

      {/* بيانات العميل */}
      <h2 className="text-sm font-medium text-muted-foreground mb-2">بيانات العميل</h2>
      <div className="rounded-xl border border-border bg-card divide-y divide-border mb-4">
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">الاسم</span>
          <span className="text-sm font-medium">{booking.name}</span>
        </div>
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">البريد الإلكتروني</span>
          <span className="text-sm text-muted-foreground">{booking.email}</span>
        </div>
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">رقم الهاتف</span>
          <span className="text-sm text-muted-foreground">{booking.phone}</span>
        </div>
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">الحالة</span>
          <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${s.bg} ${s.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>
        </div>
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">تاريخ الحجز</span>
          <span className="text-sm text-muted-foreground">
            {new Date(booking.createdAt).toLocaleDateString("ar-EG")}
          </span>
        </div>
      </div>

      {/* بيانات العقار */}
      <h2 className="text-sm font-medium text-muted-foreground mb-2">بيانات العقار</h2>
      <div className="rounded-xl border border-border bg-card divide-y divide-border">

        {/* صورة العقار */}
        {property.images?.[0] && (
          <div className="px-5 py-4">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">العنوان</span>
          <span className="text-sm font-medium">{property.title}</span>
        </div>
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">الموقع</span>
          <span className="text-sm text-muted-foreground">{property.location}</span>
        </div>
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">السعر</span>
          <span className="text-sm font-medium">
            {property.price.toLocaleString("ar-EG")} ج.م
          </span>
        </div>
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">نوع البيع</span>
          <span className="text-sm text-muted-foreground">{property.bookType}</span>
        </div>
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">حالة العقار</span>
          <span className="text-sm text-muted-foreground">{property.status}</span>
        </div>

        {/* المميزات */}
        {property.features?.length > 0 && (
          <div className="px-5 py-4">
            <span className="text-sm text-muted-foreground block mb-2">المميزات</span>
            <div className="flex flex-wrap gap-2">
              {property.features.map((f: any) => (
                <span key={f._id} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                  {f.filterName}: {f.value}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <Link
        href="/bookings"
        className="inline-block mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← رجوع للقائمة
      </Link>
    </div>
  );
}