import { createClient } from "@/utils/supabase/server";
import TariffList from "./TariffList";
import { getDictionary } from "@/lib/i18n-server";
import { type Locale } from "@/lib/i18n";

export default async function AdminTariffsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang as Locale) || "ru";
  const dict = await getDictionary(locale);
  const supabase = await createClient();

  const { data: tariffs, error } = await supabase
    .from("tariffs")
    .select("id, name_ru, price, speed_mbps, description_ru, category")
    .order("price");

  if (error) {
    console.error("Error fetching tariffs:", error);
  }

  return (
    <TariffList initialTariffs={(tariffs as any) || []} dict={dict} />
  );
}
