"use client";

import { useEffect, useState } from "react";
import { trackMarketingEvent } from "@/lib/marketing/analytics";

export function VerifyClient({ token }: { token: string | null }) {
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    async function verify() {
      if (!token) {
        setMessage("Verification token missing.");
        return;
      }

      const response = await fetch(`/api/request-access/verify?token=${token}`);
      const data = await response.json().catch(() => ({ message: "Verification failed." }));
      setMessage(data.message || "Verified.");
      if (response.ok) {
        trackMarketingEvent("request_access_verified");
      }
    }

    void verify();
  }, [token]);

  return <p className="text-gray-300">{message}</p>;
}
