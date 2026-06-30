"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", uv: 4000, pv: 2400 },
  { name: "Feb", uv: 3000, pv: 1398 },
  { name: "Mar", uv: 2000, pv: 9800 },
  { name: "Apr", uv: 2780, pv: 3908 },
  { name: "May", uv: 1890, pv: 4800 },
  { name: "Jun", uv: 2390, pv: 3800 },
  { name: "Jul", uv: 3490, pv: 4300 },
];

export default function Linechart() {
  return (
    <div className="w-full h-[350px] bg-white p-4 rounded-xl mt-5">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />
          <YAxis dx={-50} />

          <Tooltip />
          <Legend />

          <Line type="monotone" dataKey="pv" name="المبيعات" stroke="#22c55e" />
          <Line type="monotone" dataKey="uv"  name="المشتريات" stroke="#3b82f6" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}