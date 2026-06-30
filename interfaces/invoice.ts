export interface IInvoice {
  _id: string;
  invoiceNumber: string;

  customer_id: {
    _id: string;

    user_id: {
      _id: string;
      name: string;
      email?: string;
    };

    totalPrice: number;
    downPayment: number;
    notes?: string;
  } | null;

  property_id: {
    _id: string;
    title: string;
    price: number;
  } | null;

  installmentPlan_id: {
    _id: string;
    name: string;
    months: number;
    downPaymentPercentage: number;
  } | null;

  parentInvoice_id: string | null;
  installment_id: string | null;

  paymentType: "CASH" | "INSTALLMENT";

  basePrice: number;
  discount: number;
  tax: number;

  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;

  status: "PAID" | "PARTIAL" | "UNPAID" | "OVERDUE";

  months?: number;
  monthlyAmount?: number;
  downPaymentPercentage?: number;
  notes?: string;

  createdAt: string;
  updatedAt: string;
}