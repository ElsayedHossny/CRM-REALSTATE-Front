// app/expenses/[id]/page.tsx
import { getOneExpense } from "@/services/expenses.service";
import Link from "next/link";
import { Pencil } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ExpenseDetailPage({ params }: Props) {
  const { id } = await params;
  const expense = await getOneExpense(id);

  return (
    <div className="p-6 max-w-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium">
            {expense.expenseInvoiceNumber}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">تفاصيل المصروف</p>
        </div>
        <Link
          href={`/expenses/${expense._id}/edit`}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
        >
          <Pencil size={14} /> تعديل
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">رقم الفاتورة</span>
          <span className="text-sm font-mono font-medium">
            {expense.expenseInvoiceNumber}
          </span>
        </div>
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">الوصف</span>
          <span className="text-sm font-medium">{expense.description}</span>
        </div>
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">النوع</span>
          <span className="text-sm text-muted-foreground">{expense.type}</span>
        </div>
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">المبلغ</span>
          <span className="text-sm font-medium">
            {expense.amount.toLocaleString("ar-EG")} ج.م
          </span>
        </div>
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">تاريخ المصروف</span>
          <span className="text-sm text-muted-foreground">
            {new Date(expense.expenseDate).toLocaleDateString("ar-EG")}
          </span>
        </div>
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">الحالة</span>
          <span
            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
              expense.status === "مدفوع"
                ? "bg-green-50 text-green-700"
                : "bg-yellow-50 text-yellow-700"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                expense.status === "مدفوع" ? "bg-green-500" : "bg-yellow-500"
              }`}
            />
            {expense.status}
          </span>
        </div>
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">تاريخ الإنشاء</span>
          <span className="text-sm text-muted-foreground">
            {new Date(expense.createdAt).toLocaleDateString("ar-EG")}
          </span>
        </div>
      </div>

      <Link
        href="/expenses"
        className="inline-block mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← رجوع للقائمة
      </Link>
    </div>
  );
}
