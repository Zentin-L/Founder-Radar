import { NextRequest, NextResponse } from "next/server";

const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ message: "Missing token." }, { status: 400 });
  }

  const response = await fetch(`${backendUrl}/api/marketing/request-access/verify?token=${encodeURIComponent(token)}`, {
    method: "GET",
  });

  const data = await response.json().catch(() => null) as { success?: boolean; message?: string; detail?: string } | null;

  if (!response.ok) {
    return NextResponse.json(
      { message: data?.message || data?.detail || "Invalid or expired token." },
      { status: response.status }
    );
  }

  return NextResponse.json({ success: true, message: data?.message || "Email verified. We'll review your request soon." });
}
