import { createClient } from "@/utils/supabase/server";
import { convertToModelMessages, streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const runtime = 'edge';
export const maxDuration = 30;

const DEFAULT_MODEL = "gemini-1.5-flash";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("[AI Chat] GEMINI_API_KEY is missing in environment variables.");
      return new Response(
        JSON.stringify({ 
          error: "Конфигурация ИИ не завершена. Пожалуйста, попробуйте позже.",
          code: "MISSING_API_KEY"
        }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const google = createGoogleGenerativeAI({ apiKey });
    const { messages }: { messages: any[] } = await req.json();

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided" }), { status: 400 });
    }

    // Fetch live tariffs from DB with strict typing
    const supabase = await createClient();
    const { data: tariffs, error: dbError } = await (supabase.from("tariffs") as any)
      .select("name, speed_mbps, price, category, description");

    if (dbError) {
      console.error("[AI Chat] Supabase error:", dbError);
    }

    let tariffsDataText = "Данные о тарифах временно недоступны.";
    if (!dbError && tariffs && tariffs.length > 0) {
      tariffsDataText = (tariffs as any[])
        .map(
          (t: any) =>
            `- ${t.name}: ${t.speed_mbps} Мбит/с, ${t.price} ₸. (Категория: ${t.category})${
              t.description ? ". " + t.description : ""
            }`
        )
        .join("\n");
    }

    const systemPrompt = `Ты — вежливый ИИ-ассистент провайдера «ТЕЛЕКОМ». Твоя задача — помогать клиентам выбрать интернет-тариф или пакет услуг (TV+). Отвечай кратко, дружелюбно, на русском языке. 
    
Актульные тарифы для консультации:
${tariffsDataText}

ИНСТРУКЦИИ:
1. Если спрашивают о чем-то, не связанном с интернетом или провайдером, вежливо отклони тему.
2. Всегда старайся предложить конкретный тариф на основе потребностей клиента (игры, работа, кино).
3. Если клиент просит подключить услугу, объясни, что это можно сделать в личном кабинете.`;

    const result = streamText({
      model: google(DEFAULT_MODEL),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
    });

    return result.toTextStreamResponse();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    console.error("[AI Chat] Route Error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Извините, сервис временно недоступен. Мы уже работаем над этим.",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
