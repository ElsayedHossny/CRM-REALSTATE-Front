"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Property } from "@/types/properites";
import Cookies from "js-cookie";
import {
  ArrowRight,
  Image as ImageIcon,
  Loader2,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
// استدعاء السيرفيس اللي بتجيب الكاتجوريز الحية من الباك إند
import { getAllCategories } from "@/services/category.service";

const NUMERIC_FIELDS = ["price"] as const;
type NumericField = (typeof NUMERIC_FIELDS)[number];

type ToastState = { type: "success" | "error"; message: string } | null;
type Category = {
  _id: string;
  name: string;
  slug: string;
  filiters?: { filterName: string; options: string[] }[];
};

function getToken() {
  return Cookies.get("admin_token");
}

// دالة تحديث البيانات الأساسية كـ FormData
async function updatePropertyData(
  id: string,
  formDataToSend: FormData,
): Promise<void> {
  const res = await fetch(
    `https://back-end-crm-project.vercel.app/api/properties/${id}`,
    {
      method: "PATCH",
      headers: {
        ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
      },
      body: formDataToSend,
    },
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "فشل تحديث بيانات العقار");
  }
}

async function addPropertyImage(id: string, imageFile: File): Promise<void> {
  const fd = new FormData();
  fd.append("images", imageFile);
  const res = await fetch(
    `https://back-end-crm-project.vercel.app/api/properties/${id}/images`,
    {
      method: "POST",
      headers: {
        ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
      },
      body: fd,
    },
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "فشل رفع الصورة");
  }
}

function validateForm(data: Property): string | null {
  if (!data.title?.trim()) return "عنوان العقار مطلوب";
  if (!data.location?.trim()) return "موقع العقار مطلوب";
  if (!data.type) return "نوع العقار مطلوب";
  if (!data.bookType) return "نوع الحجز مطلوب";
  if (!data.price || Number(data.price) <= 0)
    return "السعر يجب أن يكون أكبر من صفر";
  return null;
}

function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;
  const isSuccess = toast.type === "success";
  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all animate-in fade-in slide-in-from-top-2 ${
        isSuccess ? "bg-green-700 text-white" : "bg-red-600 text-white"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="w-4 h-4 shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 shrink-0" />
      )}
      <span>{toast.message}</span>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-700">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all";

export default function PropertyForm({ property }: { property: Property }) {
  const [formData, setFormData] = useState<Property>({
    ...property,
    price: property.price ?? 0,
    title: property.title || "",
    location: property.location || "",
    description: property.description || "",
    type: property.type || "",
    bookType: property.bookType || "",
  });

  const [dynamicFilterValues, setDynamicFilterValues] = useState<
    Record<string, string>
  >(() => {
    const initial: Record<string, string> = {};
    // بنلف على الـ features اللي جاية مع العقار ونحطها في الـ state
    property.features?.forEach((f) => {
      initial[f.filterName] = f.value;
    });
    return initial;
  });
  // 🌐 الدولاب الخاص بالداتا الديناميكية المستدعاة
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryData, setSelectedCategoryData] =
    useState<Category | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    property.images?.length > 0 && property.images[0].trim() !== ""
      ? property.images[0]
      : null,
  );

  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const router = useRouter();

  // ── 🌐 جلب الـ Categories حية بالكامل من السيرفر وتعبئة قيم العقار الحالي ──
  // استبدل الـ useEffect الخاص بـ initForm بهذا الكود:
  useEffect(() => {
    const initForm = async () => {
      setIsLoadingCategories(true);
      try {
        const allCats = await getAllCategories();
        const liveCats = Array.isArray(allCats) ? allCats : allCats.data;
        setCategories(liveCats);

        // البحث عن الكاتجوري المناسبة للعقار الحالي
        const currentCat = liveCats.find(
          (c: Category) => c.slug === property.type,
        );

        if (currentCat) {
          setSelectedCategoryData(currentCat);
        }
      } catch (err) {
        console.error("فشل في جلب التصنيفات:", err);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    initForm();
  }, []); // مصفوفة فارغة ليعمل مرة واحدة عند التحميل
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => {
        const updated = {
          ...prev,
          [name]: NUMERIC_FIELDS.includes(name as NumericField)
            ? value === ""
              ? ""
              : Number(value)
            : value,
        };

        // لو النوع اتغير، بنحدث الفلاتر المعروضة فوراً وبنصفر القيم لتفادي التداخل
        if (name === "type") {
          const matchedCat =
            categories.find((cat) => cat.slug === value) || null;
          setSelectedCategoryData(matchedCat);
          setDynamicFilterValues({});
        }

        return updated;
      });
    },
    [categories],
  );

  const handleDynamicFilterChange = (filterName: string, value: string) => {
    setDynamicFilterValues((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    },
    [imagePreview],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm(formData);
    if (validationError) {
      setToast({ type: "error", message: validationError });
      return;
    }

    const selectedCategory = categories.find(
      (cat) => cat.slug === formData.type,
    );
    if (!selectedCategory) {
      setToast({ type: "error", message: "برجاء اختيار نوع العقار" });
      return;
    }

    setIsSaving(true);

    try {
      // تجميع الفلاتر الديناميكية المعدلة داخل الـ features حياً
      const features: { filterName: string; value: string }[] = [];
      Object.entries(dynamicFilterValues).forEach(([filterName, value]) => {
        if (value) {
          features.push({ filterName, value });
        }
      });

      const dataToSend = new FormData();
      dataToSend.append("title", formData.title?.trim() || "");
      dataToSend.append("location", formData.location?.trim() || "");
      dataToSend.append("region", formData.location?.trim() || "");
      dataToSend.append("price", String(formData.price));
      dataToSend.append("type", formData.type || "");
      dataToSend.append("category", selectedCategory._id);
      dataToSend.append("bookType", formData.bookType || "");
      dataToSend.append("description", formData.description?.trim() || "");
      dataToSend.append("features", JSON.stringify(features)); // ضغط الفلاتر الديناميكية كـ JSON string

      await updatePropertyData(formData._id, dataToSend);

      if (imageFile) {
        await addPropertyImage(formData._id, imageFile);
      }

      setToast({ type: "success", message: "تم تحديث بيانات العقار بنجاح 🎉" });

      setTimeout(() => {
        window.location.href = "/products";
      }, 1500);
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "حدث خطأ غير متوقع",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <form
        onSubmit={handleSubmit}
        className="w-full mt-4 p-6 md:p-8 space-y-6 bg-white border border-slate-100 rounded-2xl shadow-sm"
        dir="rtl"
        noValidate
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              تعديل بيانات العقار
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              الحقول المعلمة بـ <span className="text-red-500">*</span> إلزامية
            </p>
          </div>
          <Link
            href="/products"
            className="px-3 py-2 hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowRight className="w-4 h-4" />
            <span>إلغاء والرجوع</span>
          </Link>
        </div>

        {/* Row 1: Title & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="عنوان العقار" required>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="مثال: شقة فاخرة في القاهرة الجديدة"
              className={inputClass}
            />
          </Field>
          <Field label="الموقع" required>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="مثال: التجمع الخامس، القاهرة"
              className={inputClass}
            />
          </Field>
        </div>

        {/* Row 2: Type & BookType */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="نوع العقار" required>
            <div className="relative">
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={isLoadingCategories}
                className={`${inputClass} cursor-pointer disabled:opacity-60`}
              >
                <option value="">
                  {isLoadingCategories
                    ? "جاري جلب الأنواع من السيرفر..."
                    : "اختر النوع..."}
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {isLoadingCategories && (
                <Loader2 className="w-4 h-4 animate-spin absolute left-3 top-3.5 text-slate-400" />
              )}
            </div>
          </Field>
          <Field label="نوع الإعلان" required>
            <select
              name="bookType"
              value={formData.bookType}
              onChange={handleChange}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="">اختر النوع...</option>
              <option value="sale">للبيع</option>
              <option value="rent">للإيجار</option>
            </select>
          </Field>
        </div>

        {/* ── 🌟 الفلاتر الديناميكية المسحوبة حياً من السيرفر ── */}
        {!isLoadingCategories &&
          selectedCategoryData &&
          selectedCategoryData.filiters &&
          selectedCategoryData.filiters.length > 0 && (
            <div className="p-4 bg-slate-50/80 border border-dashed border-slate-200 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-green-700">
                المواصفات والفلاتر الديناميكية الخاصة بـ (
                {selectedCategoryData.name})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {selectedCategoryData?.filiters?.map((filter, index) => (
                  <Field key={index} label={filter.filterName}>
                    <select
                      // نستخدم OR مع قيمة فارغة لمنع ظهور 0 أو undefined
                      value={dynamicFilterValues[filter.filterName] || ""}
                      onChange={(e) =>
                        handleDynamicFilterChange(
                          filter.filterName,
                          e.target.value,
                        )
                      }
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="">اختر {filter.filterName}...</option>
                      {filter.options.map((opt, optIdx) => (
                        <option key={optIdx} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </Field>
                ))}
              </div>
            </div>
          )}

        {/* السعر الثابت */}
        <div className="w-full">
          <Field label="السعر المعدل (ج.م)" required>
            <input
              name="price"
              type="number"
              min={0}
              value={formData.price ?? ""}
              onChange={handleChange}
              placeholder="0"
              className={inputClass}
            />
          </Field>
        </div>

        {/* Image Upload */}
        <Field label="تحديث صورة العقار">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
            <label className="sm:col-span-3 border-2 border-dashed border-slate-200 hover:border-green-600 bg-slate-50/50 hover:bg-white rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all h-28 text-center group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isSaving}
                className="hidden"
              />
              <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-green-600 transition-colors" />
              <span className="text-xs font-semibold text-slate-700">
                {imageFile ? imageFile.name : "اضغط لاستبدال الصورة الحالية"}
              </span>
              <span className="text-[10px] text-slate-400">
                اتركها فارغة إذا لم ترغب في التغيير
              </span>
            </label>
            <div className="border border-slate-100 bg-slate-50 rounded-xl h-28 overflow-hidden flex items-center justify-center shadow-inner">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="معاينة العقار"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-300 w-full h-full bg-slate-100 justify-center">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-[10px] text-slate-400 font-medium">
                    لا توجد صورة
                  </span>
                </div>
              )}
            </div>
          </div>
        </Field>

        {/* Description */}
        <Field label="الوصف والملاحظات">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="أضف تفاصيل إضافية عن العقار..."
            rows={4}
            className={`${inputClass} resize-none`}
          />
        </Field>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto sm:min-w-[180px] px-6 h-12 bg-green-700 hover:bg-green-800 active:scale-[0.98] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <span>حفظ وتحديث البيانات</span>
            )}
          </button>
        </div>
      </form>
    </>
  );
}
