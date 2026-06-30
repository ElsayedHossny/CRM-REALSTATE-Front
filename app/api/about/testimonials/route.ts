import { NextResponse } from "next/server";
import { aboutData } from "../../../../data/aboutData";

export async function GET() {
  try {
    return NextResponse.json(aboutData.testimonials, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch testimonials data" },
      { status: 500 }
    );
  }
}