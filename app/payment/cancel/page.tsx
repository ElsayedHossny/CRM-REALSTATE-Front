"use client";

import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">تم إلغاء الدفع</h1>
        <p className="text-gray-500 mb-8">لم يتم إتمام عملية الدفع، يمكنك المحاولة مرة أخرى</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push('/clients')}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl transition-colors"
          >
            العودة للعملاء والمحاولة مرة أخرى
          </button>
        </div>

      </div>
    </div>
  );
}