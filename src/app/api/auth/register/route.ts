import { NextResponse } from "next/server";
import { registerUser } from "@services/authService";

export async function POST(request: Request) {
  const { email, password, firstName, lastName, phone, address } =
    await request.json();
  try {
    const result = await registerUser(email, password, {
      firstName,
      lastName,
      phone,
      address,
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[auth/register]", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "No se pudo crear la cuenta" },
      { status: 400 }
    );
  }
}
