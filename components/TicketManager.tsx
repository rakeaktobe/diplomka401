"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LifeBuoy, MessageSquarePlus, Loader2 } from "lucide-react";

// ── DB Row type ─────────────────────────────────────────────────
interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "closed";
  created_at: string;
}

interface TicketManagerProps {
  dict: any;
}

export function TicketManager({ dict }: TicketManagerProps) {
  // Stable Supabase reference — avoids re-creating the client on every render
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;
  const router = useRouter();

  const [subject, setSubject]           = useState("");
  const [description, setDescription]   = useState("");
  const [loading, setLoading]           = useState(false);
  const [tickets, setTickets]           = useState<Ticket[]>([]);
  const [fetching, setFetching]         = useState(true);

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchTickets() {
    setFetching(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setFetching(false);
      return;
    }

    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTickets(data as Ticket[]);
    }
    setFetching(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) {
      alert(dict.unauthorized);
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("tickets").insert({
      user_id: user.id,
      subject: subject.trim(),
      description: description.trim(),
      status: "open",
    });

    if (error) {
      alert(dict.error_create + ": " + error.message);
    } else {
      setSubject("");
      setDescription("");
      await fetchTickets();
    }
    setLoading(false);
  }

  const locale = (typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'ru') as 'ru' | 'kk' | 'en';

  const STATUS_LABEL: Record<Ticket["status"], string> = {
    open:        dict.open,
    in_progress: dict.inProgress,
    closed:      dict.closed,
  };
  const STATUS_VARIANT: Record<
    Ticket["status"],
    "success" | "warning" | "secondary"
  > = {
    open:        "success",
    in_progress: "warning",
    closed:      "secondary",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ── New Ticket Form ──────────────────────────────────── */}
      <Card className="lg:col-span-1 border-blue-200 dark:border-blue-900 h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-white">
            <MessageSquarePlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            {dict.newTitle}
          </CardTitle>
          <CardDescription>
            {dict.newDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-slate-200">
                {dict.subject}
              </label>
              <Input
                type="text"
                placeholder={dict.subject_placeholder}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-slate-200">
                {dict.description}
              </label>
              <textarea
                className="flex min-h-[120px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                placeholder={dict.desc_placeholder}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {dict.sending}</>
              ) : (
                dict.submitBtn
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ── Ticket History ───────────────────────────────────── */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="dark:text-white">{dict.history}</CardTitle>
        </CardHeader>
        <CardContent>
          {fetching ? (
            <div className="flex items-center justify-center py-12 text-slate-500 dark:text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              {dict.loading}
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400 border border-dashed dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/40">
              {dict.empty}
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg p-5 bg-white dark:bg-slate-900 flex flex-col sm:flex-row gap-4 justify-between items-start shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      <LifeBuoy className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-lg leading-tight mb-1">
                        {t.subject}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {t.description}
                      </p>
                      <span className="text-xs font-mono text-slate-400 dark:text-slate-500 block mt-3">
                        ID: {t.id.split("-")[0]} •{" "}
                        {new Date(t.created_at).toLocaleString(locale === 'kk' ? "kk-KZ" : locale === 'ru' ? "ru-RU" : "en-US")}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 flex sm:justify-end w-full sm:w-auto">
                    <Badge variant={STATUS_VARIANT[t.status]} className="text-xs">
                      {STATUS_LABEL[t.status]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
