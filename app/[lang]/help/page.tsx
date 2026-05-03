import { getDictionary } from "@/lib/i18n-server";
import { type Locale } from "@/lib/i18n";
import { HelpContent } from "./HelpContent";

export default async function HelpPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang as Locale) || "ru";
  const dict = await getDictionary(locale);

  return <HelpContent t={dict.help} locale={locale} />;
}
