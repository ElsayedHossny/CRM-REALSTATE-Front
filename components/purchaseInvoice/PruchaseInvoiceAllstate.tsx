import React from "react";

import type { PurchaseInvoiceAllStatesProps } from "@/types/purchaseInvoice.types";
import { CheckCircle2, CircleDollarSign, Clock3, Users } from "lucide-react";

export default function PurchaseInvoiceAllStatesProps({
  allstates,
}: PurchaseInvoiceAllStatesProps) {
  const { totalAmount, totalPaidAmount, totalRemainingAmount } = allstates;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 mb-10">
      <div className="flex items-center justify-between rounded-2xl bg-red-50 p-3 shadow-sm">
        <div className="text-right">
          <p className="text-sm text-gray-500">إجمالي المصروفات</p>
          <h2 className="mt-1 text-3xl font-bold">{totalAmount}</h2>
          <p className="text-sm text-gray-500">جنيه</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm">
          <CircleDollarSign className="h-8 w-8 text-red-500" />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl  bg-green-50 p-5 shadow-sm">
        <div className="text-right">
          <p className="text-sm text-gray-500">المصروفات المدفوعة</p>
          <h2 className="mt-1 text-3xl font-bold">{totalPaidAmount}</h2>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl  bg-amber-50 p-5 shadow-sm">
        <div className="text-right">
          <p className="text-sm text-gray-500">المصروفات المعلقة</p>
          <h2 className="mt-1 text-3xl font-bold">{totalRemainingAmount}</h2>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm">
          <Clock3 className="h-8 w-8 text-amber-500" />
        </div>
      </div>
    </div>
  );
}
