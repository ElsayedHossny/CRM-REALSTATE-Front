"use client"

import { useState, useEffect } from "react"
import Cookies from "js-cookie"

const BASE_URL = "https://back-end-crm-project.vercel.app/api/properties/"

interface Property {
    _id: string;
    title: string;
    location: string;
    price: number;
    status: string;
}

interface PropertySelectProps {
    value: string;
    onChange: (value: string) => void;
}

export default function PropertySelect({ value, onChange }: PropertySelectProps) {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProperties = async () => {
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
                    setProperties(data.data?.data || []); // ✅ البيانات جوا data.data
                } else {
                    console.error("خطأ في جلب العقارات:", data.message);
                }
            } catch (error) {
                console.error("Error fetching properties:", error);
            } finally {
                setLoading(false);
            }
        };

        getProperties();
    }, []);

    return (
        <div>
            <label className="block text-gray-600 mb-1">
                العقار <span className="text-red-500">*</span>
            </label>
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 outline-none focus:border-green-500 bg-white"
            >
                <option value="">-- اختر العقار --</option>
                {loading ? (
                    <option disabled>جاري تحميل العقارات...</option>
                ) : (
                    properties.map((property) => (
                        <option key={property._id} value={property._id}>
                            {property.title} - {property.location} - {property.price.toLocaleString()} ج.م
                        </option>
                    ))
                )}
            </select>
        </div>
    );
}