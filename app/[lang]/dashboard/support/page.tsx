import { TicketManager } from "@/components/TicketManager";

export const metadata = {
  title: "Поддержка",
  description: "Служба заботы о клиентах и история обращений.",
};

export default function SupportPage() {
  return (
    <div className="space-y-6 max-w-5xl">
       <div>
          <h1 className="text-3xl font-bold tracking-tight">Поддержка</h1>
          <p className="text-slate-500">Служба заботы о клиентах и история обращений.</p>
        </div>

        {/* Client Component injected */}
        <TicketManager />
    </div>
  );
}
