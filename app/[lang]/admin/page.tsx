import { createClient } from "@/utils/supabase/server";
import { AdminDashboardContent } from "@/components/admin/AdminDashboardContent";
import { getDictionary } from "@/lib/i18n-server";
import { Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale || "ru");
  return {
    title: `${dict.navbar.adminPanel} | ${dict.admin.dashboard.title}`,
  };
}

export default async function AdminOverview({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang as Locale) || "ru";
  const dict = await getDictionary(locale);
  const supabase = await createClient();

  // 1. Total users
  const { count: totalUsers } = await (supabase.from("profiles") as any)
    .select("*", { count: "exact", head: true });

  // 2. Active subscriptions
  const { count: activeSubs } = await (supabase.from("subscriptions") as any)
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  // 3. Open tickets
  const { count: openTickets } = await (supabase.from("tickets") as any)
    .select("*", { count: "exact", head: true })
    .eq("status", "open");

  return (
    <AdminDashboardContent 
      dict={dict}
      stats={{
        totalUsers: totalUsers || 0,
        activeSubs: activeSubs || 0,
        openTickets: openTickets || 0
      }}
    />
  );
}
