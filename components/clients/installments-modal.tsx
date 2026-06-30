"use client";

import { Client } from "@/interfaces/client.interface";
import { X } from "lucide-react";
import Cookies from "js-cookie";
import { useState } from "react";

interface InstallmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  onRefresh: () => void;
}

export default function InstallmentsModal({
  isOpen,
  onClose,
  client,
  onRefresh,
}: InstallmentsModalProps) {
  const [payingId, setPayingId] = useState<string | null>(null);

  if (!isOpen || !client) return null;

  const installments = client.installments || [];

  const handlePayInstallment = async (installmentId: string) => {
    setPayingId(installmentId);

    try {
      const token = Cookies.get("admin_token");

      // 1. جلب الفاتورة
      const invoiceRes = await fetch(
        `https://back-end-crm-project.vercel.app/api/invoice/customer/${client._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const invoiceData = await invoiceRes.json();

      const invoiceId = invoiceData?.data?._id;

      if (!invoiceId) {
        throw new Error("لم يتم العثور على الفاتورة");
      }

      // 2. إنشاء Stripe Checkout Session
      const checkoutRes = await fetch(
        "https://back-end-crm-project.vercel.app/api/payments/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            invoice_id: invoiceId,
            customer_id: client._id,
            installment_id: installmentId,
          }),
        },
      );

      const checkoutData = await checkoutRes.json();

      console.log("Stripe response:", checkoutData);

      const stripeUrl = checkoutData?.data?.url;

      if (!stripeUrl) {
        throw new Error("لم يتم إنشاء رابط الدفع");
      }

      // فتح Stripe
      // window.open(stripeUrl, "_blank");

      // تجهيز رقم الواتساب
      const phone = client.user_id?.phone?.replace(/\D/g, "");

      if (!phone) {
        throw new Error("رقم الهاتف غير موجود");
      }

      // الرسالة
      const message = `
مرحباً ${client.user_id?.name}

يمكنك سداد القسط من خلال الرابط التالي:

${stripeUrl}

شكراً لك.
`;

      const whatsappUrl = `https://wa.me/2${phone}?text=${encodeURIComponent(
        message,
      )}`;

      console.log("Phone:", phone);
      console.log("WhatsApp URL:", whatsappUrl);

      // فتح الواتساب
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء إنشاء رابط الدفع");
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {client.user_id?.name || "عميل غير معروف"} –{" "}
            {client.property_id?.title || "عقار غير محدد"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          {installments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              لا توجد أقساط مسجلة لهذا العقد
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-right text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">القسط</th>
                  <th className="pb-3 font-medium">المبلغ</th>
                  <th className="pb-3 font-medium">تاريخ الاستحقاق</th>
                  <th className="pb-3 font-medium">الحالة</th>
                  <th className="pb-3 font-medium">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {installments.map((installment, index) => {
                  const isPaid = installment.status === "PAID";
                  const isPaying = payingId === installment._id;

                  return (
                    <tr
                      key={installment._id}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="py-3 font-medium text-gray-800">
                        قسط رقم {index + 1}
                      </td>
                      <td className="py-3 text-gray-800">
                        {installment.amount.toLocaleString()} ج.م
                      </td>
                      <td className="py-3 text-gray-600">
                        {new Date(installment.dueDate).toLocaleDateString(
                          "ar-EG",
                        )}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                            isPaid
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {isPaid ? "مدفوع" : "غير مدفوع"}
                        </span>
                      </td>
                      <td className="py-3">
                        {!isPaid ? (
                          <button
                            onClick={() =>
                              handlePayInstallment(installment._id!)
                            }
                            disabled={isPaying}
                            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                          >
                            {isPaying ? "جاري التحصيل..." : "تحصيل القسط"}
                          </button>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
