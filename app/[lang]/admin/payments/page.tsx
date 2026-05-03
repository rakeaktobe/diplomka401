import { createClient } from "@/utils/supabase/server";
import PaymentList from "./PaymentList";

export default async function AdminPaymentsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang as any) || "ru";
  const supabase = await createClient();

  const { data: payments, error } = await supabase
    .from("payments")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching payments:", error);
  }

  return (
    <PaymentList initialPayments={(payments as any) || []} />
  );
}
