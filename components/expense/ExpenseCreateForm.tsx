// components/expense/ExpenseCreateForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createExpense } from "@/services/expenses.service";
import type { CreateExpenseDto } from "@/types/expense.types";

const EMPTY: CreateExpenseDto = {
  expenseInvoiceNumber: "",
  expenseDate: new Date().toISOString().split("T")[0],
  description: "", // ← ضيفها
  type: "",
  amount: 0,
  wallet: "", // ← ضيفها
  paymentMethod: "", // ← ضيفها
  status: "مدفوع",
};

export default function ExpenseCreateForm() {
  const router = useRouter();
  const [form, setForm] = useState<CreateExpenseDto>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): string | null => {
    if (!form.expenseInvoiceNumber.trim()) return "رقم الفاتورة مطلوب";
    if (!form.description?.trim()) return "الوصف مطلوب";
    if (!form.type.trim()) return "نوع المصروف مطلوب";
    if (!form.wallet?.trim()) return "المحفظة مطلوبة"; // ← ضيفها
    if (!form.paymentMethod?.trim()) return "طريقة الدفع مطلوبة"; // ← ضيفها
    if (form.amount <= 0) return "المبلغ يجب أن يكون أكبر من 0";
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

      const payload = {
        expenseInvoiceNumber: form.expenseInvoiceNumber,
        expenseDate: new Date(form.expenseDate).toISOString(),
        description: form.description,
        type: form.type,
        amount: form.amount,
        wallet: form.wallet,
        paymentMethod: form.paymentMethod,
        status: form.status,
      };

      console.log("payload:", JSON.stringify(payload));
      await createExpense(payload as CreateExpenseDto);
      router.push("/expenses");
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
        {/* Invoice Number */}
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
            placeholder="EXP-001"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Date */}
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

        {/* Supplier */}
        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-sm text-muted-foreground">
            الوصف <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="شركة النيل للتوريدات"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        {/* Wallet */}
        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-sm text-muted-foreground">
            المحفظة <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.wallet ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, wallet: e.target.value }))}
            placeholder="Main Cash"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Payment Method */}
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
            placeholder="Cash"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Type */}
        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-sm text-muted-foreground">
            النوع <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            placeholder="إيجار / مرافق / رواتب"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Amount */}
        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-sm text-muted-foreground">
            المبلغ (ج.م) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) =>
              setForm((f) => ({ ...f, amount: Number(e.target.value) }))
            }
            placeholder="0"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Status */}
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
          {loading ? "جاري الإنشاء..." : "إنشاء المصروف"}
        </button>
      </div>
    </div>
  );
}
