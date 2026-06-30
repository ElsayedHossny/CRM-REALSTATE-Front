"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FolderPlus,
  Plus,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Layers,
  Pencil,
  RotateCcw,
} from "lucide-react";
import { Category, FilterInput } from "@/types/category";
import {
  getAllCategories,
  createCategory,
  deleteCategory,
  updateCategory, // 🌟 استيراد فانكشن التعديل الجديدة
} from "@/services/category.service";

type ToastState = { type: "success" | "error"; message: string } | null;

export default function CategoryManager() {
  // States الخاصة بالفورم
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [filters, setFilters] = useState<FilterInput[]>([]);

  // 🌟 ستايت لتخزين الـ ID بتاع التصنيف اللي بنعدله حالياً (لو null يبقى إحنا في وضع الإضافة)
  const [editingId, setEditingId] = useState<string | null>(null);

  // States العامة
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  // مرجع لعمل سكرول للفورم عند الضغط على تعديل
  const formRef = useRef<HTMLFormElement>(null);

  // ── جلب البيانات عند فتح الصفحة ──
  const fetchCategories = async () => {
    setIsLoading(true);
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
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("خطأ أثناء جلب التصنيفات:", err);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ── تأثير إخفاء التوستر تلقائياً ──
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // ── توليد الـ Slug تلقائياً ──
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);

    const autoSlug = value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\u0600-\u06FF\w-]/g, "");

    setSlug(autoSlug);
  };

  // ── إدارة الفلاتر والخيارات ديناميكياً ──
  const addFilterField = () => {
    setFilters([
      ...filters,
      { filterName: "", options: [], currentOptionInput: "" },
    ]);
  };

  const removeFilterField = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleFilterNameChange = (index: number, value: string) => {
    const updated = [...filters];
    updated[index].filterName = value;
    setFilters(updated);
  };

  const addOptionToFilter = (index: number) => {
    const updated = [...filters];
    const optionVal = updated[index].currentOptionInput.trim();
    if (!optionVal) return;

    if (!updated[index].options.includes(optionVal)) {
      updated[index].options.push(optionVal);
    }
    updated[index].currentOptionInput = "";
    setFilters(updated);
  };

  const removeOptionFromFilter = (filterIndex: number, optionIndex: number) => {
    const updated = [...filters];
    updated[filterIndex].options = updated[filterIndex].options.filter(
      (_, i) => i !== optionIndex,
    );
    setFilters(updated);
  };

  // ── 🌟 دالة الـ التعديل: نقل البيانات للفورم فوق ──
  const handleEditClick = (cat: Category) => {
    setEditingId(cat._id); // تحويل وضع الفورم إلى "تعديل" وتخزين الـ ID
    setName(cat.name);
    setSlug(cat.slug);

    // تحويل الفلاتر القادمة من الباك إند للـ Structure بتاع الفرونت إند عشان نقدر نعدل فيها ونضيف خيارات
    if (cat.filiters && Array.isArray(cat.filiters)) {
      const mappedFilters = cat.filiters.map((f) => ({
        filterName: f.filterName,
        options: [...f.options],
        currentOptionInput: "", // حقل الإدخال الجديد يكون فاضي جاهز للكتابة
      }));
      setFilters(mappedFilters);
    } else {
      setFilters([]);
    }

    // عمل سكرول بسيط للفورم عشان الأدمن يلاحظ إن البيانات طلعت فوق
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ── 🌟 دالة إلغاء وضع التعديل وتصفير الفورم ──
  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setFilters([]);
  };

  // ── إرسال البيانات (Submit) - هجين يدعم الإضافة والتعديل ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setToast({ type: "error", message: "اسم التصنيف مطلوب" });
      return;
    }

    setIsSaving(true);

    const formattedFilters = filters
      .filter((f) => f.filterName.trim() !== "")
      .map((f) => ({
        filterName: f.filterName.trim(),
        options: f.options.map((opt) => opt.trim()),
      }));

    const payload = {
      name: name.trim(),
      slug: slug || name.trim().toLowerCase().replace(/\s+/g, "-"),
      filiters: formattedFilters,
    };

    try {
      if (editingId) {
        // 🚀 إذا كنا في وضع التعديل نطلب Update API
        await updateCategory(editingId, payload);
        setToast({ type: "success", message: "تم تحديث التصنيف بنجاح 🎉" });
      } else {
        // 🚀 إذا كنا في وضع الإضافة نطلب Create API
        await createCategory(payload);
        setToast({ type: "success", message: "تم إضافة التصنيف بنجاح 🎉" });
      }

      // تصفير الفورم وجلب الداتا الجديدة
      handleCancelEdit();
      await fetchCategories();
    } catch (err) {
      const message = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
      setToast({ type: "error", message });
    } finally {
      setIsSaving(false);
    }
  };

  // ── حذف تصنيف ──
  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا التصنيف نهائياً؟")) return;
    try {
      await deleteCategory(id);
      setToast({ type: "success", message: "تم حذف التصنيف بنجاح" });
      if (editingId === id) handleCancelEdit(); // لو بنحذف اللي بنعدله، صفر الفورم
      fetchCategories();
    } catch (err) {
      setToast({ type: "error", message: "حدث خطأ أثناء محاولة الحذف" });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-8" dir="rtl">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold text-white ${
            toast.type === "success" ? "bg-green-700" : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
        <Layers className="w-6 h-6 text-green-700" />
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            إدارة تصنيفات العقارات
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            إضافة وتعديل تصنيفات العقارات وتحديد فلاتر البحث الخاصة بكل تصنيف
            ديناميكياً.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form Add / Edit */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className={`lg:col-span-2 bg-white border rounded-2xl p-6 shadow-sm space-y-5 transition-colors ${
            editingId ? "border-amber-200 bg-amber-50/10" : "border-slate-100"
          }`}
        >
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-2">
            <FolderPlus
              className={`w-4 h-4 ${editingId ? "text-amber-600" : "text-green-600"}`}
            />
            {editingId ? "تعديل بيانات التصنيف الحالي" : "إضافة تصنيف جديد"}
          </h3>

          <div className="w-full">
            {/* حقل اسم التصنيف */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                اسم التصنيف <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="مثال: شقق سكنية، فيلل للبيع، تجاري"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-green-600 transition-all"
              />
            </div>
          </div>

          {/* Filters Area */}
          <div className="border-t border-slate-100 pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  فلاتر التصنيف المخصصة (Filters)
                </h4>
              </div>
              <button
                type="button"
                onClick={addFilterField}
                className="px-2.5 py-1.5 bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة فلتر</span>
              </button>
            </div>

            {filters.map((filter, fIndex) => (
              <div
                key={fIndex}
                className="p-4 bg-slate-50/70 border border-slate-100 rounded-xl space-y-3 relative"
              >
                <button
                  type="button"
                  onClick={() => removeFilterField(fIndex)}
                  className="absolute top-3 left-3 text-slate-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">
                      اسم الفلتر
                    </label>
                    <input
                      type="text"
                      value={filter.filterName}
                      onChange={(e) =>
                        handleFilterNameChange(fIndex, e.target.value)
                      }
                      placeholder="مثل: نوع التشطيب"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">
                      إضافة خيار للفلتر
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={filter.currentOptionInput}
                        onChange={(e) => {
                          const updated = [...filters];
                          updated[fIndex].currentOptionInput = e.target.value;
                          setFilters(updated);
                        }}
                        placeholder="اكتب واضغط إضافة (مثل: سوبر لوكس)"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => addOptionToFilter(fIndex)}
                        className="px-3 bg-green-700 text-white rounded-lg text-xs font-bold"
                      >
                        إضافة
                      </button>
                    </div>
                  </div>
                </div>
                {filter.options.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {filter.options.map((opt, oIndex) => (
                      <span
                        key={oIndex}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white border border-slate-200 text-slate-700 text-[11px] font-medium rounded-full"
                      >
                        {opt}
                        <button
                          type="button"
                          onClick={() => removeOptionFromFilter(fIndex, oIndex)}
                        >
                          <X className="w-3 h-3 text-slate-400 hover:text-red-500" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* التحكم بأزرار الحفظ والإلغاء */}
          <div className="pt-2 flex gap-3 justify-end">
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 h-10 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إلغاء التعديل</span>
              </button>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className={`w-full sm:w-auto px-5 h-10 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 transition-colors ${
                editingId
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-green-700 hover:bg-green-800"
              }`}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editingId ? (
                <span>تحديث وتعديل التصنيف</span>
              ) : (
                <span>حفظ وتثبيت التصنيف</span>
              )}
            </button>
          </div>
        </form>

        {/* View Categories List */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800">
            التصنيفات الحالية ({categories.length})
          </h3>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-green-600" />
              <span className="text-xs">جاري التحميل...</span>
            </div>
          ) : categories.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">
              لا توجد تصنيفات حالياً.
            </p>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className={`p-3 border rounded-xl flex items-start justify-between group transition-all ${
                    editingId === cat._id
                      ? "bg-amber-50/50 border-amber-300 ring-2 ring-amber-100"
                      : "bg-slate-50/50 hover:bg-slate-50 border-slate-100"
                  }`}
                >
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-900">
                      {cat.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Slug: {cat.slug}
                    </p>
                    {cat.filiters && cat.filiters.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1.5">
                        {cat.filiters.map((f, i) => (
                          <span
                            key={i}
                            className="text-[9px] bg-slate-200/60 text-slate-700 px-1.5 py-0.5 rounded"
                          >
                            {f.filterName} ({f.options.length})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* أزرار التحكم (تعديل وحذف) تظهر عند عمل هوفر */}
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      type="button"
                      onClick={() => handleEditClick(cat)}
                      className="p-1.5 text-slate-500 hover:text-amber-600 bg-white border border-slate-100 rounded-lg shadow-sm"
                      title="تعديل"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat._id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 bg-white border border-slate-100 rounded-lg shadow-sm"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
