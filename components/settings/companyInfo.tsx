"use client"
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { getSettings, updatedCompantInfo } from '@/services/settings'

export default function CompanyInfo() {

  const [formData, setFormData] = useState({
    companyName: "",
    taxNumber: "",
    commercialRegister: "",
    mainActivity: "",
    email: "",
    phoneNumber: "",
    address: "",
    logoUrl: ""
  });

  const [isEditing, setIsEditing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const token = Cookies.get("admin_token") || ""

  useEffect(() => {
    const fetchData = async () => {
      if (!token) { setIsLoading(false); return; }
      try {
        const result = await getSettings(token)
        console.log(result)
        if (result && result.companyName) {
          setFormData({
            companyName: result.companyName || "",
            taxNumber: result.taxNumber || "",
            commercialRegister: result.commercialRegister || "",
            mainActivity: result.mainActivity || "",
            email: result.email || "",
            phoneNumber: result.phoneNumber || "",
            address: result.address || "",
            logoUrl: result.logoUrl || ""
          })
        }
      } catch (error) {
        console.error("فشل تحميل البيانات", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true)
    setSuccessMsg("")
    setErrorMsg("")
    try {
      const form = new FormData()
      form.append("companyName", formData.companyName)
      form.append("taxNumber", formData.taxNumber)
      form.append("commercialRegister", formData.commercialRegister)
      form.append("mainActivity", formData.mainActivity)
      form.append("email", formData.email)
      form.append("phoneNumber", formData.phoneNumber)
      form.append("address", formData.address)
      if (selectedFile) form.append("logo", selectedFile)

      await updatedCompantInfo(token, form)
      setSuccessMsg("تم حفظ الإعدادات بنجاح ✓")
      setIsEditing(false)
    } catch (error) {
      setErrorMsg("حدث خطأ أثناء الحفظ، حاول مرة أخرى")
    } finally {
      setIsSaving(false)
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {/* التبويبات */}
      <div className="bg-white rounded-xl border border-gray-100 p-2 mb-6 shadow-sm overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-2 md:gap-6 text-sm text-gray-500 min-w-max px-2">
          <button className="flex items-center gap-2 py-2 px-4 bg-blue-50 text-blue-600 rounded-lg font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>بيانات الشركة
          </button>
          <button className="flex items-center gap-2 py-2 px-4 hover:text-gray-800 transition-colors">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>الفواتير
          </button>
          <button className="flex items-center gap-2 py-2 px-4 hover:text-gray-800 transition-colors">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>الإشعارات
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 md:p-8 shadow-sm max-w-7xl">

        {/* ✅ Header مع زر التعديل */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-[#1e293b]">بيانات الشركة</h2>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              تعديل
            </button>
          )}
        </div>

        {successMsg && (
          <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-right">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-right">
            {errorMsg}
          </div>
        )}

        {/* ✅ VIEW MODE */}
        {!isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "اسم الشركة", value: formData.companyName },
                { label: "الرقم الضريبي", value: formData.taxNumber },
                { label: "السجل التجاري", value: formData.commercialRegister },
                { label: "النشاط الرئيسي", value: formData.mainActivity },
                { label: "البريد الإلكتروني", value: formData.email },
                { label: "رقم الهاتف", value: formData.phoneNumber },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400 font-medium">{label}</span>
                  <span className="px-4 py-3 bg-[#f3f4f6]/50 border border-gray-200 rounded-xl text-gray-800 text-right">
                    {value || "—"}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-medium">العنوان</span>
              <span className="px-4 py-3 bg-[#f3f4f6]/50 border border-gray-200 rounded-xl text-gray-800 text-right">
                {formData.address || "—"}
              </span>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <span className="text-xs text-gray-400 font-medium">شعار الشركة</span>
              <div className="w-20 h-20 bg-[#f3f4f6] rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="logo" className="w-full h-full object-contain" />
                ) : (
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
              </div>
            </div>
          </div>

        ) : (

          // ✅ EDIT MODE
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">اسم الشركة</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange}
                  placeholder="مثال: لوب تك"
                  className="w-full px-4 py-3 bg-[#f3f4f6]/50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-right" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">الرقم الضريبي</label>
                <input type="text" name="taxNumber" value={formData.taxNumber} onChange={handleChange}
                  placeholder="الرقم الضريبي"
                  className="w-full px-4 py-3 bg-[#f3f4f6]/50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-right" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">السجل التجاري</label>
                <input type="text" name="commercialRegister" value={formData.commercialRegister} onChange={handleChange}
                  placeholder="رقم السجل التجاري"
                  className="w-full px-4 py-3 bg-[#f3f4f6]/50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-right" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">النشاط الرئيسي</label>
                <input type="text" name="mainActivity" value={formData.mainActivity} onChange={handleChange}
                  placeholder="مثال: حلول تقنية"
                  className="w-full px-4 py-3 bg-[#f3f4f6]/50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-right" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">البريد الإلكتروني</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="info@company.com" dir="ltr"
                  className="w-full px-4 py-3 bg-[#f3f4f6]/50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-right" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">رقم الهاتف</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                  placeholder="+966 50 123 4567" dir="ltr"
                  className="w-full px-4 py-3 bg-[#f3f4f6]/50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-right" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">العنوان</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange}
                placeholder="الرياض - حي العليا - شارع الملك فهد"
                className="w-full px-4 py-3 bg-[#f3f4f6]/50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-right" />
            </div>

            <div className="flex flex-col gap-2 pt-4">
              <label className="text-sm font-semibold text-gray-700">شعار الشركة</label>
              <div className="flex items-center gap-4 mt-1">
                <div className="w-16 h-16 bg-[#f3f4f6] rounded-xl flex items-center justify-center border border-gray-200 overflow-hidden">
                  {previewUrl || formData.logoUrl ? (
                    <img src={previewUrl || formData.logoUrl} alt="logo" className="w-full h-full object-contain" />
                  ) : (
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <input type="file" id="logoUpload" accept="image/*" className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)) }
                    }} />
                  <label htmlFor="logoUpload"
                    className="px-4 py-2 bg-[#f3f4f6] text-gray-700 font-semibold text-sm rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer text-center">
                    رفع الشعار
                  </label>
                  <span className="text-xs text-gray-400">الأبعاد المفضلة: 200x200 بكسل</span>
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center gap-3">
              <button type="submit" disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-xl shadow-md shadow-blue-200 transition-all">
                {isSaving ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />جاري الحفظ...</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>حفظ الإعدادات</>
                )}
              </button>

              <button type="button"
                onClick={() => { setIsEditing(false); setPreviewUrl(""); setSelectedFile(null) }}
                className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors">
                إلغاء
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}