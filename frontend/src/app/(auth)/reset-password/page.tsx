"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/api/auth/password-reset/request", { email });
            setSent(true);
        } catch {
            setSent(true); // Don't reveal if email exists
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="text-center space-y-4">
                <div className="text-4xl">📧</div>
                <h2 className="text-xl font-semibold text-white">Check your email</h2>
                <p className="text-sm text-gray-400">
                    If an account exists for {email}, we&apos;ve sent a password reset link.
                </p>
                <Link href="/login" className="inline-block text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                    ← Back to sign in
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <h2 className="text-xl font-semibold text-white mb-1">Reset password</h2>
                <p className="text-sm text-gray-400">Enter your email and we&apos;ll send a reset link</p>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="you@fund.com"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-medium rounded-lg transition-colors duration-200"
            >
                {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <p className="text-center text-sm text-gray-400">
                <Link href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                    ← Back to sign in
                </Link>
            </p>
        </form>
    );
}
