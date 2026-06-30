"use client"

import { useState, useEffect } from "react"
import Cookies from "js-cookie"

const BASE_URL = "https://back-end-crm-project.vercel.app/api/installmentPlan"

interface InstallmentPlan {
    _id: string;
    name: string;
    months: number;
    downPaymentPercentage: number;
    isActive: boolean;
}

interface InstallmentPlanSelectProps {
    value: string;
    onChange: (value: string) => void;
}

export default function InstallmentPlanSelect({ value, onChange }: InstallmentPlanSelectProps) {
    const [plans, setPlans] = useState<InstallmentPlan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getPlans = async () => {
            try {
                const token = Cookies.get('admin_token');

                const res = await fetch(BASE_URL, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                const data = await res.json();

                if (res.ok) {
                    setPlans(data.data || []); // ✅ البيانات في data.data
                } else {
                    console.error("خطأ في جلب خطط التقسيط:", data.message);
                }
            } catch (error) {
                console.error("Error fetching plans:", error);
            } finally {
                setLoading(false);
            }
        };

        getPlans();
    }, []);

    return (
        <div>
            <label className="block text-gray-600 mb-1">
                خطة التقسيط <span className="text-red-500">*</span>
            </label>
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 outline-none focus:border-green-500 bg-white"
            >
                <option value="">-- اختر خطة التقسيط --</option>
                {loading ? (
                    <option disabled>جاري تحميل الخطط...</option>
                ) : (
                    plans
                        .filter(plan => plan.isActive) // ✅ بس الخطط الفعالة
                        .map((plan) => (
                            <option key={plan._id} value={plan._id}>
                                {plan.name} - {plan.months} شهر - دفعة أولى {plan.downPaymentPercentage}%
                            </option>
                        ))
                )}
            </select>
        </div>
    );
}