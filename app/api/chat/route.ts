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

    const systemPrompt = `Ты — вежливый ИИ-ассистент провайдера «ТЕЛЕКОМ». Твоя задача — помогать клиентам выбрать интернет-тариф или пакет услуг (TV+). Отвечай кратко, дружелюбно, на русском языке. Опирайся ТОЛЬКО на следующие актуальные тарифы:\n${tariffsDataText}\n\nЕсли спрашивают о чем-то, не связанном с интернетом или провайдером, вежливо отклони тему.`;

    const result = streamText({
      model: google("gemini-1.5-flash-latest"),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
    });

    // In AI SDK v6.0, toTextStreamResponse is the standard streaming method.
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
