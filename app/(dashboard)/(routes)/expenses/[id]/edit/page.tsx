import { getOneExpense } from "@/services/expenses.service";
import ExpenseEditForm from "@/components/expense/ExpenseEditForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditExpensePage({ params }: Props) {
  const { id } = await params;
  const expense = await getOneExpense(id);

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-medium">تعديل المصروف</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {expense.expenseInvoiceNumber}
        </p>
      </div>
      <ExpenseEditForm expense={expense} />
    </div>
  );
}
