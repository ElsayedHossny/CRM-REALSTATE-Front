// components/purchaseInvoice/PurchaseInvoiceCreateForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPurchaseInvoice } from "@/services/purchases.service";
import type { CreatePurchaseInvoiceDto } from "@/types/purchaseInvoice.types";

const EMPTY: CreatePurchaseInvoiceDto = {
  invoiceNumber: "",
  invoiceDate: new Date().toISOString().split("T")[0],
  supplierName: "",
  items: 0,
  totalAmount: 0,
  paidAmount: 0,
  status: "معلق",
};

export default function PurchaseInvoiceCreateForm() {
  const router = useRouter();
  const [form, setForm] = useState<CreatePurchaseInvoiceDto>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): string | null => {
    if (!form.invoiceNumber.trim()) return "رقم الفاتورة مطلوب";
    if (!form.supplierName.trim()) return "اسم المورد مطلوب";
    if (form.items < 0) return "عدد الأصناف يجب أن يكون 0 أو أكثر";
    if (form.totalAmount < 0) return "الإجمالي يجب أن يكون 0 أو أكثر";
    if (form.paidAmount < 0) return "المدفوع يجب أن يكون 0 أو أكثر";
    if (form.paidAmount > form.totalAmount)
      return "المدفوع لا يمكن أن يتجاوز الإجمالي";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await createPurchaseInvoice(form);
      router.push("/purchaseInvoices");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-sm text-muted-foreground">
            رقم الفاتورة <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.invoiceNumber}
            onChange={(e) =>
              setForm((f) => ({ ...f, invoiceNumber: e.target.value }))
            }
            placeholder="INV-001"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-sm text-muted-foreground">
            تاريخ الفاتورة
          </label>
          <input
            type="date"
            value={form.invoiceDate}
            onChange={(e) =>
              setForm((f) => ({ ...f, invoiceDate: e.target.value }))
            }
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5 col-span-2">
          <label className="text-sm text-muted-foreground">
            اسم المورد <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.supplierName}
            onChange={(e) =>
              setForm((f) => ({ ...f, supplierName: e.target.value }))
            }
            placeholder="شركة النيل للتوريدات"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-sm text-muted-foreground">
            عدد الأصناف <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={0}
            value={form.items}
            onChange={(e) =>
              setForm((f) => ({ ...f, items: Number(e.target.value) }))
            }
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-sm text-muted-foreground">الحالة</label>
          <select
            value={form.status}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                status: e.target.value as "مدفوع" | "معلق",
              }))
            }
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="معلق">معلق</option>
            <option value="مدفوع">مدفوع</option>
          </select>
        </div>

        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-sm text-muted-foreground">
            الإجمالي (ج.م) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={0}
            value={form.totalAmount}
            onChange={(e) =>
              setForm((f) => ({ ...f, totalAmount: Number(e.target.value) }))
            }
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-sm text-muted-foreground">المدفوع (ج.م)</label>
          <input
            type="number"
            min={0}
            value={form.paidAmount}
            onChange={(e) =>
              setForm((f) => ({ ...f, paidAmount: Number(e.target.value) }))
            }
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Remaining amount indicator */}
        <div className="col-span-2 rounded-lg bg-muted/50 px-4 py-3 flex justify-between items-center">
          <span className="text-sm text-muted-foreground">المبلغ المتبقي</span>
          <span
            className={`text-sm font-medium ${
              form.totalAmount - form.paidAmount > 0
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          >
            {(form.totalAmount - form.paidAmount).toLocaleString("ar-EG")} ج.م
          </span>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
        >
          إلغاء
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 px-4 py-2 text-sm rounded-lg bg-foreground text-background hover:opacity-85 transition-opacity disabled:opacity-50"
        >
          {loading ? "جاري الإنشاء..." : "إنشاء الفاتورة"}
        </button>
      </div>
    </div>
  );
}
