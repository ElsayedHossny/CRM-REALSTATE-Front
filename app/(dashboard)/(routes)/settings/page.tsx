"use client";

import CompanyInfo from "@/components/settings/companyInfo";
export default function CompanySettings() {
  // حاله حفظ البيانات (يمكنك ربطها بـ API لاحقاً)



  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 text-right" dir="rtl">
      {/* الشريط العلوي - الهيدر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">الإعدادات</h1>
          <p className="text-sm text-gray-500 mt-1">تحكم في إعدادات الحساب والنظام</p>
        </div>
        
        {/* أزرار التحكم العلوية */}
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            تصدير التقرير
          </button>
          
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-200 rounded-lg px-8 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 focus:outline-none">
              <option>اليوم</option>
              <option>الأسبوع</option>
              <option>الشهر</option>
            </select>
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

       <CompanyInfo/>
    </div>
  );
}