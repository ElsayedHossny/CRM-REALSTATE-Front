// app/expenses/create/page.tsx
import ExpenseCreateForm from "@/components/expense/ExpenseCreateForm";

export default function CreateExpensePage() {
  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-medium">مصروف جديد</h1>
        <p className="text-sm text-muted-foreground mt-1">
          إضافة مصروف جديد للنظام
        </p>
      </div>
      <ExpenseCreateForm />
    </div>
  );
}
