// app/purchaseInvoices/[id]/page.tsx
import { getOnePurchaseInvoice } from "@/services/purchases.service";
import Link from "next/link";
import { Pencil } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PurchaseInvoiceDetailPage({ params }: Props) {
  const { id } = await params;
  const invoice = await getOnePurchaseInvoice(id);
  const remaining = invoice.totalAmount - invoice.paidAmount;

  return (
    <div className="p-6 max-w-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium">{invoice.invoiceNumber}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            تفاصيل فاتورة الشراء
          </p>
        </div>
        <Link
          href={`/purchaseInvoices/${invoice._id}/edit`}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
        >
          <Pencil size={14} /> تعديل
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">رقم الفاتورة</span>
          <span className="text-sm font-mono font-medium">
            {invoice.invoiceNumber}
          </span>
        </div>
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">المورد</span>
          <span className="text-sm font-medium">{invoice.supplierName}</span>
        </div>
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">عدد الأصناف</span>
          <span className="text-sm text-muted-foreground">{invoice.items}</span>
        </div>
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">الإجمالي</span>
          <span className="text-sm font-medium">
            {invoice.totalAmount.toLocaleString("ar-EG")} ج.م
          </span>
        </div>
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">المدفوع</span>
          <span className="text-sm text-green-600 font-medium">
            {invoice.paidAmount.toLocaleString("ar-EG")} ج.م
          </span>
        </div>
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">المتبقي</span>
          <span
            className={`text-sm font-medium ${remaining > 0 ? "text-yellow-600" : "text-green-600"}`}
          >
            {remaining.toLocaleString("ar-EG")} ج.م
          </span>
        </div>
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">تاريخ الفاتورة</span>
          <span className="text-sm text-muted-foreground">
            {new Date(invoice.invoiceDate).toLocaleDateString("ar-EG")}
          </span>
        </div>
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">الحالة</span>
          <span
            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
              invoice.status === "مدفوع"
                ? "bg-green-50 text-green-700"
                : "bg-yellow-50 text-yellow-700"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                invoice.status === "مدفوع" ? "bg-green-500" : "bg-yellow-500"
              }`}
            />
            {invoice.status}
          </span>
        </div>
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">تاريخ الإنشاء</span>
          <span className="text-sm text-muted-foreground">
            {new Date(invoice.createdAt).toLocaleDateString("ar-EG")}
          </span>
        </div>
      </div>

      <Link
        href="/purchaseInvoices"
        className="inline-block mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← رجوع للقائمة
      </Link>
    </div>
  );
}
