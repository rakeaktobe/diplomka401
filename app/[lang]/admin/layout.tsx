import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LogOut, UserCircle2, LayoutDashboard, Users, CreditCard, Ticket, ArrowLeft, Shield, Banknote } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n-server";
import { type Locale } from "@/lib/i18n";

export default async function AdminLayout({
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
  const supabase = await createClient();

  // 1. Get user session securely
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Verify admin role in profiles table
  const { data: profile } = await (supabase.from("profiles") as any)
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const isAdmin = (profile as any)?.role === "admin" || user.email?.toLowerCase().trim() === "admin@telecom.kz";
  
  if (!isAdmin) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="text-center space-y-6 max-w-md p-10 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-red-200 dark:border-red-900/30">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center">
             <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">{locale === 'ru' ? "Доступ запрещен" : locale === 'kk' ? "Рұқсат жоқ" : "Access Denied"}</h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            {locale === 'ru' ? "Этот раздел доступен только авторизованным администраторам системы." : locale === 'kk' ? "Бұл бөлім тек жүйенің авторизацияланған әкімшілеріне ғана қолжетімді." : "This section is only available to authorized system administrators."}
          </p>
          <Link href="/dashboard" className="block">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              {locale === 'ru' ? "Вернуться в кабинет" : locale === 'kk' ? "Кабинетке оралу" : "Return to dashboard"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 3. Admin sign out action
  const signOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login");
  };

  const navItems = [
    { name: t.nav.home, href: "/admin", icon: LayoutDashboard },
    { name: t.nav.subscriptions, href: "/admin/tariffs", icon: CreditCard },
    { name: t.client, href: "/admin/users", icon: Users },
    { name: t.nav.support, href: "/admin/tickets", icon: Ticket },
    { name: t.nav.payments, href: "/admin/payments", icon: Banknote },
  ];

  return (
    <div className="flex flex-1 w-full relative bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Premium Admin Sidebar */}
      <aside className="w-72 bg-slate-900 text-slate-300 hidden md:flex flex-col h-[calc(100vh-4rem)] border-r border-slate-800 shrink-0 sticky top-16">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-black tracking-[0.3em] text-white uppercase">Operations</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-800 hover:text-white transition-all group"
            >
              <item.icon className="w-5 h-5 text-slate-500 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm font-bold">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors group">
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
            {t.cabinet}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-full relative">
        
        {/* Admin Header */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-8 h-16 flex items-center justify-between shrink-0 transition-colors">
          <div className="flex items-center gap-4">
             <div className="hidden md:block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Role</span>
                <div className="text-xs font-bold text-red-600 flex items-center gap-1">
                   <Shield className="w-3 h-3" /> Root Administrator
                </div>
             </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logged in as</div>
                 <div className="text-xs font-bold dark:text-white">{profile?.full_name || "Admin"}</div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                 <UserCircle2 className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </div>
            </div>

            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800" />

            <form action={signOut}>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="font-bold">{t.logout}</span>
              </Button>
            </form>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 flex-1 w-full bg-slate-50 dark:bg-slate-950 transition-colors">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
