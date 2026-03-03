import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const JSON_SCHEMA = `
{
  "name": "Property Name",
  "address": "Full Street Address",
  "city": "City",
  "state": "State",
  "zip": "Zip Code",
  "asset_type": "multifamily | retail | office | industrial | subdivision",
  "year_built": 1995,
  "units_or_sqft": 100,
  "occupancy_pct": 95.5,
  "purchase_price": 5000000,
  "noi": 300000,
  "cap_rate": 6.0,
  "rent_roll_summary": "Optional brief text summary of the rent roll",
  "financials_summary": "Optional brief text summary of the T12/Financials",
  "description": "A robust 1-paragraph summary of the deal and its investment highlights."
}`;

const SYSTEM_PROMPT = `You are an elite commercial real estate underwriter and data extraction agent. 
Your job is to read the provided Offering Memorandum (OM) or Financial Document PDF and extract the key deal parameters.
Return ONLY valid JSON matching the following schema. If a value is truly not found, use null. Do not include markdown formatting or any other text outside the JSON object.

Schema:
${JSON_SCHEMA}
`;

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) throw new Error("Missing Authorization header");

        const { fileDataBase64, mediaType = "application/pdf" } = await req.json();

        if (!fileDataBase64) {
            throw new Error("Missing fileDataBase64 in request body");
        }

        const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
        if (!anthropicKey) {
            throw new Error("Missing ANTHROPIC_API_KEY environment variable. Check Supabase Vault or Secrets.");
        }

        console.log(`Processing document, type: ${mediaType}, size: ${fileDataBase64.length} chars`);

        // Construct the Anthropic Messages API payload for Claude 3.5 Sonnet
        // Claude 3.5 Sonnet supports the "document" type for PDFs in the 20241022 model and beta header
        const payload = {
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 4096,
            temperature: 0.0,
            system: SYSTEM_PROMPT,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "document",
                            source: {
                                type: "base64",
                                media_type: mediaType,
                                data: fileDataBase64
                            }
                        },
                        {
                            type: "text",
                            text: "Extract the critical underwriting data from this Offering Memorandum into the strictly requested JSON format."
                        }
                    ]
                }
            ]
        };

        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "x-api-key": anthropicKey,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
                "anthropic-beta": "pdfs-2024-09-25" // Required beta header for PDF support
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Anthropic API Error:", response.status, errorText);
            throw new Error(`Anthropic API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const content = data.content[0].text;

        let parsedJson;
        try {
            // Strip any unintended markdown formatting the LLM might have included
            let cleanJson = content.trim();
            if (cleanJson.startsWith("\`\`\`json")) cleanJson = cleanJson.substring(7);
            if (cleanJson.startsWith("\`\`\`")) cleanJson = cleanJson.substring(3);
            if (cleanJson.endsWith("\`\`\`")) cleanJson = cleanJson.substring(0, cleanJson.length - 3);
            cleanJson = cleanJson.trim();

            parsedJson = JSON.parse(cleanJson);
        } catch (e) {
            console.error("Failed to parse JSON from Claude:", content);
            throw new Error("Claude returned invalid JSON format.");
        }

        console.log("Extraction successful:", parsedJson.name);

        return new Response(JSON.stringify(parsedJson), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error: any) {
        console.error("om-ingestor error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });
    }
});
