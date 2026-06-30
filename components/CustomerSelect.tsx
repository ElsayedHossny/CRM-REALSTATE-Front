"use client"

import { useState, useEffect } from "react"

const BASE_URL = "https://back-end-crm-project.vercel.app/api/clients/getAllClients"

interface Client {
    _id: string,
    user_id: {
        _id: string,
        name: string,
    } | string,
    notes?: string
}

interface CustomerSelectProps {
    value: string,
    onChange: (value: string) => void
}

export default function CustomerSelect({ value, onChange }: CustomerSelectProps) {
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)

    // دالة سريعة لقراءة التوكن من الكوكيز
    const getCookie = (name: string) => {
        if (typeof document === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
    };

    useEffect(() => {
        const getClients = async () => {
            try {
                const token = getCookie('admin_token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

                const res = await fetch(BASE_URL, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    }
                });
                
                const data = await res.json();
                
                if (res.ok) {
                    setClients(data.clients || data); 
                } else {
                    console.error("الباك إند رفض الدخول:", data.message);
                }
            } catch (error) {
                console.error("Error fetching clients:", error);
            } finally {
                setLoading(false);
            }
        };

        getClients();
    }, [])

  const getClientLabel = (client: Client) => {
    if (typeof client.user_id === 'object' && client.user_id?.name) {
        return client.user_id.name;
    }
    return `عميل - ${client._id.substring(0, 8)}`;
}

    return (
        <div>
          <label className="block text-gray-600 mb-1">اسم أو معرّف العميل <span className="text-red-500">*</span></label>
          <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 outline-none focus:border-green-500 bg-white"
          >
            <option value="">-- اختر العميل من النظام --</option>
            {loading ? (
              <option disabled>جاري تحميل العملاء...</option>
            ) : (
              clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {getClientLabel(client)}
                </option>
              ))
            )}
          </select>
        </div>
    );
}