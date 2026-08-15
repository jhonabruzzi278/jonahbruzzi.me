import { NextResponse } from "next/server";
import { loginUser } from "@services/authService";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  try {
    const result = await loginUser(email, password);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[auth/login]", err);
    return NextResponse.json(
      { message: "Correo o contraseña incorrectos" },
      { status: 401 }
    );
  }
}
