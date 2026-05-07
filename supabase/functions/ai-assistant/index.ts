// Lovable AI Gateway — multi-mode endpoint for Mysuru Beyond Palaces
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

const SYSTEM_BASE = `You are the Mysuru Heritage Guide for "Mysuru Beyond Palaces" — a platform that decentralizes tourism away from crowded landmarks toward hidden gems, local artisans, and cultural trails. Be warm, concise, and knowledgeable about real Mysuru locations (Ashoka Road, Devaraja Market, Kuvempunagar silk cluster, Chamundi foothills, agraharas, etc.). Always prefer redirecting tourists to lesser-known places and local artisans.`;

async function callAI(messages: any[], opts: { stream?: boolean; tools?: any; tool_choice?: any } = {}) {
  return await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, messages, stream: !!opts.stream, ...(opts.tools && { tools: opts.tools, tool_choice: opts.tool_choice }) }),
  });
}

function errorResp(status: number, msg: string) {
  return new Response(JSON.stringify({ error: msg }), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (!LOVABLE_API_KEY) return errorResp(500, "LOVABLE_API_KEY not configured");

  try {
    const { mode, ...payload } = await req.json();

    // ============ MODE 1: CHAT (streaming) ============
    if (mode === "chat") {
      const { messages, context } = payload;
      const sys = `${SYSTEM_BASE}\n\nLive site data:\n${context ?? ""}\n\nWhen mentioning a specific place or artisan from the data above, format like: [PLACE:place-id] or [ARTISAN:artisan-id] so the UI can link.`;
      const resp = await callAI([{ role: "system", content: sys }, ...messages], { stream: true });
      if (resp.status === 429) return errorResp(429, "Too many requests, please wait a moment.");
      if (resp.status === 402) return errorResp(402, "AI credits exhausted. Add funds in Workspace settings.");
      if (!resp.ok) return errorResp(500, "AI gateway error");
      return new Response(resp.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
    }

    // ============ MODE 2: STORY ENHANCER ============
    if (mode === "enhance_story") {
      const { story, name, craft } = payload;
      const messages = [
        { role: "system", content: "You are a heritage writer. Polish artisan stories into warm, evocative 3-5 sentence prose in English. Preserve all facts, names, and family details. Do not invent facts. Output ONLY the polished story." },
        { role: "user", content: `Artisan: ${name}\nCraft: ${craft}\n\nRaw story:\n${story}` },
      ];
      const resp = await callAI(messages);
      const data = await resp.json();
      return new Response(JSON.stringify({ result: data.choices?.[0]?.message?.content ?? "" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ============ MODE 3: TRIP STORYTELLER ============
    if (mode === "storyteller") {
      const { items } = payload; // [{name, type, description}]
      const list = items.map((i: any, n: number) => `${n + 1}. ${i.name} (${i.type}) — ${i.description}`).join("\n");
      const messages = [
        { role: "system", content: "You are a heritage travel writer. Weave the listed Mysuru stops into one flowing 4-6 sentence narrative paragraph. Use sensory detail. Output only the paragraph." },
        { role: "user", content: list },
      ];
      const resp = await callAI(messages);
      const data = await resp.json();
      return new Response(JSON.stringify({ result: data.choices?.[0]?.message?.content ?? "" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ============ MODE 4: SMART SEARCH (intent → filters) ============
    if (mode === "search") {
      const { query, places, artisans } = payload;
      const tools = [{
        type: "function",
        function: {
          name: "return_matches",
          description: "Return matching place and artisan IDs",
          parameters: {
            type: "object",
            properties: {
              place_ids: { type: "array", items: { type: "string" } },
              artisan_ids: { type: "array", items: { type: "string" } },
              explanation: { type: "string", description: "1-sentence reason for the matches" },
            },
            required: ["place_ids", "artisan_ids", "explanation"],
            additionalProperties: false,
          },
        },
      }];
      const messages = [
        { role: "system", content: `Match the user's intent to relevant Mysuru places/artisans. Return up to 5 of each. Use only IDs from the provided lists.\n\nPLACES:\n${places}\n\nARTISANS:\n${artisans}` },
        { role: "user", content: query },
      ];
      const resp = await callAI(messages, { tools, tool_choice: { type: "function", function: { name: "return_matches" } } });
      const data = await resp.json();
      const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
      return new Response(JSON.stringify(args ? JSON.parse(args) : { place_ids: [], artisan_ids: [], explanation: "" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ============ MODE 5: SMART CROWD RECOMMENDER ============
    if (mode === "recommend") {
      const { highCrowdNames, alternatives, hour } = payload;
      const messages = [
        { role: "system", content: "You recommend the single best low-crowd alternative for a Mysuru tourist right now. Give: pick name + 2 sentences explaining why it's a great swap given the time of day. Format: '**<name>** — <reason>'" },
        { role: "user", content: `It is ${hour}:00. Crowded right now: ${highCrowdNames.join(", ")}. Available alternatives:\n${alternatives}` },
      ];
      const resp = await callAI(messages);
      const data = await resp.json();
      return new Response(JSON.stringify({ result: data.choices?.[0]?.message?.content ?? "" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ============ MODE 6: TRAIL GENERATOR ============
    if (mode === "generate_trail") {
      const { interests, hours, places, artisans } = payload;
      const tools = [{
        type: "function",
        function: {
          name: "build_trail",
          description: "Build a custom Mysuru cultural trail",
          parameters: {
            type: "object",
            properties: {
              name: { type: "string" },
              tagline: { type: "string" },
              narrative: { type: "string", description: "2-3 sentence intro to the trail" },
              place_ids: { type: "array", items: { type: "string" }, description: "ordered IDs from the provided list" },
              artisan_ids: { type: "array", items: { type: "string" } },
              estimated_duration: { type: "string" },
            },
            required: ["name", "tagline", "narrative", "place_ids", "artisan_ids", "estimated_duration"],
            additionalProperties: false,
          },
        },
      }];
      const messages = [
        { role: "system", content: `Build a custom cultural trail. Pick 3-5 places + 1-2 artisans matching the interests and time budget. Use only IDs from these lists.\n\nPLACES:\n${places}\n\nARTISANS:\n${artisans}` },
        { role: "user", content: `Interests: ${interests}\nTime available: ${hours} hours` },
      ];
      const resp = await callAI(messages, { tools, tool_choice: { type: "function", function: { name: "build_trail" } } });
      const data = await resp.json();
      const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
      return new Response(JSON.stringify(args ? JSON.parse(args) : null), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return errorResp(400, "Unknown mode");
  } catch (e) {
    console.error("ai-assistant error:", e);
    return errorResp(500, e instanceof Error ? e.message : "Unknown error");
  }
});
