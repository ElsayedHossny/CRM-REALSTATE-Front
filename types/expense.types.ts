// types/expense.types.ts
export interface Expense {
  _id: string;
  expenseInvoiceNumber: string;
  expenseDate: string;
  description?: string;    // ← ضيفها
  type: string;
  amount: number;
  wallet?: string;         // ← ضيفها
  paymentMethod?: string;  // ← ضيفها
  status: "مدفوع" | "معلق";
  createdAt: string;
  updatedAt: string;
}



export type CreateExpenseDto = Omit<Expense, "_id" | "createdAt" | "updatedAt">;
export type UpdateExpenseDto = Partial<CreateExpenseDto>;


export interface ExpensesAllStatesProps {
  allstates: any;
}