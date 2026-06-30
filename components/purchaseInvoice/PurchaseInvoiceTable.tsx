// components/purchaseInvoice/PurchaseInvoiceTable.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { deleteOnePurchaseInvoice } from "@/services/purchases.service";
import type { PurchaseInvoice } from "@/types/purchaseInvoice.types";

interface Props {
  invoices: PurchaseInvoice[];
}

export default function PurchaseInvoiceTable({ invoices }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفاتورة؟")) return;
    try {
      setDeletingId(id);
      setError(null);
      await deleteOnePurchaseInvoice(id);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء الحذف");
    } finally {
      setDeletingId(null);
    }
  };

  if (!invoices?.length) {
    return (
      <div className="rounded-xl border border-border py-16 text-center text-sm text-muted-foreground">
        لا توجد فواتير شراء بعد
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-xs text-muted-foreground">
              <th className="text-right px-5 py-3 font-medium">رقم الفاتورة</th>
              <th className="text-right px-5 py-3 font-medium">المورد</th>
              <th className="text-right px-5 py-3 font-medium">الأصناف</th>
              <th className="text-right px-5 py-3 font-medium">الإجمالي</th>
              <th className="text-right px-5 py-3 font-medium">المدفوع</th>
              <th className="text-right px-5 py-3 font-medium">التاريخ</th>
              <th className="text-right px-5 py-3 font-medium">الحالة</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, i) => (
              <tr
                key={invoice._id}
                className={`border-t border-border hover:bg-muted/40 transition-colors ${
                  i % 2 !== 0 ? "bg-muted/20" : ""
                }`}
              >
                <td className="px-5 py-3 font-mono font-medium">
                  {invoice.invoiceNumber}
                </td>

                <td className="px-5 py-3 text-muted-foreground">
                  {invoice.supplierName}
                </td>

                <td className="px-5 py-3 text-muted-foreground">
                  {invoice.items}
                </td>

                <td className="px-5 py-3 font-medium">
                  {(invoice.totalAmount ?? 0).toLocaleString("ar-EG")} ج.م
                </td>

                <td className="px-5 py-3 text-muted-foreground">
                  {(invoice.paidAmount ?? 0).toLocaleString("ar-EG")} ج.م
                </td>

                <td className="px-5 py-3 text-muted-foreground">
                  {new Date(invoice.invoiceDate).toLocaleDateString("ar-EG")}
                </td>

                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                      invoice.status === "مدفوع"
                        ? "bg-green-50 text-green-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        invoice.status === "مدفوع"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    />
                    {invoice.status}
                  </span>
                </td>

                <td className="px-5 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Link
                      href={`/purchaseInvoices/${invoice._id}`}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title="عرض"
                    >
                      <Eye size={15} />
                    </Link>
                    <Link
                      href={`/purchaseInvoices/${invoice._id}/edit`}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title="تعديل"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(invoice._id)}
                      disabled={deletingId === invoice._id}
                      className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                      title="حذف"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
