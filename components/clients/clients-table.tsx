"use client";

import React from "react";
import {
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Client } from '@/interfaces/client.interface';

interface ClientsTableProps {
  data: Client[];
  onViewInstallments: (client: Client) => void;
}

export default function ClientsTable({
  data,
  onViewInstallments,
}: ClientsTableProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b text-sm font-medium text-muted-foreground">
              <th className="p-3">العميل</th>
              <th className="p-3">العقار</th>
              <th className="p-3">السعر الإجمالي</th>
              <th className="p-3">المقدم</th>
              <th className="p-3 text-center">الإجراءات</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center p-8 text-muted-foreground"
                >
                  لا توجد بيانات متاحة لعرضها.
                </td>
              </tr>
            ) : (
              data.map((client) => (
                <tr
                  key={client._id}
                  className="border-b hover:bg-muted/40 transition-colors"
                >
                  <td className="p-3 font-medium">
                    <div className="flex flex-col">
                      <span>{client.user_id?.name || "اسم غير معروف"}</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        {client.user_id?.email || "لا يوجد بريد إلكتروني"}
                      </span>
                    </div>
                  </td>

                  <td className="p-3 text-muted-foreground">
                    <div className="flex flex-col">
                      <span className="text-foreground font-medium">
                        {client.property_id?.title || "عقار غير محدد"}
                      </span>
                      <span className="text-xs">
                        السعر الأساسي: {client.property_id?.price?.toLocaleString() || 0} ج.م
                      </span>
                    </div>
                  </td>

                  <td className="p-3 font-semibold">
                    {client.totalPrice.toLocaleString()} ج.م
                  </td>

                  <td className="p-3">
                    {client.downPayment.toLocaleString()} ج.م
                  </td>

                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={onViewInstallments.bind(null, client)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md">
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>عرض {data.length} عملاء</span>

        <div className="flex gap-1">
          <button className="p-1 border rounded-md disabled:opacity-50">
            <ChevronRight className="h-4 w-4" />
          </button>

          <button className="p-1 border rounded-md disabled:opacity-50">
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}