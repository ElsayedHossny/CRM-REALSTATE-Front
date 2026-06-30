// types/purchaseInvoice.types.ts

export interface PurchaseInvoice {
  _id: string;
  invoiceNumber: string;
  invoiceDate: string;
  supplierName: string;
  items: number;
  totalAmount: number;
  paidAmount: number;
  status: "مدفوع" | "معلق";
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseInvoiceAllStatesProps {
  allstates: any;
}

export type CreatePurchaseInvoiceDto = Omit<PurchaseInvoice, "_id" | "createdAt" | "updatedAt">;
export type UpdatePurchaseInvoiceDto = Partial<CreatePurchaseInvoiceDto>;