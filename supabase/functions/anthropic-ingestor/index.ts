// supabase/functions/anthropic-ingestor/index.ts
// Modernized to use Anthropic /v1/messages API (claude-3.5-sonnet and newer models)

interface RequestBody {
    prompt: string;
    system?: string;          // optional system prompt
    model?: string;           // optional model override
    max_tokens?: number;
}

const CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: CORS });
    }

    try {
        if (req.method !== "POST") {
            return new Response(JSON.stringify({ error: "Only POST allowed" }), {
                status: 405,
                headers: { ...CORS, "Content-Type": "application/json" },
            });
        }

        const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") ?? "";
        if (!ANTHROPIC_API_KEY) {
            return new Response(JSON.stringify({ error: "Missing ANTHROPIC_API_KEY secret" }), {
                status: 500,
                headers: { ...CORS, "Content-Type": "application/json" },
            });
        }

        const contentType = req.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            return new Response(JSON.stringify({ error: "Expected application/json" }), {
                status: 400,
                headers: { ...CORS, "Content-Type": "application/json" },
            });
        }

        const body = (await req.json()) as RequestBody;
        if (!body?.prompt || typeof body.prompt !== "string") {
            return new Response(JSON.stringify({ error: "Missing or invalid 'prompt' field" }), {
                status: 400,
                headers: { ...CORS, "Content-Type": "application/json" },
            });
        }

        const model = body.model ?? "claude-3-5-sonnet-20241022";
        const maxTokens = body.max_tokens ?? 1000;

        // Build the messages array
        const messages: { role: string; content: string }[] = [
            { role: "user", content: body.prompt },
        ];

        const anthropicPayload: Record<string, unknown> = {
            model,
            max_tokens: maxTokens,
            messages,
        };

        // Optionally inject a system prompt
        if (body.system) {
            anthropicPayload.system = body.system;
        }

        const resp = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify(anthropicPayload),
        });

        if (!resp.ok) {
            const text = await resp.text();
            console.error("Anthropic API error", resp.status, text);
            return new Response(
                JSON.stringify({ error: "Anthropic API error", status: resp.status, body: text }),
                { status: 502, headers: { ...CORS, "Content-Type": "application/json" } }
            );
        }

        const json = await resp.json();

        // /v1/messages response shape: { content: [{ type: "text", text: "..." }] }
        const output = json?.content?.[0]?.text ?? json;

        return new Response(JSON.stringify({ model, output, raw: json }), {
            status: 200,
            headers: { ...CORS, "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Function error", err);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { ...CORS, "Content-Type": "application/json" },
        });
    }
});
