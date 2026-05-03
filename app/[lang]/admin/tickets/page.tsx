import { createClient } from "@/utils/supabase/server";
import TicketList from "./TicketList";
import { Database } from "@/lib/database.types";

type TicketWithProfile = Database['public']['Tables']['tickets']['Row'] & {
  profiles: { full_name: string | null } | null;
};

export default async function AdminTicketsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang as any) || "ru";
  const supabase = await createClient();

  const { data: tickets, error } = await supabase
    .from("tickets")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tickets:", error);
  }

  return (
    <TicketList initialTickets={(tickets as TicketWithProfile[]) || []} />
  );
}
