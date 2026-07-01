// components/booking/CreateBookingButton.tsx
"use client";

import { useState } from "react";
import BookingCreateForm from "@/components/booking/BookingCreateForm";

export default function CreateBookingButton({ propertyId }: { propertyId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-foreground text-background hover:opacity-85 transition-opacity"
      >
        + حجز جديد
      </button>

      {open && (
        <BookingCreateForm propertyId={propertyId} onClose={() => setOpen(false)} />
      )}
    </>
  );
}