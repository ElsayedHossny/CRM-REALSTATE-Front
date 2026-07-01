// app/bookings/[id]/edit/page.tsx
import { getOneBooking } from "@/services/bookings.service";
import { getToken } from "@/lib/getToken"; // 1. استيراد دالة جلب التوكن 
import BookingEditForm from "@/components/booking/BookingEditForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBookingPage({ params }: Props) {
  const { id } = await params;
  
  const token = await getToken(); // 2. جلب التوكن هنا
  const booking = await getOneBooking(id, token); // 3. تمرير التوكن كمعامل ثانٍ للدالة

return (
  <div className="p-6 max-w-2xl">
    <div className="mb-6">
      <h1 className="text-xl font-medium">تعديل الحجز</h1>
      <p className="text-sm text-muted-foreground mt-1">{booking?.name}</p>
    </div>
    {/* مرر التوكن هنا كـ prop */}
    <BookingEditForm booking={booking} token={token} /> 
  </div>
);
}