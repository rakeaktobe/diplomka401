import { createClient } from "@/utils/supabase/server";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { getDictionary } from "@/lib/i18n-server";
import { type Locale } from "@/lib/i18n";

export const runtime = 'edge';
export const maxDuration = 30;

const DEFAULT_MODEL = "gemini-3-flash-preview";

interface Tariff {
  name: string;
  speed_mbps: number;
  price: number;
  category: string;
  description?: string;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const { download, upload, ping, locale = 'ru' } = await req.json();

    // Load dictionary using the server-side helper
    const dict = await getDictionary(locale as Locale);

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "AI configuration missing" }), 
        { status: 500 }
      );
    }

    const google = createGoogleGenerativeAI({ apiKey });
    
    // Fetch live tariffs from DB
    const supabase = await createClient();
    const nameCol = locale === "kk" ? "name_kk" : locale === "en" ? "name_en" : "name_ru";
    const descCol = locale === "kk" ? "description_kk" : locale === "en" ? "description_en" : "description_ru";

    const { data, error: dbError } = await supabase
      .from("tariffs")
      .select(`${nameCol}, ${descCol}, speed_mbps, price, category`);

    let tariffsDataText = dict.ai_prompt.tariffs_unavailable;
    if (!dbError && data && data.length > 0) {
      tariffsDataText = (data as any[])
        .map((t) => {
          const name = t[nameCol] || t.name_ru;
          const desc = t[descCol] || t.description_ru;
          return `- ${name}: ${t.speed_mbps} ${dict.ai_recommendation.mbps}, ${t.price} ₸. (${t.category})${desc ? ". " + desc : ""}`;
        })
        .join("\n");
    }

    // Identify language name for the prompt
    const languageNames: Record<string, string> = {
      ru: "Russian",
      kk: "Kazakh",
      en: "English"
    };
    const currentLanguage = languageNames[locale] || "Russian";

    const systemPrompt = `You are a helpful expert assistant for Kazakhtelecom.
    CRITICAL: You MUST respond strictly in ${currentLanguage}.
    
    ${dict.ai_recommendation.role}
    ${dict.ai_recommendation.language_rule}
    
    ${dict.ai_recommendation.user_results}
    - ${dict.ai_recommendation.download}: ${download} ${dict.ai_recommendation.mbps}
    - ${dict.ai_recommendation.upload}: ${upload} ${dict.ai_recommendation.mbps}
    - ${dict.ai_recommendation.ping}: ${ping} ${dict.ai_recommendation.ms}
    
    ${dict.ai_recommendation.tariffs_header}
    ${tariffsDataText}
    
    ${dict.ai_recommendation.instructions}`;

    const { text } = await generateText({
      model: google(DEFAULT_MODEL),
      system: systemPrompt,
      prompt: dict.ai_recommendation.prompt_base.replace("{download}", download.toString()),
    });

    return new Response(JSON.stringify({ recommendation: text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error("[Recommendation API] Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }), 
      { status: 500 }
    );
  }
}
