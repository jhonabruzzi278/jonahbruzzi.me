import { NextResponse } from "next/server";
import { updateProfile } from "@services/authService";

function tokenFromRequest(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
}

export async function PUT(request: Request) {
  const token = tokenFromRequest(request);
  if (!token) {
    return NextResponse.json({ message: "Missing token" }, { status: 401 });
  }
  const { firstName, lastName, email, phone, address } = await request.json();
  try {
    const user = await updateProfile(token, {
      firstName,
      lastName,
      email,
      phone,
      address,
    });
    if (!user) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }
    return NextResponse.json({ user });
  } catch (err) {
    console.error("[auth/profile]", err);
    return NextResponse.json(
      { message: "No se pudo actualizar el perfil" },
      { status: 400 }
    );
  }
}
