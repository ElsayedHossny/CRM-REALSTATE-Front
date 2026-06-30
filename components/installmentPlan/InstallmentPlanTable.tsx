// components/installmentPlan/InstallmentPlanTable.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react"; // ✅ إضافة Eye
import { deleteOneInstallment } from "@/services/InstallmentPlan.service";
import type { InstallmentPlan } from "@/types/installmentPlan";

interface Props {
  plans: InstallmentPlan[];
}

export default function InstallmentPlanTable({ plans }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخطة؟")) return;
    try {
      setDeletingId(id);
      setError(null);
      await deleteOneInstallment(id);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء الحذف");
    } finally {
      setDeletingId(null);
    }
  };

  if (!plans?.length) {
    return (
      <div className="rounded-xl border border-border py-16 text-center text-sm text-muted-foreground">
        لا توجد خطط تقسيط بعد
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
              <th className="text-right px-5 py-3 font-medium">الاسم</th>
              <th className="text-right px-5 py-3 font-medium">المدة</th>
              <th className="text-right px-5 py-3 font-medium">
                الدفعة الأولى
              </th>
              <th className="text-right px-5 py-3 font-medium">الحالة</th>
              <th className="text-right px-5 py-3 font-medium">
                تاريخ الإنشاء
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, i) => (
              <tr
                key={plan._id}
                className={`border-t border-border hover:bg-muted/40 transition-colors ${
                  i % 2 !== 0 ? "bg-muted/20" : ""
                }`}
              >
                <td className="px-5 py-3 font-medium">{plan.name}</td>
                <td className="px-5 py-3 text-muted-foreground">
                  {plan.months} شهر
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {plan.downPaymentPercentage}%
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                      plan.isActive
                        ? "bg-green-50 text-green-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${plan.isActive ? "bg-green-500" : "bg-gray-400"}`}
                    />
                    {plan.isActive ? "فعّال" : "معطّل"}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {new Date(plan.createdAt).toLocaleDateString("ar-EG")}
                </td>

                <td className="px-5 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    {/* ✅ View */}
                    <Link
                      href={`/installmentPlans/${plan._id}`}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title="عرض"
                    >
                      <Eye size={15} />
                    </Link>

                    {/* Edit */}
                    <Link
                      href={`/installmentPlans/${plan._id}/edit`}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title="تعديل"
                    >
                      <Pencil size={15} />
                    </Link>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(plan._id)}
                      disabled={deletingId === plan._id}
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
