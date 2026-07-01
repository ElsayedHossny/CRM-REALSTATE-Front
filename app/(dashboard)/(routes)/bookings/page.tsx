// app/(dashboard)/(routes)/bookings/page.tsx
import { getToken } from "@/lib/getToken";
import { getAllBookings } from "@/services/bookings.service";
import BookingTable from "@/components/booking/BookingTable";
import CreateBookingButton from "@/components/booking/CreateBookingButton";

export default async function BookingsPage() {
  const token = await getToken();
  const bookings = await getAllBookings(token);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium">الحجوزات</h1>
          <p className="text-sm text-muted-foreground mt-1">
            إدارة جميع الحجوزات
          </p>
        </div>
        <CreateBookingButton propertyId="" />
      </div>
      <BookingTable bookings={bookings} token={token} />
    </div>
  );
}