"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Download,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import PaymentTable from "@/components/payments/paymentTable";
import { usePayments } from "../../(context)/payment";

export default function PaymentList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");

  const { payments, loading, fetchPayments } = usePayments();

  const overdueStatuses = ["SUCCESS", "FAILED", "PENDING"] as const;

  const statuses = [
    { label: "الكل", value: "all", count: payments.length },
    {
      label: "ناجحة",
      value: "SUCCESS",
      count: payments.filter((p) => p.status === "SUCCESS").length,
    },
    {
      label: "معلقة",
      value: "PENDING",
      count: payments.filter((p) => p.status === "PENDING").length,
    },
    {
      label: "فاشلة",
      value: "FAILED",
      count: payments.filter((p) => p.status === "FAILED").length,
    },
  ];

  const filteredPAyment = payments.filter((payment) => {
    const matchesStatus =
      activeStatus === "all" || payment.status === activeStatus;

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      payment.transactionId?.toLowerCase().includes(query) ||
      payment._id?.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
        <span className="mr-3 text-gray-600 font-medium">
          جاري جلب فواتير الـ CRM...
        </span>
      </div>
    );
  }
  return (
    <div dir="rtl" className="p-6 bg-slate-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">المدفوعات</h1>
          <p className="text-gray-500">إدارة وتتبع جميع فواتير المدفوعات </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="إجمالي المدفوعات"
          value={payments.length.toString()}
          icon={<FileText className="text-blue-500" />}
        />

        <StatCard
          title="ناجحه"
          value={
            statuses.find((s) => s.value === "PAID")?.count.toString() || "0"
          }
          icon={<CheckCircle2 className="text-green-500" />}
          color="bg-green-50"
        />

        <StatCard
          title="معلقة"
          value={
            statuses.find((s) => s.value === "PARTIAL")?.count.toString() || "0"
          }
          icon={<Clock className="text-orange-500" />}
          color="bg-orange-50"
        />

        <StatCard
          title="فاشلة"
          value={
            statuses.find((s) => s.value === "OVERDUE")?.count.toString() || "0"
          }
          icon={<AlertCircle className="text-red-500" />}
          color="bg-red-50"
        />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-t-xl border-x border-t border-gray-100">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex border-b md:border-none overflow-x-auto">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => setActiveStatus(status.value)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                  status.value === activeStatus
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {status.label}
                <span className="mr-1 text-xs bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-500">
                  {status.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative group">
              <Search
                className="absolute right-3 top-2.5 text-gray-400 group-focus-within:text-green-600 transition-colors"
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث برقم الفاتورة أو العميل..."
                className="pr-10 pl-4 py-2 border rounded-lg outline-none focus:border-green-600 w-64 text-sm"
              />
            </div>

            <button className="p-2 border rounded-lg hover:bg-gray-50 text-gray-600 flex items-center gap-2 cursor-pointer">
              <Download size={18} />
              <span className="hidden md:inline text-sm">تصدير</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-xl shadow-sm">
        {filteredPAyment.length > 0 ? (
          <PaymentTable data={filteredPAyment} onDelete={fetchPayments} />
        ) : (
          <div className="min-h-[300px] flex flex-col items-center justify-center text-gray-400 p-8 border-x border-b border-gray-100 rounded-b-xl">
            <div className="p-6 border-2 border-dashed border-gray-100 rounded-full mb-4">
              <FileText size={40} className="opacity-20" />
            </div>
            <p className="text-sm">لا توجد فواتير تطابق خيارات البحث الحالية</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* Stat Card */
function StatCard({
  title,
  value,
  icon,
  color = "bg-white",
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
}) {
  return (
    <div
      className={`${color} p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between`}
    >
      <div>
        <p className="text-gray-500 text-sm mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className="p-3 bg-white rounded-lg shadow-inner">{icon}</div>
    </div>
  );
}