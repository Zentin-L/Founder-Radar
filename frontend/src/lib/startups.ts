"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Startup {
    id: string;
    name: string;
    domain: string | null;
    sector: string | null;
    stage: string | null;
    founded_year: number | null;
    description: string | null;
    team_size: number | null;
    momentum_score: number | null;
    score_change: number | null;
    score_direction: string | null;
    score_updated_at: string | null;
    hiring_signal_delta: number | null;
    hiring_signal_collected_at: string | null;
    linkedin_signal_delta: number | null;
    linkedin_signal_collected_at: string | null;
    source: string | null;
    signals_status: string | null;
    linkedin_url: string | null;
    logo_url: string | null;
    submitted_by: string | null;
    created_at: string;
}

export interface StartupListResponse {
    items: Startup[];
    total: number;
    cursor: string | null;
    has_more: boolean;
}

export interface StartupFilters {
    q?: string;
    sector?: string;
    stage?: string;
    min_score?: number;
    max_score?: number;
    limit?: number;
}

export interface SignalTimelinePoint {
    id: string;
    signal_type: "hiring" | "linkedin";
    value: number;
    delta: number | null;
    collected_at: string;
}

export interface SignalTimelineResponse {
    startup_id: string;
    items: SignalTimelinePoint[];
    cursor: string | null;
    has_more: boolean;
}

export interface ScoreHistoryPoint {
    score: number;
    score_change: number;
    score_direction: "up" | "down" | "flat";
    calculated_at: string;
}

export interface ScoreHistoryResponse {
    startup_id: string;
    items: ScoreHistoryPoint[];
    cursor: string | null;
    has_more: boolean;
}

export interface StartupSubmitResponse {
    startup: Startup;
    message: string;
}

export function useStartups(filters: StartupFilters) {
    return useInfiniteQuery<StartupListResponse>({
        queryKey: ["startups", filters],
        initialPageParam: null as string | null,
        queryFn: async ({ pageParam }) => {
            const res = await api.get("/api/startups", {
                params: {
                    ...filters,
                    cursor: pageParam,
                    limit: filters.limit ?? 20,
                },
            });
            return res.data;
        },
        getNextPageParam: (lastPage) => (lastPage.has_more ? lastPage.cursor : undefined),
    });
}

export function useStartup(id: string | null) {
    return useQuery<Startup>({
        queryKey: ["startup", id],
        queryFn: async () => {
            const res = await api.get(`/api/startups/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useSearchStartups(query: string) {
    return useQuery<Startup[]>({
        queryKey: ["startups", "search", query],
        queryFn: async () => {
            const res = await api.get("/api/startups/search", { params: { q: query, limit: 20 } });
            return res.data;
        },
        enabled: query.trim().length > 0,
    });
}

export function useStartupSignalTimeline(id: string | null, type?: "hiring" | "linkedin") {
    return useQuery<SignalTimelineResponse>({
        queryKey: ["signals", id, type ?? "all"],
        queryFn: async () => {
            const res = await api.get(`/api/signals/${id}`, {
                params: {
                    type,
                    limit: 50,
                },
            });
            return res.data;
        },
        enabled: !!id,
    });
}

export function useStartupScoreHistory(id: string | null) {
    return useQuery<ScoreHistoryResponse>({
        queryKey: ["scoring", id, "history"],
        queryFn: async () => {
            const res = await api.get(`/api/scoring/startups/${id}/history`, {
                params: { limit: 50 },
            });
            return res.data;
        },
        enabled: !!id,
    });
}

export function useSubmitStartup() {
    const queryClient = useQueryClient();

    return useMutation<StartupSubmitResponse, Error, { url: string }>({
        mutationFn: async ({ url }) => {
            const res = await api.post("/api/startups/submit", { url });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["startups"] });
        },
    });
}
