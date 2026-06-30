// services/purchaseInvoice.service.ts
import type {
  PurchaseInvoice,
  CreatePurchaseInvoiceDto,
  UpdatePurchaseInvoiceDto,
} from "@/types/purchaseInvoice.types";

const BASE_URL = `https://back-end-crm-project.vercel.app/api/purchaseInvoices/`;

async function parseError(res: Response, fallback: string): Promise<never> {
  const body = await res.json().catch(() => null);
  throw new Error(body?.message ?? body?.error ?? `${fallback} (${res.status})`);
}

export async function getAllPurchaseInvoices(): Promise<PurchaseInvoice[]> {
  try {
    const res = await fetch(BASE_URL, { cache: "no-store" });
    if (!res.ok) await parseError(res, "Failed to fetch purchase invoices");
    const data = await res.json();
    return data?.data.purchaseInvoices;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to fetch purchase invoices");
  }
}

export async function getOnePurchaseInvoice(id: string): Promise<PurchaseInvoice> {
  try {
    const res = await fetch(`${BASE_URL}${id}`, { cache: "no-store" });
    if (!res.ok) await parseError(res, "Failed to fetch purchase invoice");
    const data = await res.json();
    console.log(data?.data)
    return data?.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to fetch purchase invoice");
  }
}

export async function createPurchaseInvoice(
  payload: CreatePurchaseInvoiceDto
): Promise<PurchaseInvoice> {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) await parseError(res, "Failed to create purchase invoice");
    const data = await res.json();
    return data?.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to create purchase invoice");
  }
}

export async function updatePurchaseInvoice(
  id: string,
  payload: UpdatePurchaseInvoiceDto
): Promise<PurchaseInvoice> {
  try {
    const res = await fetch(`${BASE_URL}${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) await parseError(res, "Failed to update purchase invoice");
    const data = await res.json();
    return data?.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to update purchase invoice");
  }
}

export async function deleteOnePurchaseInvoice(id: string): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}${id}`, { method: "DELETE" });
    if (!res.ok) await parseError(res, "Failed to delete purchase invoice");
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to delete purchase invoice");
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
