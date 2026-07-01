// types/booking.types.ts

export interface Property {
  _id: string;
  title: string;
  price: number;
  location: string;
  region: string;
  bookType: string;
  status: string;
  images: string[];
  description: string;
  features: { filterName: string; value: string; _id: string }[];
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  property_id: Property;  // ✅ object مش string
  name: string;
  email: string;
  phone: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export type CreateBookingDto = {
  property_id: string;   // ✅ في الـ create بنبعت string
  name: string;
  email: string;
  phone: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
};

export type UpdateBookingDto = Partial<CreateBookingDto>;