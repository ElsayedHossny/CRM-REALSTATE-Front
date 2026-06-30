// app/purchaseInvoices/create/page.tsx
import PurchaseInvoiceCreateForm from "@/components/purchaseInvoice/PurchaseInvoiceCreateForm";

export default function CreatePurchaseInvoicePage() {
  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-medium">فاتورة شراء جديدة</h1>
        <p className="text-sm text-muted-foreground mt-1">
          إضافة فاتورة شراء جديدة للنظام
        </p>
      </div>
      <PurchaseInvoiceCreateForm />
    </div>
  );
}
