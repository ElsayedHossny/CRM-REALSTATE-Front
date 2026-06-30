"use client";

import React, { createContext, useContext, useState } from "react";
import { Toast } from "@/components/ui/Toast";

const ToastContext = createContext<any>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* الكومبوننت بتاعك بيظهر هنا أوتوماتيك */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
