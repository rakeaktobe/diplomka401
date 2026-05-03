import { createClient } from "@/utils/supabase/server";
import UserTable from "./UserTable";
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
  const locale = (lang as any) || "ru";
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Управление пользователями
        </h1>
      </div>

      <UserTable 
        users={(users as any) || []} 
        tariffs={tariffs || []} 
      />
    </div>
  );
}
