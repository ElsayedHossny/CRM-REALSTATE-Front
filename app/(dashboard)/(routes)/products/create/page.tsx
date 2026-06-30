"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Property } from "@/types/properites";
import { Category } from "@/types/category";
import {
  ArrowRight,
  Image as ImageIcon,
  Loader2,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { getAllCategories } from "@/services/category.service";

// ─── Constants ────────────────────────────────────────────────────────────────

// 🌟 سيبنا الـ price بس كحقل رقمي ثابت
const NUMERIC_FIELDS = ["price"] as const;
type NumericField = (typeof NUMERIC_FIELDS)[number];

const EMPTY_FORM = {
  title: "",
  location: "",
  type: "", // بيخزن الـ slug بتاع الكاتجوري المختارة
  price: 0,
  bookType: "",
  description: "",
};

// ─── Service ──────────────────────────────────────────────────────────────────

async function createProperty(formData: FormData): Promise<void> {
  const token = Cookies.get("admin_token");

  const res = await fetch(
    "https://back-end-crm-project.vercel.app/api/properties/addproperity",
    {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "فشل إضافة العقار");
  }
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateForm(data: typeof EMPTY_FORM): string | null {
  if (!data.title.trim()) return "عنوان العقار مطلوب";
  if (!data.location.trim()) return "موقع العقار مطلوب";
  if (!data.type) return "نوع العقار مطلوب";
  if (!data.bookType) return "نوع الإعلان مطلوب";
  if (!data.price || data.price <= 0) return "السعر يجب أن يكون أكبر من صفر";
  return null;
}

// ─── Toast ────────────────────────────────────────────────────────────────────

type ToastState = { type: "success" | "error"; message: string } | null;

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
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold ${
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

// ─── Field ────────────────────────────────────────────────────────────────────

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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PropertyCreateForm() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryData, setSelectedCategoryData] =
    useState<Category | null>(null);
  const [dynamicFilterValues, setDynamicFilterValues] = useState<
    Record<string, string>
  >({});

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const router = useRouter();

  // جلب التصنيفات
  useEffect(() => {
    const fetchLiveCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const responseData = await getAllCategories();
        if (
          responseData &&
          responseData.success &&
          Array.isArray(responseData.data)
        ) {
          setCategories(responseData.data);
        } else if (Array.isArray(responseData)) {
          setCategories(responseData);
        }
      } catch (err) {
        console.error("فشل في جلب التصنيفات الحية لنموذج العقار:", err);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchLiveCategories();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
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
            ? Number(value)
            : value,
        };

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

      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }

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

    setIsSaving(true);

    try {
      const categoryValue = selectedCategoryData
        ? selectedCategoryData._id
        : "1";

      // 🌟 مصفوفة الـ features بقت بتعتمد كلياً على اللي جاي ديناميكياً من الباك إند
      const features: { filterName: string; value: string }[] = [];

      // سحب أي فلتر تم اختياره وضخه داخل المصفوفة فوراً
      Object.entries(dynamicFilterValues).forEach(([filterName, value]) => {
        if (value) {
          features.push({ filterName, value });
        }
      });

      const dataToSend = new FormData();
      dataToSend.append("title", formData.title.trim());
      dataToSend.append("location", formData.location.trim());
      dataToSend.append("region", formData.location.trim());
      dataToSend.append("type", formData.type);
      dataToSend.append("price", String(formData.price));
      dataToSend.append("bookType", formData.bookType);
      dataToSend.append("description", formData.description.trim());
      dataToSend.append("category", categoryValue);
      dataToSend.append("features", JSON.stringify(features));

      if (imageFile) {
        dataToSend.append("images", imageFile);
      }

      await createProperty(dataToSend);

      setToast({ type: "success", message: "تم إضافة العقار بنجاح 🎉" });
      setFormData(EMPTY_FORM);
      setSelectedCategoryData(null);
      setDynamicFilterValues({});
      setImageFile(null);
      setImagePreview(null);

      setTimeout(() => {
        router.push("/products");
        router.refresh();
      }, 1500);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "حدث خطأ غير متوقع، حاول مرة أخرى";
      setToast({ type: "error", message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <form
        onSubmit={handleSubmit}
        className="mt-6 mx-auto p-6 md:p-8 space-y-6 bg-white border border-slate-100 rounded-2xl shadow-sm"
        dir="rtl"
        noValidate
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              إضافة عقار جديد
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
            <span>رجوع للقائمة</span>
          </Link>
        </div>

        {/* ── Row 1: Title & Location ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="عنوان العقار" required>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="مثال: شقة مودرن مطلة على البحر"
              className={inputClass}
            />
          </Field>

          <Field label="الموقع (المحافظة / المدينة)" required>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="مثال: القاهرة / التجمع الخامس"
              className={inputClass}
            />
          </Field>
        </div>

        {/* ── Row 2: Type & BookType ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    ? "جاري تحميل الأنواع..."
                    : "اختر نوع العقار..."}
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

        {/* ── 🌟 الفلاتر الديناميكية القادمة من الباك إند (بما فيها المساحة والغرف لو ضفتهم كفلاتر هناك) ── */}
        {selectedCategoryData &&
          selectedCategoryData.filiters &&
          selectedCategoryData.filiters.length > 0 && (
            <div className="p-4 bg-slate-50/60 border border-dashed border-slate-200 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-green-700">
                المواصفات الإضافية الخاصة بـ ({selectedCategoryData.name})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedCategoryData.filiters.map((filter, index) => (
                  <Field key={index} label={filter.filterName}>
                    <select
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

        {/* ── 🌟 السعر فقط (تم إخلاء المساحة والغرف والحمامات من هنا) ── */}
        <div className="w-full">
          <Field label="السعر (ج.م)" required>
            <input
              name="price"
              type="number"
              min={0}
              value={formData.price === 0 ? "" : formData.price}
              onChange={handleChange}
              placeholder="0"
              className={inputClass}
            />
          </Field>
        </div>

        {/* ── Image Upload ── */}
        <Field label="صورة العقار الرئيسية">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <label className="md:col-span-3 border-2 border-dashed border-slate-200 hover:border-green-600 bg-slate-50/50 hover:bg-white rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all h-28 text-center group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isSaving}
                className="hidden"
              />
              <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-green-600 transition-colors" />
              <span className="text-xs font-semibold text-slate-700">
                {imageFile ? imageFile.name : "اضغط لرفع صورة العقار"}
              </span>
              <span className="text-[10px] text-slate-400">
                يدعم JPG, PNG, WEBP
              </span>
            </label>

            {/* Preview */}
            <div className="border border-slate-100 bg-slate-50 rounded-xl h-28 overflow-hidden flex items-center justify-center shadow-inner">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="معاينة"
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

        {/* ── Description ── */}
        <Field label="الوصف والتفاصيل">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="اكتب وصفاً تفصيلياً للعقار وميزاته..."
            rows={4}
            className={`${inputClass} resize-none`}
          />
        </Field>

        {/* ── Submit ── */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full md:w-auto md:min-w-[160px] px-6 h-12 bg-green-700 hover:bg-green-800 active:scale-[0.98] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <span>إضافة العقار وحفظه</span>
            )}
          </button>
        </div>
      </form>
    </>
  );
}
