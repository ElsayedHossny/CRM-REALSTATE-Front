"use client";

import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        
        {/* أيقونة النجاح */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* النص */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          تم الدفع بنجاح! 🎉
        </h1>
        <p className="text-gray-500 mb-2">
          تم استلام دفعتك وتسجيلها في النظام
        </p>
        <p className="text-sm text-gray-400 mb-8">
          سيتم إرسال إيصال الدفع على بريدك الإلكتروني
        </p>

        {/* تفاصيل */}
        <div className="bg-green-50 rounded-xl p-4 mb-8 text-right">
          <div className="flex justify-between items-center mb-2">
            <span className="text-green-700 font-medium text-sm">حالة الدفع</span>
            <span className="text-green-600 text-sm font-bold">✓ مكتمل</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-green-700 font-medium text-sm">طريقة الدفع</span>
            <span className="text-green-600 text-sm">بطاقة ائتمان</span>
          </div>
        </div>

        

      </div>
    </div>
  );
}