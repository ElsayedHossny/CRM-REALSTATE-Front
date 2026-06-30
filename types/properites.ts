export interface Property {
  _id: string;
  title: string;
  description: string;
  type: "apartment" | "villa" | "chalet" | string;
  bookType: "sale" | "rent";
  location: string;
  region: string;
  price: number;
  area: number;
  floor: string;
  rooms: number;
  bathrooms: number;
  images: string[];
  status: "available" | "sold" | "rented";
  createdAt: string;
  updatedAt: string;
  category: string;
  features: {
    filterName: string;
    value: string;
    _id?: string;
  }[];
  __v?: number;
}