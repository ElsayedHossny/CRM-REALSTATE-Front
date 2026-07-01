// app/bookings/create/page.tsx
"use client";

import BookingCreateForm from "@/components/booking/BookingCreateForm";

export default function CreateBookingPage() {
  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-medium">حجز جديد</h1>
        <p className="text-sm text-muted-foreground mt-1">
          إضافة حجز جديد للنظام
        </p>
      </div>
      <BookingCreateForm onClose={() => {}} propertyId="" />
    </div>
  );
}