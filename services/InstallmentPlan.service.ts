// services/installmentPlan.service.ts
import type {
  InstallmentPlan,
  CreateInstallmentPlanDto,
  UpdateInstallmentPlanDto,
} from "@/types/installmentPlan";

const BASE_URL = `https://back-end-crm-project.vercel.app/api/installmentPlan/`;

export async function getAllInstallments(): Promise<InstallmentPlan[]> {
  try {
    const res = await fetch(BASE_URL, { cache: "no-store" });

    if (!res.ok) throw new Error(res.statusText || "Failed to fetch installment plans");

    const data = await res.json();
    return data?.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to fetch installment plans");
  }
}

export async function getOneInstallment(id: string): Promise<InstallmentPlan> {
  try {
    const res = await fetch(`${BASE_URL}${id}`, { cache: "no-store" });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(
        body?.message ?? body?.error ?? `Failed to fetch installment plan (${res.status})`
      );
    }

    const data = await res.json();
    return data?.data;               
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to fetch installment plan");
  }
}

export async function createInstallment(
  payload: CreateInstallmentPlanDto
): Promise<InstallmentPlan> {
  try {
    const res = await fetch(`${BASE_URL}addInstallmentPlan`, {
      method: "POST",                                 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(payload),                   
    });

    if (!res.ok) throw new Error(res.statusText || "Failed to create installment plan");

    const data = await res.json();
    return data?.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to create installment plan");
  }
}

export async function updateInstallment(
  id: string,
  payload: UpdateInstallmentPlanDto  
): Promise<InstallmentPlan> {
  try {
    const res = await fetch(`${BASE_URL}${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(payload),                   
    });

    if (!res.ok) throw new Error(res.statusText || "Failed to update installment plan");

    const data = await res.json();
    return data?.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to update installment plan");
  }
}

export async function deleteOneInstallment(id: string): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}${id}`, { method: "DELETE" });

    if (!res.ok) throw new Error(res.statusText || "Failed to delete installment plan");
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to delete installment plan");
  }
}