import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LogOut, UserCircle2, LayoutDashboard, Users, CreditCard, Ticket } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Get user session securely
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Verify admin role in profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin" || user.email?.toLowerCase() === "admin@telecom.kz";
  
  console.log("[Admin Layout Auth Check] User email:", user.email, "Profile role:", profile?.role, "isAdmin:", isAdmin);

  if (!isAdmin) {
    // Instead of redirecting (which might be cached by Next.js), we explicitly show an error
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-red-600">Доступ запрещен</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Этот раздел доступен только администраторам. <br />
            (Debug: Email={user.email}, Role={profile?.role})
          </p>
          <Link href="/dashboard" className="text-blue-500 hover:underline block mt-4">
            Вернуться в кабинет
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
    { name: "Дашборд", href: "/admin", icon: LayoutDashboard },
    { name: "Тарифы", href: "/admin/tariffs", icon: CreditCard },
    { name: "Пользователи", href: "/admin/users", icon: Users },
    { name: "Тикеты", href: "/admin/tickets", icon: Ticket },
  ];

  return (
    <div className="flex flex-1 w-full relative">
      {/* Dark Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col h-[calc(100vh-4rem)] border-r border-slate-800 shrink-0">
        <div className="p-4 border-b border-slate-800 h-16 flex items-center shrink-0">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="text-white text-xl font-bold tracking-wider">ADMIN</div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 text-sm shrink-0">
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 transition-colors">
            &larr; В кабинет пользователя
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-full bg-slate-50 dark:bg-slate-950 relative h-[calc(100vh-4rem)] overflow-y-auto transition-colors">
        
        {/* Admin Header */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 h-16 flex items-center justify-between shrink-0 transition-colors">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
             <h2 className="text-lg font-semibold md:hidden uppercase">Панель управления</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
              <UserCircle2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="hidden sm:inline">Admin: {profile.full_name || "Администратор"}</span>
            </div>

            <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700" />

            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Выйти</span>
              </button>
            </form>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8 flex-1 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
