import { createClient } from "@/utils/supabase/server";
import PaymentList from "./PaymentList";
import { getDictionary } from "@/lib/i18n-server";
import { type Locale } from "@/lib/i18n";

export default async function AdminPaymentsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang as Locale) || "ru";
  const dict = await getDictionary(locale);
  const supabase = await createClient();

  const { data: payments, error } = await supabase
    .from("payments")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching payments:", error);
  }

  return (
    <PaymentList initialPayments={(payments as any) || []} dict={dict} locale={locale} />
  );
}
