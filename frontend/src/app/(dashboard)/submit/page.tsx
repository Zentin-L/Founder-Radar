"use client";

import { useState } from "react";
import { SubmitModal } from "@/components/submit-modal";

export default function SubmitPage() {
    const [open, setOpen] = useState(true);

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Submit Startup</h2>
            <p className="text-sm text-gray-400">Paste a startup URL to add it for tracking.</p>
            <button
                onClick={() => setOpen(true)}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
                Open Submit Form
            </button>
            <SubmitModal isOpen={open} onClose={() => setOpen(false)} />
        </div>
    );
}
