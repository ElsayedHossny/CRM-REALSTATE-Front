import { IPayment } from "@/interfaces/payment"; 

const BASE_URL = "https://backend-crm-project-production.up.railway.app/api/payments";

export const getAllPayments = async (token: string): Promise<IPayment[]> => {
  try {
    const res = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const result = await res.json();

    console.log("Payments API:", result);

    return result.data || [];
  } catch (error) {
    console.error("Error in getAllPayments:", error);
    throw error;
  }
};

export const getSinglePayment = async (id : string,token: string) =>{
  const res = await fetch (`${BASE_URL}/${id}`,{
    method : "GET",
    headers:{
      "Authorization" : `Bearer ${token}`,
      "Content-Type" : "application/json"
    },
    cache : "no-store"
  })

  const data = await res.json()
  console.log(data)
  return data
  
}
