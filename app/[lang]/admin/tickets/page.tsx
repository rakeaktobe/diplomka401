import { createClient } from "@/utils/supabase/server";
import TicketList from "./TicketList";
import { getDictionary } from "@/lib/i18n-server";
import { type Locale } from "@/lib/i18n";
import { Database } from "@/lib/database.types";

/**
 * Admin Tickets Page (Server Component)
 * Fetches all support tickets with author profile information.
 */
export default async function AdminTicketsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang as Locale) || "ru";
  const dict = await getDictionary(locale);
  const supabase = await createClient();

  // Fetch all tickets with author names from the profiles table.
  // The is_admin() RLS policy allows admins to see all records.
  const { data: tickets, error } = await supabase
    .from("tickets")
    .select(`
      *,
      profiles (
        full_name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[AdminTickets] Error fetching tickets:", error);
  }

  return (
    <TicketList initialTickets={(tickets as any) || []} dict={dict} locale={locale} />
  );
}
