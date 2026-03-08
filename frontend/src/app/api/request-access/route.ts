import { NextResponse } from "next/server";
import { RequestAccessPayload, validateRequestAccess } from "@/lib/marketing/validation";

const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function POST(request: Request) {
  const payload = (await request.json()) as RequestAccessPayload;
  const error = validateRequestAccess(payload);

  if (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }

  const response = await fetch(`${backendUrl}/api/marketing/request-access`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null) as { detail?: string; message?: string } | null;
    const message = data?.message || data?.detail || "Could not submit request.";
    return NextResponse.json({ message }, { status: response.status });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
