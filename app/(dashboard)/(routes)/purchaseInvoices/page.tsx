// app/purchaseInvoices/page.tsx
import Link from "next/link";
import {
  getAllPurchaseInvoices,
  getAllStates,
} from "@/services/purchases.service";
import PurchaseInvoiceTable from "@/components/purchaseInvoice/PurchaseInvoiceTable";

import PurchaseInvoiceAllStatesProps from "@/components/purchaseInvoice/PruchaseInvoiceAllstate";

export default async function PurchaseInvoicesPage() {
  const invoices = await getAllPurchaseInvoices();
  const states = await getAllStates();
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium">فواتير الشراء</h1>
          <p className="text-sm text-muted-foreground mt-1">
            إدارة جميع فواتير الشراء
          </p>
        </div>
        <Link
          href="/purchaseInvoices/create"
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-green-700 hover:bg-green-800 text-white "
        >
          + فاتورة جديدة
        </Link>
      </div>
      <div className="grid">
        <PurchaseInvoiceAllStatesProps allstates={states} />
      </div>
      <PurchaseInvoiceTable invoices={invoices} />
    </div>
  );
}
