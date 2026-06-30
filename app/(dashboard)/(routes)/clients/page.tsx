"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  X,
  Trash2,
  Eye,
  Users,
  DollarSign,
  Clock,
  Coins,
  HandCoins,
  AlertCircle,
} from "lucide-react";
import TableFilters from "@/components/clients/table-filters";
import InstallmentsModal from "@/components/clients/installments-modal";
import {
  getClients,
  createClient,
  deleteClient,
} from "@/services/client.service";
import { Client, CreateClientInput } from "@/interfaces/client.interface";

export default function ClientsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "debt">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_id: "",
    property_id: "",
    totalPrice: "",
    downPayment: "",
    notes: "",
  });
  const [formInstallments, setFormInstallments] = useState<
    { amount: string; dueDate: string }[]
  >([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const result = await getClients(activeTab);
      setClients(result);
    } catch (error) {
      console.error(error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [activeTab]);

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const query = searchQuery.trim().toLowerCase();
    return clients.filter((client) => {
      const clientName = client.user_id?.name?.toLowerCase() || "";
      const propertyTitle = client.property_id?.title?.toLowerCase() || "";
      return clientName.includes(query) || propertyTitle.includes(query);
    });
  }, [clients, searchQuery]);

  const totalClients = filteredClients.length;
  const totalContracts = filteredClients.reduce(
    (sum, c) => sum + c.totalPrice,
    0,
  );
  const totalRemaining = filteredClients.reduce(
    (sum, c) => sum + (c.totalPrice - c.downPayment),
    0,
  );

  const handleOpenModal = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab as "all" | "debt");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInstallmentChange = (
    index: number,
    field: "amount" | "dueDate",
    value: string,
  ) => {
    const updated = [...formInstallments];
    updated[index] = { ...updated[index], [field]: value };
    setFormInstallments(updated);
  };

  const addInstallmentRow = () => {
    setFormInstallments([...formInstallments, { amount: "", dueDate: "" }]);
  };

  const removeInstallmentRow = (index: number) => {
    setFormInstallments(formInstallments.filter((_, i) => i !== index));
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalPrice = Number(formData.totalPrice);
    const downPayment = Number(formData.downPayment);

    if (isNaN(totalPrice) || totalPrice <= 0) {
      alert("يرجى إدخال إجمالي قيمة عقد صحيحة");
      return;
    }

    if (!formData.user_id.trim() || !formData.property_id.trim()) {
      alert("يرجى إدخال معرف العميل ومعرف العقار");
      return;
    }

    setSubmitting(true);
    try {
      const payload: CreateClientInput = {
        user_id: formData.user_id,
        property_id: formData.property_id,
        totalPrice,
        downPayment,
        notes: formData.notes,
        installments: formInstallments.map((inst) => ({
          amount: Number(inst.amount),
          dueDate: inst.dueDate,
          status: "PENDING",
          paidAt: null,
        })),
      };
      await createClient(payload);
      setIsCreateModalOpen(false);
      setFormData({
        user_id: "",
        property_id: "",
        totalPrice: "",
        downPayment: "",
        notes: "",
      });
      setFormInstallments([]);
      fetchClients();
    } catch (error) {
      console.error(error);
      alert("فشل في إضافة العميل، يرجى التحقق من الاتصال بالخادم");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العميل وجميع أقساطه؟")) {
      return;
    }

    try {
      await deleteClient(clientId);
      fetchClients();
    } catch (error: any) {
      alert(error.message || "فشل في حذف العميل");
    }
  };

  return (
    <div className="p-6 space-y-7 bg-gray-50/50 min-h-screen">
      <div className="flex justify-between items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            إدارة عقود العملاء
          </h1>
          <p className="text-sm text-gray-500">
            لوحة تحكم ذكية لمتابعة التدفقات المالية وحالات الأقساط.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-xs active:transform active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          إضافة عميل جديد
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <TableFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={(tab) => handleSetActiveTab(tab as "all" | "debt")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl shadow-xs p-5 border border-gray-100/80 flex items-center gap-4 hover:border-gray-200 transition-all">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              إجمالي العقود المجلوبة
            </p>
            <p className="text-2xl font-bold text-gray-800">{totalClients}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xs p-5 border border-gray-100/80 flex items-center gap-4 hover:border-gray-200 transition-all">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-medium text-gray-400 tracking-wider">
              قيمة التعاقدات الحالية
            </p>
            <p className="text-2xl font-bold text-emerald-600">
              {totalContracts.toLocaleString()}{" "}
              <span className="text-sm font-normal text-gray-500">ج.م</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xs p-5 border border-gray-100/80 flex items-center gap-4 hover:border-gray-200 transition-all">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-medium text-gray-400 tracking-wider">
              مستحقات قيد التحصيل
            </p>
            <p className="text-2xl font-bold text-amber-600">
              {totalRemaining.toLocaleString()}{" "}
              <span className="text-sm font-normal text-gray-500">ج.م</span>
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-72 gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-600 border-t-transparent"></div>
          <p className="text-sm text-gray-400 font-medium animate-pulse">
            جاري تحديث البيانات المباشرة...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredClients.map((client) => {
            const isDebtRoute = activeTab === "debt";
            const hasUnpaid = client.installments.some(
              (inst: any) => inst.status === "UNPAID",
            );

            let badgeColor = "bg-amber-50 text-amber-700 border-amber-100";
            let badgeText = "متبقي أقساط";

            if (!hasUnpaid && client.installments.length > 0) {
              badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
              badgeText = "ملتزم بالكامل";
            } else if (isDebtRoute) {
              badgeColor = "bg-rose-50 text-rose-700 border-rose-100";
              badgeText = "متعثر في السداد";
            }

            const remaining = client.totalPrice - client.downPayment;

            return (
              <div
                key={client._id}
                className="bg-white rounded-xl shadow-xs border border-gray-100 p-5 flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all duration-200 group"
              >
                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors">
                      {client.user_id?.name || "اسم غير معروف"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {client.property_id?.title || "عقار غير محدد"}
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-medium px-2.5 py-0.5 rounded-md border ${badgeColor}`}
                  >
                    {badgeText}
                  </span>
                </div>

                <div className="space-y-3 py-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5" />
                      إجمالي قيمة العقد
                    </span>
                    <span className="font-semibold text-gray-700">
                      {client.totalPrice.toLocaleString()} ج.م
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs flex items-center gap-1.5">
                      <HandCoins className="w-3.5 h-3.5" />
                      المقدم المدفوع
                    </span>
                    <span className="font-medium text-emerald-600">
                      +{client.downPayment.toLocaleString()} ج.م
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-100">
                    <span className="text-gray-500 font-medium text-xs flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      المتبقي المطلوب
                    </span>
                    <span
                      className={`font-bold ${remaining > 0 ? "text-rose-600" : "text-emerald-600"}`}
                    >
                      {remaining.toLocaleString()} ج.م
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(client)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium text-xs py-2.5 rounded-lg transition-colors shadow-xs flex items-center justify-center gap-1.5 active:transform active:scale-[0.98]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    تفاصيل الأقساط
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClient(client._id);
                    }}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 active:transform active:scale-[0.98]"
                    title="حذف العميل"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    حذف
                  </button>
                </div>
              </div>
            );
          })}

          {filteredClients.length === 0 && (
            <div className="col-span-full bg-white rounded-xl border border-dashed border-gray-200 text-center py-16 flex flex-col justify-center items-center gap-2">
              <p className="text-gray-400 font-medium text-sm">
                لا توجد عقود مطابقة في هذه القائمة حالياً
              </p>
            </div>
          )}
        </div>
      )}

      <InstallmentsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        client={selectedClient}
        onRefresh={fetchClients}
      />

      {isCreateModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                إضافة عميل جديد
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={handleCreateClient}
              className="p-6 space-y-4 overflow-y-auto"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  معرف العميل
                </label>
                <input
                  type="text"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  placeholder="أدخل معرف العميل"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  معرف العقار
                </label>
                <input
                  type="text"
                  name="property_id"
                  value={formData.property_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  placeholder="أدخل معرف العقار"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  إجمالي قيمة العقد
                </label>
                <input
                  type="number"
                  name="totalPrice"
                  value={formData.totalPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  placeholder="مثال: 500000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  المقدم المدفوع
                </label>
                <input
                  type="number"
                  name="downPayment"
                  value={formData.downPayment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  placeholder="مثال: 100000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ملاحظات (اختياري)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  rows={2}
                  placeholder="أي ملاحظات إضافية..."
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    الأقساط
                  </label>
                  <button
                    type="button"
                    onClick={addInstallmentRow}
                    className="text-sm bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-lg transition-colors"
                  >
                    + إضافة قسط
                  </button>
                </div>
                {formInstallments.map((inst: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="number"
                      placeholder="المبلغ"
                      value={inst.amount}
                      onChange={(e) =>
                        handleInstallmentChange(index, "amount", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                      required
                    />
                    <input
                      type="date"
                      placeholder="تاريخ الاستحقاق"
                      value={inst.dueDate}
                      onChange={(e) =>
                        handleInstallmentChange(
                          index,
                          "dueDate",
                          e.target.value,
                        )
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeInstallmentRow(index)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {formInstallments.length === 0 && (
                  <p className="text-sm text-gray-400">
                    لا توجد أقساط مضافة بعد
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                {submitting ? "جاري الإضافة..." : "إضافة العميل"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
