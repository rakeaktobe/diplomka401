import { createClient } from "@/utils/supabase/server";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { getDictionary } from "@/lib/i18n-server";
import { type Locale } from "@/lib/i18n";

export const metadata = {
  title: "Личный кабинет",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang as Locale) || "ru";
  const dict = await getDictionary(locale);
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch profile and subscriptions joined with tariffs
  const [profileResult, subsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id || "")
      .single(),
    supabase
      .from("subscriptions")
      .select(`id, status, next_billing_date, tariffs ( id, name, speed_mbps, price, description, category )`)
      .eq("user_id", user?.id || ""),
  ]);

  const profile       = profileResult.data;
  const subscriptions = subsResult.data ?? [];

  return (
    <DashboardContent 
      profile={profile} 
      subscriptions={subscriptions} 
      user={user} 
      dict={dict.dashboard}
    />
  );
}
