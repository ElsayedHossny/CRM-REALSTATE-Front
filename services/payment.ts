import { IPayment } from "@/interfaces/payment"; 

const BASE_URL = "https://back-end-crm-project.vercel.app/api/payments";

export const getAllPayments = async (token: string): Promise<IPayment[]> => {
  try {
    const res = await fetch(`${BASE_URL}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      cache: "no-store" 
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${res.status}`);
    }

    const data: IPayment[] = await res.json();
    
    console.log(data)

    return data;

    
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
