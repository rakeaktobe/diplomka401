import { createClient } from "@/utils/supabase/server";
import { convertToModelMessages, streamText } from "ai";
import { google } from "@ai-sdk/google";

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'No API Key' }), { status: 500 });
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

    const systemPrompt = `Ты — вежливый ИИ-ассистент провайдера «ТЕЛЕКОМ». Твоя задача — помогать клиентам выбрать интернет-тариф или пакет услуг. Отвечай кратко, дружелюбно, на русском языке. Опирайся ТОЛЬКО на следующие актуальные тарифы:\n${tariffsDataText}\n\nЕсли спрашивают о чем-то, не связанном с интернетом или провайдером, вежливо отклони тему.`;

    const result = streamText({
      model: google("gemini-1.5-flash"),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
