// components/expense/ExpenseEditForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateExpense } from "@/services/expenses.service";
import type { Expense, UpdateExpenseDto } from "@/types/expense.types";

interface Props {
  expense: Expense;
}

export default function ExpenseEditForm({ expense }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<UpdateExpenseDto>({
    expenseInvoiceNumber: expense?.expenseInvoiceNumber ?? "",
    expenseDate: expense?.expenseDate ?? new Date().toISOString().split("T")[0],
    description: expense?.description ?? "", // ← مش undefined
    type: expense?.type ?? "",
    amount: expense?.amount ?? 0,
    wallet: expense?.wallet ?? "", // ← مش undefined
    paymentMethod: expense?.paymentMethod ?? "", // ← مش undefined
    status: expense?.status ?? "مدفوع",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): string | null => {
    if (!form.expenseInvoiceNumber?.trim()) return "رقم الفاتورة مطلوب";
    if (!form.description?.trim()) return "اسم المورد مطلوب";
    if (!form.type?.trim()) return "نوع المصروف مطلوب";
    if (form.amount! < 0) return "المبلغ يجب أن يكون 0 أو أكثر";
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
      await updateExpense(expense._id, form);
      router.push("/expenses");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء التعديل");
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
            value={form.expenseInvoiceNumber}
            onChange={(e) =>
              setForm((f) => ({ ...f, expenseInvoiceNumber: e.target.value }))
            }
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-sm text-muted-foreground">تاريخ المصروف</label>
          <input
            type="date"
            value={form.expenseDate}
            onChange={(e) =>
              setForm((f) => ({ ...f, expenseDate: e.target.value }))
            }
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-sm text-muted-foreground">
            الوصف<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-sm text-muted-foreground">
            المحفظة <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.wallet ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, wallet: e.target.value }))}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-sm text-muted-foreground">
            طريقة الدفع <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.paymentMethod ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, paymentMethod: e.target.value }))
            }
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-sm text-muted-foreground">
            النوع <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-sm text-muted-foreground">
            المبلغ (ج.م) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={0}
            value={form.amount}
            onChange={(e) =>
              setForm((f) => ({ ...f, amount: Number(e.target.value) }))
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
            <option value="مدفوع">مدفوع</option>
            <option value="معلق">معلق</option>
          </select>
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
          {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
        </button>
      </div>
    </div>
  );
}
