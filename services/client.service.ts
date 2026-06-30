import { Client, CreateClientInput } from '@/interfaces/client.interface';
import Cookies from 'js-cookie';

export async function getClients(filterType: 'all' | 'debt' | 'paid'): Promise<Client[]> {
  const baseUrl = 'https://back-end-crm-project.vercel.app/api/clients';
  let url: string;

  if (filterType === 'all') {
    url = `${baseUrl}/getAllClients?page=1&limit=8`;
  } else if (filterType === 'debt') {
    url = `${baseUrl}/getDebtClients`;
  } else {
    url = `${baseUrl}/getPaidClients`;
  }

  const token = Cookies.get('admin_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { method: 'GET', headers });
    if (!response.ok) {
      console.warn(`⚠️ خطأ في الشبكة ${response.status} أثناء طلب الرابط: ${url}`);
      return [];
    }
    const data = await response.json();
    let clients: Client[] = [];
    if (Array.isArray(data)) {
      clients = data;
    } else if (data && typeof data === 'object') {
      if (Array.isArray(data.clients)) {
        clients = data.clients;
      } else if (Array.isArray(data.allClients)) {
        clients = data.allClients;
      } else if (Array.isArray(data.data)) {
        clients = data.data;
      }
    }
    return clients;
  } catch (error) {
    console.error("🚨 حدث خطأ أثناء جلب بيانات العملاء:", error);
    return [];
  }
}

export async function createClient(data: CreateClientInput): Promise<boolean> {
  const token = Cookies.get('admin_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(
      'https://back-end-crm-project.vercel.app/api/clients/addclient',
      {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    console.log("CREATE RESPONSE:");
    console.log(result);

    if (!response.ok) {
      throw new Error(
        result.message ||
        result.error ||
        JSON.stringify(result)
      );
    }

    return true;
  } catch (error) {
    console.error("🚨 حدث خطأ أثناء إضافة العميل:", error);
    throw error;
  }
}

export async function deleteClient(clientId: string): Promise<boolean> {
  const token = Cookies.get('admin_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
   
    const response = await fetch(
      `https://back-end-crm-project.vercel.app/api/clients/deleteclient/${clientId}`,
      {
        method: 'DELETE',
        headers,
      }
    );

    const result = await response.json();
    console.log("DELETE RESPONSE:");
    console.log(result);

    if (!response.ok) {
      throw new Error(
        result.message ||
        result.error ||
        JSON.stringify(result)
      );
    }

    return true;
  } catch (error) {
    console.error("🚨 حدث خطأ أثناء حذف العميل:", error);
    throw error;
  }
}