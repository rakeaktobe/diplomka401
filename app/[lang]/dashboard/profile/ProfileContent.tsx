"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserCircle, MapPin, Phone, Hash, LogOut } from "lucide-react";

interface ProfileContentProps {
  profile: any;
  dict: any;
}

export function ProfileContent({ profile, dict }: ProfileContentProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">{dict.title}</h1>
        <p className="text-slate-500 dark:text-slate-400">{dict.subtitle}</p>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-white">
            <UserCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" /> {dict.personalData}
          </CardTitle>
          <CardDescription>
            {dict.personalDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Hash className="w-4 h-4 text-slate-400" /> {dict.clientId}
            </label>
            <Input
              readOnly
              value={profile.id.toUpperCase().split("-")[0]}
              className="bg-slate-50 dark:bg-slate-900 border-dashed font-mono text-slate-500"
            />
            <p className="text-xs text-slate-400">{dict.readOnly}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <UserCircle className="w-4 h-4 text-slate-400" /> {dict.fullName}
            </label>
            <Input readOnly value={profile.full_name || dict.notSpecified || "Не указано"} className="dark:bg-slate-900 dark:text-white" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Phone className="w-4 h-4 text-slate-400" /> {dict.phone || "Телефон"}
            </label>
            <Input readOnly value={profile.phone || dict.notSpecified || "Не указано"} className="dark:bg-slate-900 dark:text-white" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-slate-400" /> {dict.address || "Адрес подключения"}
            </label>
            <Input readOnly value={profile.address || dict.notSpecified || "Не указано"} className="dark:bg-slate-900 dark:text-white" />
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 dark:bg-slate-900/50 py-4 px-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center rounded-b-xl">
          <p className="text-xs text-slate-500">
            {dict.helpText}
          </p>
          <Button
            variant="danger"
            onClick={handleLogout}
            className="gap-2 shrink-0"
          >
            <LogOut className="w-4 h-4" /> {dict.logout || "Выйти"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
