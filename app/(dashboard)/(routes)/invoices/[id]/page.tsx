"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { getInvoiceById } from "@/services/invoice";
import { IInvoice } from "@/interfaces/invoice";
import {
  User,
  Building2,
  Wallet,
  CreditCard,
  CircleDollarSign,
} from "lucide-react";

export default function InvoiceDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [invoice, setInvoice] = useState<IInvoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = Cookies.get("admin_token");
        if (!token) return;

        const data = await getInvoiceById(id, token);
        setInvoice(data.data || data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-10 w-10 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-xl font-bold">
        الفاتورة غير موجودة
      </div>
    );
  }

  const statusColor = {
    PAID: "bg-green-100 text-green-700",
    PARTIAL: "bg-orange-100 text-orange-700",
    UNPAID: "bg-red-100 text-red-700",
    OVERDUE: "bg-red-100 text-red-700",
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              الفاتورة #{invoice.invoiceNumber}
            </h1>
            <p className="text-gray-500 mt-1">
              {new Date(invoice.createdAt).toLocaleDateString("ar-EG")}
            </p>
          </div>

          <span
            className={`px-5 py-2 rounded-full font-medium ${
              statusColor[invoice.status]
            }`}
          >
            {invoice.status}
          </span>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <User className="text-green-600" />
              <h2 className="font-bold text-lg">بيانات العميل</h2>
            </div>

            <div className="space-y-4 text-gray-700">
              <p>
                <span className="font-semibold">الاسم:</span>{" "}
                {invoice.customer_id?.user_id?.name }
              </p>

              <p>
                <span className="font-semibold">الملاحظات:</span>{" "}
                {invoice.customer_id?.notes || "-"}
              </p>
            </div>
          </div>

          {/* Property */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Building2 className="text-blue-600" />
              <h2 className="font-bold text-lg">بيانات العقار</h2>
            </div>

            <div className="space-y-4 text-gray-700">
              <p>
                <span className="font-semibold">العقار:</span>{" "}
                {invoice.property_id?.title}
              </p>

              <p>
                <span className="font-semibold">السعر:</span>{" "}
                {invoice.property_id?.price.toLocaleString()} ج.م
              </p>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Wallet className="text-purple-600" />
            <h2 className="font-bold text-lg">ملخص الفاتورة</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-5">
            <div className="bg-slate-50 rounded-xl p-5">
              <p className="text-gray-500">الإجمالي</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                {invoice.totalAmount.toLocaleString()} ج.م
              </h3>
            </div>

            <div className="bg-green-50 rounded-xl p-5">
              <p className="text-green-600">المدفوع</p>
              <h3 className="text-2xl font-bold text-green-700 mt-2">
                {invoice.paidAmount.toLocaleString()} ج.م
              </h3>
            </div>

            <div className="bg-red-50 rounded-xl p-5">
              <p className="text-red-600">المتبقي</p>
              <h3 className="text-2xl font-bold text-red-700 mt-2">
                {invoice.remainingAmount.toLocaleString()} ج.م
              </h3>
            </div>

            <div className="bg-blue-50 rounded-xl p-5">
              <p className="text-blue-600">نوع الدفع</p>
              <h3 className="text-xl font-bold text-blue-700 mt-2 flex items-center gap-2">
                <CreditCard size={20} />
                {invoice.paymentType === "CASH" ? "كاش" : "تقسيط"}
              </h3>
            </div>
          </div>
        </div>

        {/* Extra */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <CircleDollarSign className="text-yellow-600" />
            <h2 className="font-bold text-lg">تفاصيل إضافية</h2>
          </div>

          <div className="space-y-3 text-gray-700">
            <p>
              <span className="font-semibold">الخصم:</span>{" "}
              {invoice.discount} ج.م
            </p>

            <p>
              <span className="font-semibold">الضرائب:</span>{" "}
              {invoice.tax} ج.م
            </p>

            {invoice.months && (
              <p>
                <span className="font-semibold">عدد الأشهر:</span>{" "}
                {invoice.months}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}