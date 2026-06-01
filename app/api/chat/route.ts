import { createClient } from "@/utils/supabase/server";
import { streamText, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n-server";

export const runtime = 'edge';
export const maxDuration = 30;

const DEFAULT_MODEL = "gemini-3-flash-preview";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const { messages, locale = 'ru' }: { messages: any[], locale?: string } = await req.json();
    
    // Load dictionary using the server-side helper
    const dict = await getDictionary(locale as Locale);

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

    // Fetch live tariffs from DB
    const nameCol = locale === "kk" ? "name_kk" : locale === "en" ? "name_en" : "name_ru";
    const descCol = locale === "kk" ? "description_kk" : locale === "en" ? "description_en" : "description_ru";

    const supabase = await createClient();
    const { data: tariffs, error: dbError } = await (supabase.from("tariffs") as any)
      .select(`${nameCol}, ${descCol}, speed_mbps, price, category`);

    if (dbError) {
      console.error("[AI Chat] Supabase error:", dbError);
    }

    let tariffsDataText = dict.ai_prompt.tariffs_unavailable;
    if (!dbError && tariffs && tariffs.length > 0) {
      const lines = (tariffs as any[]).map((t: any, i: number) => {
        const name = t[nameCol] || t.name_ru;
        const desc = t[descCol] || t.description_ru;
        const speed = t.speed_mbps ? `${t.speed_mbps} Mbps` : "—";
        return `${i + 1}. ${name} | ${speed} | ${t.price} ₸/мес | ${t.category}${desc ? ` | ${desc}` : ""}`;
      });
      tariffsDataText = lines.join("\n");
    }

    const systemPrompt = `${dict.ai_prompt.role}

${dict.ai_prompt.language_rule.replace("{lang}", dict.ai_prompt.lang_name)}

${dict.ai_prompt.tariffs_header}
${tariffsDataText}

${dict.ai_prompt.instructions}

FINAL RULE: The numbered list above is the COMPLETE and ONLY list of tariffs. Do not mention any tariff name, price, or speed that is not explicitly listed above.`;

    const result = streamText({
      model: google(DEFAULT_MODEL),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
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
