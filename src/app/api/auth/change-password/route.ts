import { NextResponse } from "next/server";
import { changePassword } from "@services/authService";

export async function POST(request: Request) {
  const { email, password, newPassword } = await request.json();
  try {
    await changePassword(email, password, newPassword);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[auth/change-password]", err);
    return NextResponse.json(
      { message: "Contraseña actual incorrecta" },
      { status: 400 }
    );
  }
}
