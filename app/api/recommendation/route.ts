import { createClient } from "@/utils/supabase/server";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

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

    // Load dictionary for the current locale
    let dict;
    try {
      dict = require(`@/dictionaries/${locale}.json`);
    } catch {
      dict = require("@/dictionaries/ru.json");
    }

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "AI configuration missing" }), 
        { status: 500 }
      );
    }

    const google = createGoogleGenerativeAI({ apiKey });
    
    // Fetch live tariffs from DB
    const supabase = await createClient();
    const { data, error: dbError } = await supabase
      .from("tariffs")
      .select("name, speed_mbps, price, category, description");

    const tariffs = data as Tariff[] | null;

    let tariffsDataText = dict.ai_prompt.tariffs_unavailable;
    if (!dbError && tariffs && tariffs.length > 0) {
      tariffsDataText = tariffs
        .map(
          (t) =>
            `- ${t.name}: ${t.speed_mbps} ${dict.ai_recommendation.mbps}, ${t.price} ₸. (${t.category})${
              t.description ? ". " + t.description : ""
            }`
        )
        .join("\n");
    }

    const systemPrompt = `${dict.ai_recommendation.role}
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
