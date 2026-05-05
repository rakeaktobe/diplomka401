"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Loader2, AlertCircle } from "lucide-react";
import { getDictionaryClient } from "@/lib/i18n";

export default function LoginPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const locale = (lang as any) || "ru";
  const dict = getDictionaryClient(locale);
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMsg(dict.auth.errInvalidCreds);
        } else {
          setErrorMsg(dict.auth.errGeneral);
        }
        setLoading(false);
      } else {
        const user = data?.user;
        if (user) {
          if (user.email?.toLowerCase().trim() === "admin@telecom.kz") {
            router.push(`/${locale}/admin`);
            router.refresh();
            return;
          }
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
          
          if (profile?.role === "admin") {
            router.push(`/${locale}/admin`);
            router.refresh();
            return;
          }
        }
        
        router.push(`/${locale}/dashboard`);
        router.refresh();
      }
    } catch {
      setErrorMsg(dict.auth.errNetwork);
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <Link href={`/${locale}`} className="flex items-center gap-2 text-blue-600 mb-8">
        <Activity className="h-8 w-8" />
        <span className="text-2xl font-bold tracking-tight">{dict.auth.brandName}</span>
      </Link>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">{dict.auth.loginTitle}</CardTitle>
          <CardDescription className="text-center">
            {dict.auth.loginSubtitle}
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
                {dict.auth.email}
              </label>
              <Input 
                id="email" 
                type="email" 
                placeholder={dict.auth.emailPlaceholder} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none" htmlFor="password">
                  {dict.auth.password}
                </label>
                <Link href={`/${locale}/help`} className="text-sm text-blue-600 hover:underline">
                  {dict.auth.forgotPwd}
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
               {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {dict.auth.loginLoading}</> : dict.auth.loginBtn}
            </Button>
            <div className="text-sm text-center text-slate-500">
              {dict.auth.noAccount}{" "}
              <Link href={`/${locale}/register`} className="text-blue-600 hover:underline">
                {dict.auth.registerBtn}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

