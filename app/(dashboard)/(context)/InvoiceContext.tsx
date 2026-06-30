"use client";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { getAllInvoices } from '@/services/invoice';
import { IInvoice } from '@/interfaces/invoice';

interface InvoiceContextType {
  invoices: IInvoice[];
  loading: boolean;
  fetchInvoices: () => Promise<void>;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ الـ useCallback جوا الـ InvoiceProvider
  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const token = Cookies.get('admin_token');
      if (!token) return;

      const response = await getAllInvoices(token);
      if (response?.data && Array.isArray(response.data)) {
        setInvoices(response.data as IInvoice[]);
      }
    } catch (error) {
      console.error("Failed to load invoices:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();

  }, [fetchInvoices]);

  return (
    <InvoiceContext.Provider value={{ invoices, loading, fetchInvoices }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const context = useContext(InvoiceContext);
  if (!context) throw new Error("useInvoices must be used within an InvoiceProvider");
  return context;
}