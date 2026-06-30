export type InvoiceStatus = "paid" | "partial" | "overdue";

export type Invoice = {
  id: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  total: number;
  paid: number;
  remaining: number;
  status: InvoiceStatus;
};

export const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    date: "2024/04/15",
    customerName: "شركة الأفق للتقنية",
    total: 12500,
    paid: 12500,
    remaining: 0,
    status: "paid",
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    date: "2024/04/18",
    customerName: "مؤسسة النور التجارية",
    total: 8750,
    paid: 4000,
    remaining: 4750,
    status: "partial",
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-003",
    date: "2024/04/20",
    customerName: "متجر الرياض الإلكتروني",
    total: 33200,
    paid: 0,
    remaining: 33200,
    status: "overdue",
  },
  {
    id: "4",
    invoiceNumber: "INV-2024-004",
    date: "2024/04/22",
    customerName: "مكتبة ومطبعة النجاح",
    total: 1500,
    paid: 1500,
    remaining: 0,
    status: "paid",
  },
];