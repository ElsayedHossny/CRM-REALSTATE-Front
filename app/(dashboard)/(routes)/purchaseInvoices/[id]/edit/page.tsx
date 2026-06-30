// app/purchaseInvoices/[id]/edit/page.tsx
import { getOnePurchaseInvoice } from "@/services/purchases.service";
import PurchaseInvoiceEditForm from "@/components/purchaseInvoice/PurchaseInvoiceEditForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPurchaseInvoicePage({ params }: Props) {
  const { id } = await params;
  const invoice = await getOnePurchaseInvoice(id);

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-medium">تعديل فاتورة الشراء</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {invoice.invoiceNumber}
        </p>
      </div>
      <PurchaseInvoiceEditForm invoice={invoice} />
    </div>
  );
}
