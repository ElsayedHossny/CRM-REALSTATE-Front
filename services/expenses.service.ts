// services/expense.service.ts
import type { Expense, CreateExpenseDto, UpdateExpenseDto } from "@/types/expense.types";


const BASE_URL = `https://back-end-crm-project.vercel.app/api/expenses/`;

async function parseError(res: Response, fallback: string): Promise<never> {
  const body = await res.json().catch(() => null);
  throw new Error(body?.message ?? body?.error ?? `${fallback} (${res.status})`);
}

export async function getAllExpenses(): Promise<Expense[]> {
  try {
    const res = await fetch(BASE_URL, { cache: "no-store" });
    if (!res.ok) await parseError(res, "Failed to fetch expenses");
    const data = await res.json();
    return data?.expenses;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to fetch expenses");
  }
}

export async function getOneExpense(id: string): Promise<Expense> {
  try {
    const res = await fetch(`https://back-end-crm-project.vercel.app/api/expenses?id=${id}`, { cache: "no-store" });
    if (!res.ok) await parseError(res, "Failed to fetch expense");
    const data = await res.json();
    console.log(data)
    return data?.expenses[0];
    
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to fetch expense");
  }
}

export async function createExpense(payload: CreateExpenseDto): Promise<Expense> {
  try {
    console.log(payload);
    console.log(BASE_URL+"addexpense");

    
    const res = await fetch("https://back-end-crm-project.vercel.app/api/expenses/addexpense", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) await parseError(res, "Failed to create expense");
    const data = await res.json();
    console.log(data);
    return data?.data; 
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to create expense");
  }
}

export async function updateExpense(id: string, payload: UpdateExpenseDto): Promise<Expense> {
  try {
    const res = await fetch(`${BASE_URL}${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) await parseError(res, "Failed to update expense");
    const data = await res.json();
    return data?.expenses;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to update expense");
  }
}

export async function deleteOneExpense(id: string): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}${id}`, { method: "DELETE" });
    if (!res.ok) await parseError(res, "Failed to delete expense");
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to delete expense");
  }
}

export async function getAllStates(): Promise<any> {

  const res = await fetch(`${BASE_URL}stats`, {
    method: "GET",
     headers: { "Content-Type": "application/json" },
  });

  const {data} =await res.json();

  if (!res.ok) {
    throw new Error("فشل في جلب التصنيفات من السيرفر");
  }
  
  return data;
}


