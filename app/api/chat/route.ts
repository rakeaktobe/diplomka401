import { createClient } from "@/utils/supabase/server";
import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { type Locale } from "@/lib/i18n";

export const runtime = 'edge';
export const maxDuration = 30;

const DEFAULT_MODEL = "gemini-3-flash-preview";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const { messages, locale = 'ru' }: { messages: any[], locale?: string } = await req.json();
    
    // Load dictionary for the current locale
    let dict;
    try {
      dict = require(`@/dictionaries/${locale}.json`);
    } catch {
      dict = require("@/dictionaries/ru.json");
    }

    if (!apiKey) {
      console.error("[AI Chat] GEMINI_API_KEY is missing in environment variables.");
      return new Response(
        JSON.stringify({ 
          error: dict.chatbot.configError,
          code: "MISSING_API_KEY"
        }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const google = createGoogleGenerativeAI({ apiKey });

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

    let tariffsDataText = dict.ai_prompt.tariffs_unavailable;
    if (!dbError && tariffs && tariffs.length > 0) {
      tariffsDataText = (tariffs as any[])
        .map(
          (t: any) =>
            `- ${t.name}: ${t.speed_mbps} Mbps, ${t.price} ₸. (${t.category})${
              t.description ? ". " + t.description : ""
            }`
        )
        .join("\n");
    }

    const systemPrompt = `${dict.ai_prompt.role}

${dict.ai_prompt.language_rule.replace("{lang}", dict.ai_prompt.lang_name)}

${dict.ai_prompt.tariffs_header}
${tariffsDataText}

${dict.ai_prompt.instructions}`;

    const result = streamText({
      model: google(DEFAULT_MODEL),
      system: systemPrompt,
      messages: messages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    console.error("[AI Chat] Route Error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Internal Error",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
