import Cookies from "js-cookie";
import { ColumnDef } from "@tanstack/react-table";
import {  IPayment } from "@/interfaces/payment";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

function PaymentActions({
  payment,
}: {
  payment: IPayment;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => router.push(`/payments/${payment._id}`)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
      >
        <Eye size={16} />
      </button>
    </div>
  );
}
export const getColumns = (): ColumnDef<IPayment>[] => [
 {
  accessorKey: "_id",
  header: "رقم العملية",
  cell: ({ row }) => (
    <span className="font-medium text-blue-600">
      #{row.original._id.slice(-6)}
    </span>
  ),
},
{
  id: "customer",
  header: "العميل",
  cell: ({ row }) => {
    const name =
      row.original.customer_id?.user_id?.name ||
      "غير معروف";

    return (
      <span className="font-medium">
        {name}
      </span>
    );
  },
},
{
  id: "property",
  header: "العقار",
  cell: ({ row }) => (
    <span>
      {row.original.property_id?.title || "---"}
    </span>
  ),
},
{
  accessorKey: "amount",
  header: "المبلغ",
  cell: ({ row }) => (
    <span className="font-bold text-green-600">
      {row.original.amount.toLocaleString()} ج.م
    </span>
  ),
},
{
  accessorKey: "paymentMethod",
  header: "طريقة الدفع",
  cell: ({ row }) => (
    <span
      className={`px-3 py-1 rounded-full text-xs ${
        row.original.paymentMethod === "STRIPE"
          ? "bg-purple-50 text-purple-600"
          : "bg-blue-50 text-blue-600"
      }`}
    >
      {row.original.paymentMethod}
    </span>
  ),
},
{
  accessorKey: "status",
  header: "الحالة",
  cell: ({ row }) => {
    const status = row.original.status;

    const styles = {
      SUCCESS: "bg-green-50 text-green-600",
      PENDING: "bg-orange-50 text-orange-600",
      FAILED: "bg-red-50 text-red-600",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs ${styles[status]}`}
      >
        {status}
      </span>
    );
  },
},
// {
//   accessorKey: "transactionId",
//   header: "Stripe ID",
//   cell: ({ row }) => (
//     <span className="text-xs text-gray-500">
//       {row.original.transactionId || "---"}
//     </span>
//   ),
// },
{
  accessorKey: "paidAt",
  header: "تاريخ الدفع",
  cell: ({ row }) => (
    <span>
      {new Date(row.original.paidAt).toLocaleDateString("ar-EG")}
    </span>
  ),
},

 {
    id: "actions",
    header: "إجراءات",
    cell: ({ row }) => (
      <PaymentActions payment={row.original} />
    ),
  },
];