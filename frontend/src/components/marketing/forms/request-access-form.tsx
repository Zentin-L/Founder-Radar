"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trackMarketingEvent } from "@/lib/marketing/analytics";

export function RequestAccessForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") || ""),
      firm: String(formData.get("firm") || ""),
      role: String(formData.get("role") || ""),
      sector: String(formData.get("sector") || ""),
      stageFocus: String(formData.get("stageFocus") || ""),
      message: String(formData.get("message") || ""),
    };

    const response = await fetch("/api/request-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setStatus("Check your inbox to verify your request.");
      trackMarketingEvent("request_access_submitted", { sector: payload.sector, role: payload.role });
      (event.currentTarget as HTMLFormElement).reset();
    } else {
      const data = await response.json().catch(() => ({ message: "Could not submit." }));
      setStatus(data.message || "Could not submit.");
      trackMarketingEvent("request_access_failed", { status: response.status });
    }

    setIsSubmitting(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Input name="email" type="email" placeholder="Work email" required />
        <Input name="firm" placeholder="Fund / firm" required />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Input name="role" placeholder="Role (Analyst, Scout, Partner...)" required />
        <Select name="sector" defaultValue="" required>
          <option value="" disabled>Select sector focus</option>
          <option value="fintech">Fintech</option>
          <option value="ai">AI / ML</option>
          <option value="saas">B2B SaaS</option>
          <option value="health">Health</option>
          <option value="consumer">Consumer</option>
          <option value="other">Other</option>
        </Select>
      </div>
      <Select name="stageFocus" defaultValue="" required>
        <option value="" disabled>Preferred stage</option>
        <option value="pre-seed">Pre-seed</option>
        <option value="seed">Seed</option>
        <option value="series-a">Series A</option>
        <option value="growth">Growth</option>
      </Select>
      <Textarea name="message" placeholder="What would make Founder Radar essential for your process?" />
      <Button type="submit" size="lg" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Request Access"}</Button>
      {status && <p className="text-sm text-gray-300">{status}</p>}
    </form>
  );
}
