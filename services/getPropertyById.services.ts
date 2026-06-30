// import { IProperty } from "@/interfaces/property.interface";

export default async function getPropertyById(productId: string) {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products/${productId}`,
    );
    if (!res.ok) {
      throw new Error(res.statusText || "failed to fetch Properties");
    }
    const data = await res.json();
    // console.log({ getPropertyById: data });

    return data;
  } catch (error) {
    return { error: error as string };
  }
}
