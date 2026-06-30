export interface IPayment {
  _id: string;

  invoice_id: {
    _id: string;
    invoiceNumber: string;
  };

  customer_id: {
    _id: string;
    user_id?: {
      name: string;
    };
  };

  property_id: {
    _id: string;
    title: string;
  };

  amount: number;

  paymentMethod: "STRIPE" | "CASH";

  transactionId: string;

  status: "SUCCESS" | "FAILED" | "PENDING";

  paidAt: string;

  createdAt: string;
}