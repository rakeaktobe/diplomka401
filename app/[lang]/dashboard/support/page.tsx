import { TicketManager } from "@/components/TicketManager";
import { getDictionary } from "@/lib/i18n-server";
import { type Locale } from "@/lib/i18n";

export default async function SupportPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang as Locale) || "ru";
  const dict = (await getDictionary(locale)).dashboard.support;

  return (
    <div className="space-y-6 max-w-5xl">
       <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-white">{dict.title}</h1>
          <p className="text-slate-500 dark:text-slate-400">{dict.subtitle}</p>
        </div>

        {/* Client Component injected */}
        <TicketManager dict={dict} />
    </div>
  );
}
