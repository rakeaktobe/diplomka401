"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Loader2, AlertCircle } from "lucide-react";

export default function RegisterPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const locale = (lang as any) || "ru";
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });

      if (error) {
        if (error.message.includes("User already registered") || error.message.includes("already exists")) {
          setErrorMsg("Пользователь с таким email уже существует.");
        } else if (error.message.includes("Password should be at least 6 characters")) {
          setErrorMsg("Пароль должен содержать минимум 6 символов.");
        } else {
          setErrorMsg("Ошибка регистрации. " + error.message);
        }
        setLoading(false);
      } else {
        router.push(`/${locale}/dashboard`);
        router.refresh();
      }
    } catch {
      setErrorMsg("Ошибка сети. Проверьте подключение к базе данных или настройки VPN.");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <Link href={`/${locale}`} className="flex items-center gap-2 text-blue-600 mb-8 mt-12">
        <Activity className="h-8 w-8" />
        <span className="text-2xl font-bold tracking-tight">ТЕЛЕКОМ</span>
      </Link>
      
      <Card className="w-full max-w-md mb-12">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Создать аккаунт</CardTitle>
          <CardDescription className="text-center">
            Введите ваши данные для регистрации в системе
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
             {errorMsg && (
               <div className="p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded flex items-center gap-2">
                 <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
               </div>
             )}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="fullName">ФИО</label>
              <Input 
                id="fullName" 
                placeholder="Иванов Иван Иванович" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="phone">Телефон</label>
              <Input 
                id="phone" 
                type="tel"
                placeholder="+7 (700) 000-0000" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
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
              <label className="text-sm font-medium leading-none" htmlFor="password">Пароль</label>
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
               {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Создание...</> : "Зарегистрироваться"}
            </Button>
            <div className="text-sm text-center text-slate-500">
              Уже есть аккаунт?{" "}
              <Link href={`/${locale}/login`} className="text-blue-600 hover:underline">
                Войти
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
