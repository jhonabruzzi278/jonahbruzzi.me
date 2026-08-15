import { NextResponse } from "next/server";
import { resetPassword } from "@services/authService";

export async function POST(request: Request) {
  const { email, code, newPassword } = await request.json();
  try {
    await resetPassword(email, code, newPassword);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[auth/reset-password]", err);
    return NextResponse.json(
      { message: "El código no es válido o ya expiró" },
      { status: 400 }
    );
  }
}
