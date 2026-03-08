"use client";

import { RequestAccessForm } from "@/components/marketing/forms/request-access-form";
import Link from "next/link";

export default function RequestAccessPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container max-w-4xl mx-auto py-16 px-6">
        <Link href="/" className="text-gray-400 hover:text-white text-sm mb-8 inline-block">
          ← Back
        </Link>
        <div className="rounded-2xl border border-gray-800 bg-gray-900/85 p-8 md:p-10 space-y-6">
          <p className="text-indigo-300 text-sm uppercase tracking-[0.2em]">Request Access</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white">Join the first wave of signal-driven investors.</h2>
          <p className="text-gray-300">Apply for beta. We review each submission and invite qualified teams manually.</p>
          <RequestAccessForm />
        </div>
      </div>
    </div>
  );
}
