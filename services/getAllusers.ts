
import Cookies from 'js-cookie'


export const getUsers = async () => {
  const token = Cookies.get("admin_token");

  const res = await fetch(
    "https://backend-crm-project-production.up.railway.app/api/auth/users",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();
  console.log("Users data:", data);
  
  return data?.data || data || [];
};