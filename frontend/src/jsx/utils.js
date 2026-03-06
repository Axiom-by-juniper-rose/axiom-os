import { useState, useEffect } from "react";
import { MODELS } from "./constants";
// BUG-H1 fix: import Supabase client to route LLM calls through the server-side proxy
// instead of making direct browser calls with exposed API keys.
import { supabase } from "../lib/supabase";

export const fmt = {
    usd: (n) => "$" + Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 }),
    pct: (n) => Number(n || 0).toFixed(1) + "%",
    num: (n) => Number(n || 0).toLocaleString(),
    sf: (n) => Number(n || 0).toLocaleString() + " SF",
    k: (n) => "$" + (Number(n || 0) / 1000).toFixed(0) + "K",
    M: (n) => "$" + (Number(n || 0) / 1e6).toFixed(2) + "M",
};

export function useLS(key, init) {
    const [val, set] = useState(() => {
        try {
            const s = localStorage.getItem(key);
            return s ? JSON.parse(s) : (typeof init === "function" ? init() : init);
        } catch {
            return typeof init === "function" ? init() : init;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(val));
        } catch { }
    }, [key, val]);

    return [val, set];
}

export const downloadCSV = (headers, data, filename) => {
    const csv = [headers.join(","), ...data.map(r => r.map(c => typeof c === "string" && c.includes(",") ? `"${c}"` : c).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};

export const importCSV = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split('\n').filter(l => l.trim());
        if (lines.length < 2) return;
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const data = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            const obj = {};
            headers.forEach((h, i) => { obj[h] = values[i]; });
            return obj;
        });
        callback(data);
    };
    reader.readAsText(file);
};

export const downloadText = (text, filename) => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};

// BUG-H1 fix: All LLM calls now route through the Supabase Edge Function "llm-proxy".
// API keys (Anthropic, OpenAI, Groq, Together) are stored as Supabase secrets server-side.
// The frontend never touches a raw API key or sends the "anthropic-dangerous-direct-browser-access" header.
export async function callLLM(messages, system = "", modelId = "claude-sonnet-4-20250514") {
    const defaultSys = "You are an expert real estate development analyst and feasibility consultant. Be concise, precise, and actionable.";
    try {
        const { data, error } = await supabase.functions.invoke("llm-proxy", {
            body: {
                model: modelId,
                messages,
                system: system || defaultSys,
                max_tokens: 1200,
            },
        });
        if (error) return `LLM proxy error: ${error.message}`;
        return data?.content || "No response from proxy.";
    } catch (e) {
        return "API error: " + e.message;
    }
}
