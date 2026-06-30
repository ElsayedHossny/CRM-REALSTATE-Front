"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createInstallment } from "@/services/InstallmentPlan.service";
import type { CreateInstallmentPlanDto } from "@/types/installmentPlan";

type Props = { mode: "create" };

const EMPTY: CreateInstallmentPlanDto = {
  name: "",
  months: 1,
  downPaymentPercentage: 0,
  isActive: true,
};

export default function InstallmentPlanForm({ mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<CreateInstallmentPlanDto>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): string | null => {
    if (!form.name.trim()) return "الاسم مطلوب";
    if (form.months < 1) return "عدد الأشهر يجب أن يكون 1 على الأقل";
    if (form.downPaymentPercentage < 0 || form.downPaymentPercentage > 100)
      return "نسبة الدفعة الأولى بين 0 و 100";
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
      await createInstallment(form);
      router.push("/installmentPlans");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      {/* Name */}
      <div className="space-y-1.5">
        <label className="text-sm text-muted-foreground">
          الاسم <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="مثال: تقسيط 12 شهر"
          className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Months */}
      <div className="space-y-1.5">
        <label className="text-sm text-muted-foreground">
          عدد الأشهر <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min={1}
          value={form.months}
          onChange={(e) =>
            setForm((f) => ({ ...f, months: Number(e.target.value) }))
          }
          placeholder="12"
          className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Down Payment */}
      <div className="space-y-1.5">
        <label className="text-sm text-muted-foreground">
          نسبة الدفعة الأولى % <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min={0}
          max={100}
          value={form.downPaymentPercentage}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              downPaymentPercentage: Number(e.target.value),
            }))
          }
          placeholder="20"
          className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* isActive */}
      <div className="flex items-center justify-between py-1">
        <span className="text-sm text-muted-foreground">تفعيل الخطة</span>
        <button
          type="button"
          onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
          className={`relative w-10 h-6 rounded-full transition-colors ${
            form.isActive ? "bg-green-500" : "bg-muted"
          }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
              form.isActive ? "left-5" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* Actions */}
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
          {loading ? "جاري الإنشاء..." : "إنشاء الخطة"}
        </button>
      </div>
    </div>
  );
}
