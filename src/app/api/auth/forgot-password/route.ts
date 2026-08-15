import { NextResponse } from "next/server";
import { forgotPassword } from "@services/authService";

export async function POST(request: Request) {
  const { email } = await request.json();
  try {
    await forgotPassword(email);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[auth/forgot-password]", err);
    // Don't leak whether the email exists — always report success.
    return NextResponse.json({ success: true });
  }
}
