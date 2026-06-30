

import Cookies from 'js-cookie'; 




export async function getPropertiesdashboard() {
  try {
    const res = await fetch(
      `https://back-end-crm-project.vercel.app/api/properties`,
      {
        cache: "no-store", // ✅ ده اللي ناقص
      }
    );

    if (!res.ok) {
      throw new Error(res.statusText || "failed to fetch Properties");
    }
    const data = await res.json();
    return data?.data.data;

  } catch (error) {
    return { error: error as string };
  }
}

export async function getPropertyById(id: string) {
  try {
    const res = await fetch(`https://back-end-crm-project.vercel.app/api/properties/${id}`, {
      method: "GET",
      cache: "no-store", // عشان يضمن يجيب داتا حية دايماً
    });
    if (!res.ok) throw new Error("فشل في جلب بيانات العقار من السيرفر");
    const data = await res.json();
    return data.data || data; // لو الباك إند بيبعت الداتا جوه أوبجكت اسمه data
  } catch (error) {
    console.error("Error in getPropertyById:", error);
    throw error;
  }
}


export async function loginAdmin(email: string, password: string): Promise<string> {
  const res = await fetch("https://back-end-crm-project.vercel.app/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "فشل تسجيل الدخول");
  }

  // 💡 التعديل هنا: السيرفر بيرجع التوكن في data.accessToken
  const token = data.data?.accessToken; 
  
  if (token) {
    Cookies.set("admin_token", token, { 
      expires: 1, 
      sameSite: "Lax" 
    });
    
    console.log("Login: التوكن تم تخزينه بنجاح");
    return token;
  } else {
    throw new Error("لم يتم العثور على accessToken في الاستجابة");
  }
}


export async function updateProperty(id: string, dataObj: any) {
  // 2. اقرأ التوكن من الكوكيز
  const token = Cookies.get('admin_token'); 

  const res = await fetch(`https://back-end-crm-project.vercel.app/api/properties/${id}`, {
    method: "PATCH", 
    headers: {
      "Content-Type": "application/json",
      // 3. ابعت التوكن في الهيدر (الطريقة دي هي اللي هتنهي مشكلة Unauthorized)
      ...(token && { "Authorization": `Bearer ${token}` }),
    },
    body: JSON.stringify(dataObj),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "فشل التحديث");
  }
  return await res.json();
}


export async function deleteProperty(id: string): Promise<void> {
  const token = Cookies.get("admin_token");
  
  const res = await fetch(
    `https://back-end-crm-project.vercel.app/api/properties/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "فشل حذف العقار");
  }
}