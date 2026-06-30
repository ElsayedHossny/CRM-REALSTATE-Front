"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Trash2, Pencil, Eye } from "lucide-react";
import { IInvoice } from "@/interfaces/invoice";
import { deleteInvoice } from "@/services/invoice";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// ✅ Component منفصل عشان نستخدم useRouter
function InvoiceActions({ invoice, onDelete }: { invoice: IInvoice; onDelete: () => void }) {
  const router = useRouter();

  const handleView = () => {
    router.push(`/invoices/${invoice._id}`);
  };

  const handleEdit = () => {
    router.push(`/invoices/newinvoices?editId=${invoice._id}`);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(`هل أنت متأكد من حذف الفاتورة ${invoice.invoiceNumber}؟`);
    if (!confirmed) return;

    try {
      const token = Cookies.get("admin_token");
      if (!token) return alert("جلسة غير صالحة");

      await deleteInvoice(invoice._id, token);
      alert("تم حذف الفاتورة بنجاح ✅");
      onDelete();
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء الحذف ❌");
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleView}
        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
        title="عرض"
      >
        <Eye size={16} />
      </button>
      <button
        onClick={handleEdit}
        className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors cursor-pointer"
        title="تعديل"
      >
        <Pencil size={16} />
      </button>
      <button
        onClick={handleDelete}
        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        title="حذف"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

// ✅ getColumns بتاخد onDelete عشان تعمل refresh بعد الحذف
export const getColumns = (onDelete: () => void): ColumnDef<IInvoice>[] => [
  {
    accessorKey: "invoiceNumber",
    header: "رقم الفاتورة",
    cell: ({ row }) => (
      <span className="font-bold text-green-600">
        {row.getValue("invoiceNumber") || "---"}
      </span>
    ),
  },
{
  id: "customerName",
  header: "العميل",
  cell: ({ row }) => {
    const invoice = row.original;

    const name =
      invoice.customer_id?.user_id?.name || "عميل غير معرف";

    const firstLetter = name.charAt(0);

    return (
      <div className="flex items-center gap-2">
        <span className="w-7 h-7 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">
          {firstLetter}
        </span>

        <span className="text-gray-700 font-medium">
          {name}
        </span>
      </div>
    );
  },
},
  {
    accessorKey: "totalAmount",
    header: "الإجمالي",
    cell: ({ row }) => {
      const total = Number(row.getValue("totalAmount")) || 0;
      return <span className="font-medium text-gray-800">{total.toLocaleString()} ج.م</span>;
    },
  },
  {
    accessorKey: "paidAmount",
    header: "المدفوع",
    cell: ({ row }) => {
      const paid = Number(row.getValue("paidAmount")) || 0;
      return <span className="font-medium text-green-600">{paid.toLocaleString()} ج.م</span>;
    },
  },
  {
    accessorKey: "remainingAmount",
    header: "المتبقي",
    cell: ({ row }) => {
      const remaining = Number(row.getValue("remainingAmount")) || 0;
      return <span className="font-medium text-red-500">{remaining.toLocaleString()} ج.م</span>;
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = (row.getValue("status") as string || "").toUpperCase();
      const config: Record<string, { label: string; css: string }> = {
        PAID:    { label: "مدفوعة",      css: "bg-green-50 text-green-600 border border-green-100" },
        PARTIAL: { label: "جزئية",       css: "bg-orange-50 text-orange-600 border border-orange-100" },
        UNPAID:  { label: "غير مدفوعة", css: "bg-red-50 text-red-600 border border-red-100" },
        OVERDUE: { label: "متأخرة",      css: "bg-red-50 text-red-600 border border-red-100" },
      };
      const current = config[status] || { label: status || "غير محدد", css: "bg-gray-50 text-gray-600 border border-gray-100" };
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${current.css}`}>
          {current.label}
        </span>
      );
    },
  },
  {
    accessorKey: "paymentType",
    header: "نوع الدفع",
    cell: ({ row }) => {
      const type = row.getValue("paymentType") as string;
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          type === "CASH"
            ? "bg-blue-50 text-blue-600 border border-blue-100"
            : "bg-purple-50 text-purple-600 border border-purple-100"
        }`}>
          {type === "CASH" ? "كاش" : "تقسيط"}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ الإنشاء",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <span className="text-gray-500 text-xs">{date.toLocaleDateString("ar-EG")}</span>;
    },
  },
  {
    id: "actions",
    header: "إجراءات",
    cell: ({ row }) => (
      <InvoiceActions invoice={row.original} onDelete={onDelete} />
    ),
  },
];