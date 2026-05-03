import { createClient } from "@/utils/supabase/server";
import { AdminDashboardContent } from "@/components/admin/AdminDashboardContent";

export const metadata = {
  title: "Админ-панель | Обзор",
};

export default async function AdminOverview({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang as any) || "ru";
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
      stats={{
        totalUsers: totalUsers || 0,
        activeSubs: activeSubs || 0,
        openTickets: openTickets || 0
      }}
    />
  );
}
