"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "./api";

interface User {
    id: string;
    email: string;
    email_verified: boolean;
    subscription_tier: string;
    sector_preferences: Record<string, boolean> | null;
}

export function useAuth() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const { data: user, isLoading, isError } = useQuery<User>({
        queryKey: ["auth", "me"],
        queryFn: async () => {
            const res = await api.get("/api/auth/me");
            return res.data;
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
    });

    const loginMutation = useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            const res = await api.post("/api/auth/login", { email, password });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
    });

    const registerMutation = useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            const res = await api.post("/api/auth/register", { email, password });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await api.post("/api/auth/logout");
        },
        onSuccess: () => {
            queryClient.clear();
            router.push("/login");
        },
    });

    const updateProfileMutation = useMutation({
        mutationFn: async (data: { sector_preferences?: Record<string, boolean> }) => {
            const res = await api.patch("/api/auth/me", data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
    });

    return {
        user: user ?? null,
        isLoading,
        isAuthenticated: !!user && !isError,
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout: logoutMutation.mutate,
        updateProfile: updateProfileMutation.mutateAsync,
        loginError: loginMutation.error,
        registerError: registerMutation.error,
        isLoginPending: loginMutation.isPending,
        isRegisterPending: registerMutation.isPending,
    };
}
