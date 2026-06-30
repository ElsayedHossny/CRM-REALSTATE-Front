"use client";
import React from 'react';

interface InvoiceSummaryProps {
  basePrice: number;
  discount: number;
  tax: number;
  paidAmount: number;
  remainingAmount: number;
  totalAmount: number;
  status: string;
}

export default function InvoiceSummary({
  basePrice,
  discount,
  tax,
  paidAmount,
  remainingAmount,
  totalAmount,
  status
}: InvoiceSummaryProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-gray-800 mb-4">الملخص المالي تلقائي الحساب</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-gray-600">
            <span>قيمة العقار</span>
            <span className="font-medium text-gray-800">{basePrice.toFixed(2)} ج.م</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>الخصومات</span>
            <span className="font-medium text-red-400">− {discount.toFixed(2)} ج.م</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>الضرائب / الرسوم إضافية</span>
            <span className="font-medium text-gray-800">+ {tax.toFixed(2)} ج.م</span>
          </div>
          <div className="border-t my-2"></div>
          <div className="flex justify-between items-center text-gray-600">
            <span>المدفوع المتوقع</span>
            <span className="font-medium text-green-600">− {paidAmount.toFixed(2)} ج.م</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>المتبقي التقريبي</span>
            <span className="font-medium text-red-500 font-bold">{remainingAmount.toFixed(2)} ج.م</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>وضع السداد</span>
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
              {status}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="font-bold text-gray-800">إجمالي القيمة المدخلة</span>
        <span className="text-2xl font-bold text-green-600">{totalAmount.toFixed(2)} ج.م</span>
      </div>
    </div>
  );
}