import { NextResponse } from "next/server";
import { getShowingCategories } from "@services/categoryService";

export async function GET() {
  try {
    const data = await getShowingCategories();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Failed to load categories" },
      { status: 502 }
    );
  }
}
