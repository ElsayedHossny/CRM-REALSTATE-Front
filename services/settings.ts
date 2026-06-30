"use client"

const BASE_URL ="https://back-end-crm-project.vercel.app/api/company"

export const  getSettings = async (token : string) =>{
   try{
     const res = await fetch(`${BASE_URL}`,{
        method:"GET",
        headers:{
            "Authorization" : `Bearer ${token}`,
            "Content-Type": "application/json"
        }
     });
    const data = await res.json()
    return  data
   }catch(error){
    throw error
   }
}


export const updatedCompantInfo = async (token: string, formData: FormData) => {
  try {
    const res = await fetch(`https://back-end-crm-project.vercel.app/api/company`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}` // ✅ Bearer مش Baerer
      },
      body: formData
    })

    if (!res.ok) {
      const error = await res.json()
      console.error("PUT error:", error)
      throw new Error(error.message)
    }

    const data = await res.json()
    return data
  } catch (error) {
    throw error
  }
}