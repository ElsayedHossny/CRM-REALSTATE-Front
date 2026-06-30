"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createInvoice,
  updateInvoice,
  getInvoiceById,
} from "@/services/invoice";
import CustomerSelect from "@/components/CustomerSelect";
import InvoiceSummary from "../invoiceSummary";
import Cookies from "js-cookie";
import PropertySelect from "@/components/properitySelect.tsx/propeirtySelect";
import InstallmentPlanSelect from "@/components/installmentPlanSelect/installmentPlanSelect";

export default function NewInvoice() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const isEditMode = !!editId;

  const [customerId, setCustomerId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [paymentType, setPaymentType] = useState<"CASH" | "INSTALLMENT">(
    "CASH",
  );
  const [installmentPlanId, setInstallmentPlanId] = useState("");
  const [basePrice, setBasePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [loadingData, setLoadingData] = useState(false);

  const totalAmount = basePrice - discount + tax;
  const simulatedPaid = paymentType === "CASH" ? totalAmount : 0;
  const simulatedRemaining = totalAmount - simulatedPaid;

  useEffect(() => {
    if (!editId) return;

    const loadInvoice = async () => {
      setLoadingData(true);
      try {
        const token = Cookies.get("admin_token");
        if (!token) return;

        const res = await getInvoiceById(editId, token);
        const invoice = res?.data || res;

        if (invoice) {
          setCustomerId(invoice.customer_id?._id || "");
          setPropertyId(invoice.property_id?._id || "");
          setPaymentType(invoice.paymentType || "CASH");
          setInstallmentPlanId(invoice.installmentPlan_id?._id || "");
          setBasePrice(invoice.basePrice || 0);
          setDiscount(invoice.discount || 0);
          setTax(invoice.tax || 0);
        }
      } catch (error) {
        console.error("Error loading invoice:", error);
        alert("حدث خطأ أثناء تحميل بيانات الفاتورة");
      } finally {
        setLoadingData(false);
      }
    };

    loadInvoice();
  }, [editId]);

  const handleSave = async () => {
    if (!customerId || !propertyId) {
      return alert("من فضلك اختر العميل وادخل معرف العقار معاً");
    }
    if (paymentType === "INSTALLMENT" && !installmentPlanId) {
      return alert("من فضلك ادخل معرف خطة التقسيط");
    }

    const token = Cookies.get("admin_token");
    if (!token) return alert("جلسة العمل غير صالحة، برجاء تسجيل الدخول أولاً");

    const invoiceBody = {
      customer_id: customerId,
      property_id: propertyId,
      paymentType,
      installmentPlan_id:
        paymentType === "INSTALLMENT" ? installmentPlanId : null,
      basePrice,
      discount,
      tax,
    };

    try {
      if (isEditMode && editId) {
        // ✅ وضع تعديل
        await updateInvoice(editId, invoiceBody, token);
        alert("تم تحديث الفاتورة بنجاح ✅");
      } else {
        // ✅ وضع إنشاء
        await createInvoice(invoiceBody, token);
        alert("تم إنشاء الفاتورة بنجاح 🎉");
      }
      window.location.href = "/invoices";
    } catch (error: unknown) {
      console.error("Error saving invoice:", error);
      const message =
        error instanceof Error ? error.message : "يرجى المحاولة مرة أخرى";
      alert(`حدث خطأ أثناء الحفظ: ${message}`);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
        <span className="mr-3 text-gray-600 font-medium">
          جاري تحميل بيانات الفاتورة...
        </span>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-sm"
    >
      <div className="mb-6">
        {/* ✅ العنوان بيتغير حسب الوضع */}
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditMode ? "تعديل الفاتورة" : "فاتورة عقارية جديدة"}
        </h2>
        <p className="text-gray-500 mt-1">
          {isEditMode
            ? "تعديل بيانات الفاتورة الموجودة"
            : "إنشاء فاتورة مبيعات لعقار محدد وتوليد الأقساط"}
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-5xl">
        {/* القسم الأول: الأطراف */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-green-500">🧾</span>
            <h3 className="font-semibold text-gray-800">
              أطراف العقد والبيانات الأساسية
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CustomerSelect value={customerId} onChange={setCustomerId} />

            <PropertySelect value={propertyId} onChange={setPropertyId} />

            <div>
              <label className="block text-gray-600 mb-1">نظام السداد</label>
              <select
                value={paymentType}
                onChange={(e) =>
                  setPaymentType(e.target.value as "CASH" | "INSTALLMENT")
                }
                className="w-full border border-gray-300 rounded-md p-2 outline-none focus:border-green-500 bg-white"
              >
                <option value="CASH">كاش / CASH</option>
                <option value="INSTALLMENT">تقسيط / INSTALLMENT</option>
              </select>
            </div>

            {paymentType === "INSTALLMENT" && (
              <InstallmentPlanSelect
                value={installmentPlanId}
                onChange={setInstallmentPlanId}
              />
            )}
          </div>
        </div>

        {/* القسم الثاني: الماليات */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">
              تفاصيل الدفعة المالية
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-1">
                  السعر الأساسي للعقار
                </label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) =>
                    setBasePrice(parseFloat(e.target.value) || 0)
                  }
                  className="w-full border border-gray-300 rounded-md p-2 outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">
                  الخصم الممنوح
                </label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-md p-2 outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">
                  الرسوم / الضرائب
                </label>
                <input
                  type="number"
                  value={tax}
                  onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-md p-2 outline-none focus:border-green-500"
                />
              </div>
            </div>
          </div>

          <InvoiceSummary
            basePrice={basePrice}
            discount={discount}
            tax={tax}
            paidAmount={simulatedPaid}
            remainingAmount={simulatedRemaining}
            totalAmount={totalAmount}
            status={paymentType === "CASH" ? "PAID" : "INSTALLMENT_MODE"}
          />
        </div>

        {/* أزرار التحكم */}
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors cursor-pointer"
          >
            {isEditMode ? "💾 حفظ التعديلات" : " حفظ وإرسال الفاتورة"}
          </button>
          <button
            onClick={() => router.back()}
            className="bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 px-6 py-2 rounded-md font-medium transition-colors cursor-pointer"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
