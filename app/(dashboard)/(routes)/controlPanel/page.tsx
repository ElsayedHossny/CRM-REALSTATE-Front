"use client";
import React from "react";
import { CiDollar } from "react-icons/ci";
import { FaArrowUp } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";
import { CiMoneyCheck1 } from "react-icons/ci";
import Linechart from "@/components/charts/Linechart";
import { AlertCircle, FileText, ShoppingBag } from "lucide-react";
import { useState } from "react";

const productsData = [
  { id: 1, name: "لابتوب Dell XPS 15", quantity: 95, price: "67,500 ر.س" },
  { id: 2, name: 'شاشة سامسونج 27"', quantity: 82, price: "41,000 ر.س" },
  { id: 3, name: "كيبورد ميكانيكي", quantity: 120, price: "24,000 ر.س" },
  { id: 4, name: "ماوس Logitech MX", quantity: 95, price: "19,000 ر.س" },
  { id: 5, name: "سماعات Sony WH-1000", quantity: 60, price: "18,000 ر.س" },
];

export default function Dashboardpage() {
  const [activeTab, setActiveTab] = useState("day");

  return (
    <div className="w-full min-h-screen p-2" dir="rtl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-5">
        <div className="w-full lg:w-[80%]">
          <h1 className="font-bold text-2xl">لوحة التحكم</h1>
          <p>مرحباً السيد، إليك ملخص أعمالك اليوم</p>
        </div>

        <div className="w-full lg:w-auto bg-white flex justify-between items-center p-3 rounded-2xl gap-2 text-sm cursor-pointer select-none">
          <h3
            onClick={() => setActiveTab("day")}
            className={`px-3 py-1 rounded-xl transition-all duration-200 ${
              activeTab === "day"
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            اليوم
          </h3>

          <h3
            onClick={() => setActiveTab("week")}
            className={`px-3 py-1 rounded-xl transition-all duration-200 ${
              activeTab === "week"
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            الأسبوع
          </h3>

          <h3
            onClick={() => setActiveTab("month")}
            className={`px-3 py-1 rounded-xl transition-all duration-200 ${
              activeTab === "month"
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            الشهر
          </h3>

          <h3
            onClick={() => setActiveTab("year")}
            className={`px-3 py-1 rounded-xl transition-all duration-200 ${
              activeTab === "year"
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            السنة
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="flex flex-col bg-white p-4 rounded-xl gap-4 hover:shadow-md transition">
          <div className="flex justify-between">
            <div className="text-4xl text-green-500 bg-green-200 p-2 rounded-2xl">
              <CiDollar />
            </div>
            <p className="text-green-400 flex items-center gap-1">
              <FaArrowUp /> %12.5
            </p>
          </div>
          <h3 className="text-slate-500">اجمالي المبيعات</h3>
          <p className="text-slate-800 font-bold">248,500 رس</p>
        </div>

        <div className="flex flex-col bg-white p-4 rounded-xl gap-4 hover:shadow-md transition">
          <div className="flex justify-between">
            <div className="text-4xl text-blue-500 bg-blue-100 p-2 rounded-2xl">
              <FaCartPlus />
            </div>
            <p className="text-blue-500 flex items-center gap-1">
              <FaArrowUp /> %5.2
            </p>
          </div>
          <h3 className="text-slate-500">اجمالي المشتريات</h3>
          <p className="text-slate-800 font-bold">112,300 رس</p>
        </div>

        <div className="flex flex-col bg-white p-4 rounded-xl gap-4 hover:shadow-md transition">
          <div className="flex justify-between">
            <div className="text-4xl text-amber-300 bg-amber-200 p-2 rounded-2xl">
              <FaChartLine />
            </div>
            <p className="text-amber-300 flex items-center gap-1">
              <FaArrowUp /> %18.3
            </p>
          </div>
          <h3 className="text-slate-500">صافي الارباح</h3>
          <p className="text-slate-800 font-bold">98.7 رس</p>
        </div>

        {/* المصروفات */}
        <div className="flex flex-col bg-white p-4 rounded-xl gap-4 hover:shadow-md transition">
          <div className="flex justify-between">
            <div className="text-4xl text-red-400 bg-red-200 p-2 rounded-2xl">
              <CiMoneyCheck1 />
            </div>
            <p className="text-red-400 flex items-center gap-1">
              <FaArrowUp /> %3.1
            </p>
          </div>
          <h3 className="text-slate-500">المصروفات</h3>
          <p className="text-slate-800 font-bold">37,500 رس</p>
        </div>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-6 mt-10">
        <div className="bg-white w-full lg:w-[60%] min-h-[400px] p-4 rounded-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="font-semibold">المبيعات والمشتريات الشهرية</p>
            <div className="flex gap-4">
              <div className="flex gap-2 items-center">
                <input type="radio" name="chart" id="purchases" />
                <label htmlFor="purchases">المشتريات</label>
              </div>
              <div className="flex gap-2 items-center">
                <input type="radio" name="chart" id="sales" />
                <label htmlFor="sales">المبيعات</label>
              </div>
            </div>
          </div>
          <div className="mt-4 h-[300px]">
            <Linechart />
          </div>
        </div>

        <div className="w-full lg:w-[40%] bg-white rounded-xl p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">المستحقات</h3>
            <span className="text-2xl">
              <CiDollar />
            </span>
          </div>

          <div className="w-full bg-green-100 text-green-700 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <h3>مستحقات العملاء</h3>
              <p className="bg-green-200 rounded-2xl px-3 py-1 text-center">
                18 عميل
              </p>
            </div>
            <p className="text-2xl font-bold mt-4">45,200</p>
            <button className="bg-green-200 px-4 py-2 rounded-xl mt-4 hover:bg-green-300 transition">
              عرض التفاصيل
            </button>
          </div>

          <div className="w-full bg-red-100 text-red-700 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <h3>مستحقات الموردين</h3>
              <p className="bg-red-200 rounded-2xl px-3 py-1 text-center">
                7 مورد
              </p>
            </div>
            <p className="text-2xl font-bold mt-4">22,200</p>
            <button className="bg-red-200 px-4 py-2 rounded-xl mt-4 hover:bg-red-300 transition">
              عرض التفاصيل
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-slate-700 font-semibold">
              أعلى المنتجات مبيعًا
            </h4>
            <button className="text-green-500 hover:text-green-600">
              عرض الكل
            </button>
          </div>

          <div className="space-y-5">
            {productsData.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between"
              >
                <div className="bg-slate-100 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-slate-600">
                  {product.id}
                </div>
                <div className="flex-1 mr-4">
                  <h3 className="font-medium text-slate-700">{product.name}</h3>
                  <p className="text-sm text-slate-400">
                    {product.quantity} قطعة
                  </p>
                </div>
                <span className="font-semibold text-slate-700">
                  {product.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* التنبيهات */}
        <div className="bg-white rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-slate-700 font-semibold">التنبيهات</h4>
            <button className="text-green-500 hover:text-green-600">
              عرض الكل
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-yellow-500" />
                <p className="text-slate-700">12 منتج قارب على النفاد</p>
              </div>
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            </div>

            <div className="bg-yellow-50 border border-red-200 rounded-2xl p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-500" />
                <p className="text-slate-700">
                  5 منتجات تنتهي صلاحيتها خلال أسبوع
                </p>
              </div>
              <span className="w-3 h-3 rounded-full bg-red-400"></span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FileText className="text-slate-500" />
                <p className="text-slate-700">8 فواتير متأخرة السداد</p>
              </div>
              <span className="w-3 h-3 rounded-full bg-slate-400"></span>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-yellow-500" />
                <p className="text-slate-700">3 موردين لديهم مستحقات متأخرة</p>
              </div>
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
