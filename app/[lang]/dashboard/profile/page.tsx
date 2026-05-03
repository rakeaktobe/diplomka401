import { createClient } from "@/utils/supabase/server";
import { getDictionary } from "@/lib/i18n-server";
import { type Locale } from "@/lib/i18n";
import { ProfileContent } from "./ProfileContent";
import { redirect } from "next/navigation";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang as Locale) || "ru";
  const dict = (await getDictionary(locale)).dashboard;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return <ProfileContent profile={profile} dict={dict.profile} />;
}
