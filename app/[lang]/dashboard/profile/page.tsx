"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserCircle, MapPin, Phone, Hash, LogOut, Loader2 } from "lucide-react";

interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  address: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) setProfile(data as UserProfile);
      setLoading(false);
    }
    loadProfile();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-kt-blue" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Настройки профиля</h1>
        <p className="text-slate-500">Управление личными данными и аккаунтом.</p>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-kt-blue" /> Персональные данные
          </CardTitle>
          <CardDescription>
            Ваша контактная информация для связи и подключения услуг.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Hash className="w-4 h-4 text-slate-400" /> ID Абонента
            </label>
            <Input
              readOnly
              value={profile.id.toUpperCase().split("-")[0]}
              className="bg-slate-50 dark:bg-slate-900 border-dashed font-mono text-slate-500"
            />
            <p className="text-xs text-slate-400">Только для чтения</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <UserCircle className="w-4 h-4 text-slate-400" /> ФИО
            </label>
            <Input readOnly value={profile.full_name || "Не указано"} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Phone className="w-4 h-4 text-slate-400" /> Телефон
            </label>
            <Input readOnly value={profile.phone || "Не указано"} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-slate-400" /> Адрес подключения
            </label>
            <Input readOnly value={profile.address || "Не указано"} />
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 dark:bg-slate-900/50 py-4 px-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center rounded-b-xl">
          <p className="text-xs text-slate-500">
            Для изменения данных обратитесь в колл-центр 160.
          </p>
          <Button
            variant="danger"
            onClick={handleLogout}
            className="gap-2 shrink-0"
          >
            <LogOut className="w-4 h-4" /> Выйти
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
