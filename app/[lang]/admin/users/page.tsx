import { createClient } from "@/utils/supabase/server";
import UserTable from "./UserTable";
import { getDictionary } from "@/lib/i18n-server";
import { type Locale } from "@/lib/i18n";
import { Database } from "@/lib/database.types";

type UserProfile = Database['public']['Tables']['profiles']['Row'] & {
  subscriptions: (Database['public']['Tables']['subscriptions']['Row'] & {
    tariffs: Database['public']['Tables']['tariffs']['Row'] | null;
  })[];
};

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang as Locale) || "ru";
  const dict = await getDictionary(locale);
  const supabase = await createClient();

  // 1. Fetch users with their profiles and active subscriptions (joined with tariffs)
  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select(`
      *,
      subscriptions(*, tariffs(*))
    `)
    .order("full_name");

  // 2. Fetch all available tariffs for the assignment modal
  const { data: tariffs, error: tariffsError } = await supabase
    .from("tariffs")
    .select("id, name, price")
    .order("name");

  if (usersError || tariffsError) {
    console.error("Error fetching admin data:", usersError || tariffsError);
  }

  return (
    <div className="space-y-6">
      <UserTable
        users={(users as any) || []}
        tariffs={tariffs || []}
        dict={dict}
      />
    </div>
  );
}
