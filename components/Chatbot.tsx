"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { MessageCircle, X, Send, Bot, User, AlertTriangle } from "lucide-react";

const chatbotTranslations = {
  ru: {
    ariaOpen: "Открыть чат с ИИ-ассистентом",
    title: "ТЕЛЕКОМ Ассистент",
    subtitle: "Ответит на любые вопросы",
    welcome1: "Здравствуйте! Я ваш ИИ-помощник.",
    welcome2: "Помогу подобрать лучший тариф для вас.",
    errorText: "Произошла ошибка при получении ответа. Пожалуйста, попробуйте еще раз.",
    retry: "Повторить запрос",
    placeholder: "Введите ваше сообщение..."
  },
  kk: {
    ariaOpen: "ЖИ-көмекшісімен чатты ашу",
    title: "ТЕЛЕКОМ Көмекшісі",
    subtitle: "Кез келген сұраққа жауап береді",
    welcome1: "Сәлеметсіз бе! Мен сіздің ЖИ-көмекшіңізбін.",
    welcome2: "Сізге ең жақсы тарифті таңдауға көмектесемін.",
    errorText: "Жауап алу кезінде қате кетті. Қайталап көріңіз.",
    retry: "Сұрауды қайталау",
    placeholder: "Хабарламаңызды енгізіңіз..."
  },
  en: {
    ariaOpen: "Open chat with AI assistant",
    title: "TELECOM Assistant",
    subtitle: "Will answer any questions",
    welcome1: "Hello! I am your AI assistant.",
    welcome2: "I will help you pick the best tariff.",
    errorText: "An error occurred while getting a response. Please try again.",
    retry: "Retry request",
    placeholder: "Type your message..."
  }
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const params = useParams();
  const locale = (params?.lang as string) || "ru";
  const t = chatbotTranslations[locale as keyof typeof chatbotTranslations] || chatbotTranslations.ru;

  const { messages, sendMessage, status, error, regenerate } = useChat({
    api: "/api/chat",
    onError: (err: any) => {
      console.error("Chat Error:", err);
    },
  } as any) as any;

  const isLoading = status === "streaming" || status === "submitted";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    
    await sendMessage({ role: 'user', content: trimmed });
    setInput("");
  };

  const getMessageContent = (m: any): string => {
    if (m.content) return m.content;
    
    // Fallback for complex message structures in newer AI SDK versions
    if (m.parts) {
      return (m.parts as any[])
        .map(part => {
          if (part.type === 'text') return part.text;
          return '';
        })
        .join('');
    }
    
    return "";
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        }`}
        aria-label={t.ariaOpen}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out origin-bottom-right ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-blue-600 p-4 flex justify-between items-center rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3 text-white">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold leading-none">{t.title}</h3>
              <p className="text-xs text-blue-100 mt-1">{t.subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-blue-100 hover:text-white hover:bg-blue-700 p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
          {messages.length === 0 && (
            <div className="text-center text-slate-500 dark:text-slate-400 text-sm mt-8">
              <Bot className="w-10 h-10 mx-auto text-blue-300 dark:text-blue-800 mb-3 opacity-50" />
              <p>{t.welcome1}</p>
              <p>{t.welcome2}</p>
            </div>
          )}

          {messages.map((m: any) => {
            const content = getMessageContent(m);

            return (
              <div
                key={m.id}
                className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    m.role === "user"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                      : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-sm shadow-sm"
                  }`}
                >
                  {content ? content.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  )) : "..."}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center shadow-sm">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <p className="text-xs text-red-600 dark:text-red-400">
                {t.errorText}
              </p>
              <button 
                onClick={() => regenerate()}
                className="text-xs font-medium text-red-700 dark:text-red-300 underline hover:no-underline"
              >
                {t.retry}
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0 rounded-b-2xl">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              disabled={isLoading}
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white p-2.5 rounded-full transition-colors shrink-0"
            >
              <Send className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
