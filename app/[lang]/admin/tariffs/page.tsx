import { createClient } from "@/utils/supabase/server";
import TariffList from "./TariffList";

export default async function AdminTariffsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang as any) || "ru";
  const supabase = await createClient();

  const { data: tariffs, error } = await supabase
    .from("tariffs")
    .select("id, name_ru, price, speed_mbps, description_ru, category")
    .order("price");

  if (error) {
    console.error("Error fetching tariffs:", error);
  }

  return (
    <TariffList initialTariffs={(tariffs as any) || []} />
  );
}
