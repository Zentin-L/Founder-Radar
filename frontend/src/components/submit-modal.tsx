"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { useSubmitStartup } from "@/lib/startups";

interface SubmitModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SubmitModal({ isOpen, onClose }: SubmitModalProps) {
    const [url, setUrl] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [submittedName, setSubmittedName] = useState<string | null>(null);
    const submitMutation = useSubmitStartup();

    if (!isOpen) return null;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage(null);
        setErrorMessage(null);
        setSubmittedName(null);

        try {
            const result = await submitMutation.mutateAsync({ url });
            setMessage(result.message);
            setSubmittedName(result.startup.name);
            setUrl("");
        } catch (error) {
            const axiosError = error as AxiosError<{ detail?: unknown }>;
            const status = axiosError.response?.status;
            const detail = axiosError.response?.data?.detail;

            if (status === 409) {
                setErrorMessage("This startup already exists in the database.");
                return;
            }
            if (status === 403 && typeof detail === "string") {
                setErrorMessage(detail);
                return;
            }
            setErrorMessage("Could not submit startup right now. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 p-4 flex items-center justify-center">
            <div className="w-full max-w-lg rounded-xl border border-gray-800 bg-gray-900 p-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Submit Startup</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-200" type="button">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="startup-url" className="block text-sm text-gray-300 mb-2">
                            Startup URL
                        </label>
                        <input
                            id="startup-url"
                            type="url"
                            required
                            placeholder="https://example.com"
                            value={url}
                            onChange={(event) => setUrl(event.target.value)}
                            className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                        />
                    </div>

                    {message && (
                        <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                            {message}
                            {submittedName && <span className="block mt-1">Added: {submittedName}</span>}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                            {errorMessage}
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitMutation.isPending}
                            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
                        >
                            {submitMutation.isPending ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
