"use client";

import React from "react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { IInvoice } from "../../interfaces/invoice"
import { getColumns } from "./columdtata";

interface InvoiceTableProps {
  data: IInvoice[];
  onDelete :()=> void
}

export default function InvoiceTable({ data,onDelete }: InvoiceTableProps) {
  const columns = getColumns(onDelete);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full bg-white rounded-b-xl border-x border-b border-gray-100 overflow-hidden shadow-sm" dir="rtl">
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead className="bg-gray-50/70 border-b border-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-4 text-xs font-bold text-gray-500 tracking-wide">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-50 hover:bg-slate-50/40 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}