// app/expenses/page.tsx
import Link from "next/link";
import { getAllExpenses, getAllStates } from "@/services/expenses.service";
import ExpenseTable from "@/components/expense/ExpenseTable";
import ExpensesAllStates from "@/components/expense/ExpensesAllStates";

export default async function ExpensesPage() {
  const expenses = await getAllExpenses();
  const states = await getAllStates();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium">المصروفات</h1>
          <p className="text-sm text-muted-foreground mt-1">
            إدارة جميع المصروفات
          </p>
        </div>

        <Link
          href="/expenses/create"
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg text-white font-semibold bg-green-700 hover:bg-green-800 transition-opacity"
        >
          + مصروف جديد
        </Link>
      </div>
      <div className="grid">
        <ExpensesAllStates allstates={states} />
      </div>
      <ExpenseTable expenses={expenses} />
    </div>
  );
}
