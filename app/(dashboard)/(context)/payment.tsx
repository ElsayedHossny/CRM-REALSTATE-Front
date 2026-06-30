"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import Cookies from "js-cookie";
import { getAllPayments } from "@/services/payment";
import { IPayment } from "@/interfaces/payment";

interface PaymentContextType {
  payments: IPayment[];
  loading: boolean;
  fetchPayments: () => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);

      // Try reading directly from document.cookie as a fallback
      const token =
        Cookies.get("admin_token") ||
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("admin_token="))
          ?.split("=")[1];

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await getAllPayments(token);

      if (response && Array.isArray(response)) {
        setPayments(response);
      }
    } catch (error) {
      console.error("Failed to load payments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <PaymentContext.Provider
      value={{
        payments,
        loading,
        fetchPayments,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayments() {
  const context = useContext(PaymentContext);

  if (!context) {
    throw new Error("usePayments must be used within PaymentProvider");
  }

  return context;
}
