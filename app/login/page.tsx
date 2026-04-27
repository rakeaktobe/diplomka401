"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Loader2, AlertCircle } from "lucide-react";

// login is a Client Component — metadata must be exported from a Server Component wrapper
// but since this is a standalone auth page we declare it here and Next.js will hoist it.

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMsg("Неверный email или пароль.");
        } else {
          setErrorMsg("Ошибка авторизации. Попробуйте снова.");
        }
        setLoading(false);
      } else {
        // Automatically redirect admins to the admin panel
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          if (user.email?.toLowerCase() === "admin@telecom.kz") {
            router.push("/admin");
            router.refresh();
            return;
          }
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
          
          if (profile?.role === "admin") {
            router.push("/admin");
            router.refresh();
            return;
          }
        }
        
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setErrorMsg("Ошибка сети. Проверьте подключение к базе данных.");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 text-blue-600 mb-8">
        <Activity className="h-8 w-8" />
        <span className="text-2xl font-bold tracking-tight">ТЕЛЕКОМ</span>
      </Link>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">С возвращением</CardTitle>
          <CardDescription className="text-center">
            Введите ваши данные для входа в личный кабинет
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {errorMsg && (
               <div className="p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded flex items-center gap-2">
                 <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
               </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">
                Email
              </label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none" htmlFor="password">
                  Пароль
                </label>
                <Link href="/help" className="text-sm text-blue-600 hover:underline">
                  Забыли пароль?
                </Link>
              </div>
              <Input 
                 id="password" 
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                 disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
               {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Вход...</> : "Войти"}
            </Button>
            <div className="text-sm text-center text-slate-500">
              Нет аккаунта?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Зарегистрироваться
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
