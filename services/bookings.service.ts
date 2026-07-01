
import type { Booking, CreateBookingDto, UpdateBookingDto } from "@/types/booking.types";

const BASE_URL = `https://back-end-crm-project.vercel.app/api/bookings/`;

async function parseError(res: Response, fallback: string): Promise<never> {
  const body = await res.json().catch(() => null);
  throw new Error(body?.message ?? body?.error ?? `${fallback} (${res.status})`);
}

function authHeaders(token?: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getAllBookings(token?: string): Promise<Booking[]> {
  try {
    const res = await fetch(BASE_URL, {
      cache: "no-store",
      headers: authHeaders(token),
    });
    if (!res.ok) await parseError(res, "Failed to fetch bookings");
    const data = await res.json();
    return data?.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to fetch bookings");
  }
}

export async function getOneBooking(id: string, token?: string): Promise<Booking> {
  try {
    // إزالة أي سلاش زائد في نهاية الـ BASE_URL ثم إضافة السلاش والمعرّف بشكل آمن
    const cleanUrl = `${BASE_URL.replace(/\/$/, "")}/${id}`;

    const res = await fetch(cleanUrl, {
      method: "GET", // يفضل كتابتها صراحة للوضوح
      cache: "no-store",
      headers: authHeaders(token),
    });

    if (!res.ok) await parseError(res, "Failed to fetch booking");
    const data = await res.json();
    return data?.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to fetch booking");
  }
}

export async function createBooking(payload: CreateBookingDto, token?: string): Promise<Booking> {
  try {
    const res = await fetch(`${BASE_URL}add`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    });
    if (!res.ok) await parseError(res, "Failed to create booking");
    const data = await res.json();
    return data?.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to create booking");
  }
}

export async function updateBooking(id: string, payload: UpdateBookingDto, token?: string): Promise<Booking> {
  try {
    const res = await fetch(`${BASE_URL}${id}`, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    });
    if (!res.ok) await parseError(res, "Failed to update booking");
    const data = await res.json();
    return data?.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to update booking");
  }
}

export async function deleteOneBooking(id: string, token?: string): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    });
    if (!res.ok) await parseError(res, "Failed to delete booking");
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to delete booking");
  }
}