import Cookies from "js-cookie";
import { Category, CreateCategoryPayload } from "@/types/category";

const API_URL = "https://back-end-crm-project.vercel.app/api/category";

const getHeaders = () => {
  const token = Cookies.get("admin_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};


export async function getAllCategories(): Promise<any> {

  const res = await fetch(`${API_URL}`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new Error("فشل في جلب التصنيفات من السيرفر");
  }
  return res.json();
}

export async function createCategory(payload: CreateCategoryPayload): Promise<Category> {
  const res = await fetch(`${API_URL}/addcategory`, { 
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "فشل في إنشاء التصنيف الجديد");
  }
  return res.json();
}

export async function deleteCategory(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new Error("فشل في حذف التصنيف من السيرفر");
  }
}

export async function updateCategory(id: string, payload: CreateCategoryPayload): Promise<Category> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT", 
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "فشل في تحديث التصنيف");
  }
  return res.json();
}