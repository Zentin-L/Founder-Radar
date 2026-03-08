"use client";

import { RequestAccessForm } from "@/components/marketing/forms/request-access-form";

export function RequestAccessSection() {
  return (
    <section id="access" className="min-h-screen py-24 flex items-center">
      <div className="w-full max-w-4xl rounded-2xl border border-gray-800 bg-gray-900/85 p-8 md:p-10 space-y-6">
        <p className="text-indigo-300 text-sm uppercase tracking-[0.2em]">Request Access</p>
        <h2 className="text-3xl md:text-5xl font-bold text-white">Join the first wave of signal-driven investors.</h2>
        <p className="text-gray-300">Apply for beta. We review each submission and invite qualified teams manually.</p>
        <RequestAccessForm />
      </div>
    </section>
  );
}
