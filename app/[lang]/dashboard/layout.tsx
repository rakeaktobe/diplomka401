import { Sidebar } from "@/components/layout/Sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LogOut, UserCircle2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import { getDictionary } from "@/lib/i18n-server";
import { type Locale } from "@/lib/i18n";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang as Locale) || "ru";
  const dict = await getDictionary(locale);
  const t = dict.dashboard;

  // ── Auth & Profile ───────────────────────────────────────────
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profileName = t.cabinet;

  if (user) {
    const { data: profile } = await (supabase.from("profiles") as any)
      .select("full_name")
      .eq("id", user.id)
      .single();

    if ((profile as any)?.full_name) {
      profileName = (profile as any).full_name;
    }
  }

  // ── Server Action: Logout ────────────────────────────────────
  const signOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login");
  };

  return (
    <div className="flex flex-1 w-full relative">
      <Sidebar dict={dict.dashboard} />

      <div className="flex flex-col flex-1 w-full bg-slate-50 dark:bg-slate-950 relative h-[calc(100vh-4rem)] overflow-y-auto transition-colors">

        {/* ── Dashboard Header ──────────────────────────────── */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 h-16 flex items-center justify-between shrink-0 transition-colors">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {t.cabinet}
          </h2>

          <div className="flex items-center gap-4">
            {/* Profile name */}
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
              <UserCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">{profileName}</span>
            </div>

            <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700" />

            {/* Logout */}
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t.logout}</span>
              </button>
            </form>
          </div>
        </header>

        {/* ── Page Content ──────────────────────────────────── */}
        <div className="p-4 md:p-8 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
