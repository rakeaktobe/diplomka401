import { createClient } from "@/utils/supabase/server";
import { convertToModelMessages, streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const runtime = 'edge';
export const maxDuration = 30;

// Initialize the Google provider explicitly with our custom environment variable
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'API key is missing' }), { status: 500 });
    }

    const { messages } = await req.json();

    // Fetch live tariffs from DB to inject into system prompt
    const supabase = await createClient();
    const { data: tariffs, error } = await supabase
      .from("tariffs")
      .select("name, speed_mbps, price, category, description");

    let tariffsDataText = "Данные о тарифах временно недоступны.";
    if (!error && tariffs && tariffs.length > 0) {
      tariffsDataText = tariffs
        .map(
          (t) =>
            `- ${t.name}: ${t.speed_mbps} Мбит/с, ${t.price} ₸. (Категория: ${t.category})${
              t.description ? ". " + t.description : ""
            }`
        )
        .join("\n");
    }

    // Dynamically discover available models for this specific API key to avoid 404s
    let targetModel = "gemini-1.5-flash"; // Default fallback
    try {
      const modelRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
      if (modelRes.ok) {
        const modelData = await modelRes.json();
        const availableModels = modelData.models?.map((m: any) => m.name) || [];
        
        // Priority list of models (newest/best to oldest)
        const priority = [
          "models/gemini-2.5-flash",
          "models/gemini-2.0-flash",
          "models/gemini-1.5-flash",
          "models/gemini-1.5-flash-8b",
          "models/gemini-1.5-pro",
          "models/gemini-1.0-pro",
          "models/gemini-pro"
        ];
        
        for (const p of priority) {
          if (availableModels.includes(p)) {
            targetModel = p.replace("models/", "");
            console.log(`[AI Chat] Auto-selected model: ${targetModel}`);
            break;
          }
        }
      }
    } catch (e) {
      console.error("[AI Chat] Failed to fetch model list, using default:", e);
    }

    const systemPrompt = `Ты — вежливый ИИ-ассистент провайдера «ТЕЛЕКОМ». Твоя задача — помогать клиентам выбрать интернет-тариф или пакет услуг (TV+). Отвечай кратко, дружелюбно, на русском языке. Опирайся ТОЛЬКО на следующие актуальные тарифы:\n${tariffsDataText}\n\nЕсли спрашивают о чем-то, не связанном с интернетом или провайдером, вежливо отклони тему.`;

    const result = streamText({
      model: google(targetModel),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
    });

    // In AI SDK v6.0, we should use the top-level toDataStreamResponse function or toUIMessageStreamResponse
    return result.toUIMessageStreamResponse ? result.toUIMessageStreamResponse() : (result as any).toDataStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
