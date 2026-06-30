// components/expense/ExpenseTable.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { deleteOneExpense } from "@/services/expenses.service";
import type { Expense } from "@/types/expense.types";

interface Props {
  expenses: Expense[];
}

export default function ExpenseTable({ expenses }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المصروف؟")) return;
    try {
      setDeletingId(id);
      setError(null);
      await deleteOneExpense(id);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء الحذف");
    } finally {
      setDeletingId(null);
    }
  };

  if (!expenses?.length) {
    return (
      <div className="rounded-xl border border-border py-16 text-center text-sm text-muted-foreground">
        لا توجد مصروفات بعد
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
              <th className="text-right px-5 py-3 font-medium">الوصف</th>
              <th className="text-right px-5 py-3 font-medium">النوع</th>
              <th className="text-right px-5 py-3 font-medium">المبلغ</th>
              <th className="text-right px-5 py-3 font-medium">التاريخ</th>
              <th className="text-right px-5 py-3 font-medium">الحالة</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, i) => (
              <tr
                key={expense._id}
                className={`border-t border-border hover:bg-muted/40 transition-colors ${
                  i % 2 !== 0 ? "bg-muted/20" : ""
                }`}
              >
                <td className="px-5 py-3 font-medium font-mono">
                  {expense.expenseInvoiceNumber}
                </td>

                <td className="px-5 py-3 text-muted-foreground">
                  {expense.description}
                </td>

                <td className="px-5 py-3 text-muted-foreground">
                  {expense.type}
                </td>

                <td className="px-5 py-3 font-medium">
                  {expense.amount.toLocaleString("ar-EG")} ج.م
                </td>

                <td className="px-5 py-3 text-muted-foreground">
                  {new Date(expense.expenseDate).toLocaleDateString("ar-EG")}
                </td>

                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                      expense.status === "مدفوع"
                        ? "bg-green-50 text-green-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        expense.status === "مدفوع"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    />
                    {expense.status}
                  </span>
                </td>

                <td className="px-5 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Link
                      href={`/expenses/${expense._id}`}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title="عرض"
                    >
                      <Eye size={15} />
                    </Link>
                    <Link
                      href={`/expenses/${expense._id}/edit`}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title="تعديل"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(expense._id)}
                      disabled={deletingId === expense._id}
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
