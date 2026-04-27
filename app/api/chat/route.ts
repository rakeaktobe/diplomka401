import { createClient } from "@/utils/supabase/server";
import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const supabase = await createClient();
    const { data: tariffs, error } = await supabase.from("tariffs").select("*");
    
    let tariffsDataText = "Данные о тарифах временно недоступны.";
    if (!error && tariffs) {
      tariffsDataText = tariffs.map(t => 
        `- ${t.name}: ${t.speed} Мбит/с, ${t.price} ₸. (Тип: ${t.type})${t.features && t.features.length ? " Особенности: " + t.features.join(", ") : ""}`
      ).join("\n");
    }

    const systemPrompt = `Ты — вежливый ИИ-ассистент провайдера «ТЕЛЕКОМ». Твоя задача — помогать клиентам выбрать интернет-тариф или пакет услуг (TV+). Отвечай кратко, дружелюбно, на русском языке. Опирайся ТОЛЬКО на следующие актуальные тарифы:
${tariffsDataText}

Если спрашивают о чем-то, не связанном с интернетом или провайдером, вежливо отклони тему.`;

    const result = streamText({
      model: google("gemini-1.5-flash"),
      system: systemPrompt,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
