export type InstallmentStatus = 'PAID' | 'PENDING' | 'UNPAID';

export interface Installment {
  amount: number;
  dueDate: string;
  status: InstallmentStatus;
  paidAt?: string | null;
  _id?: string;
}

export interface UserDetails {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface PropertyDetails {
  _id: string;
  title: string;
  price: number;
}

export interface Client {
  _id: string;
  user_id: UserDetails | null;
  property_id: PropertyDetails | null;
  totalPrice: number;
  downPayment: number;
  notes: string;
  installments: Installment[];
}

export interface CreateClientInput {
  user_id: string;
  property_id: string;
  totalPrice: number;
  downPayment: number;
  notes: string;
  installments: {
    amount: number;
    dueDate: string;
    status: InstallmentStatus;
    paidAt?: string | null;
  }[];
}