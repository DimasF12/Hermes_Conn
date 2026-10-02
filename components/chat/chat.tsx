"use client";

import { useLocalRuntime, AssistantRuntimeProvider, ThreadPrimitive } from "@assistant-ui/react";
import { ChatMessage } from "./message";
import { ChatComposer } from "./composer";
import { Bot, Sparkles, Activity } from "lucide-react";

export function HermesChat() {
  const runtime = useLocalRuntime({
    async *run({ messages, abortSignal }) {
      const formattedMessages = messages.map((m) => {
        const text = m.content
          .filter((part) => part.type === "text")
          .map((part) => (part as { type: "text"; text: string }).text)
          .join("");
        return {
          role: m.role as "user" | "assistant" | "system",
          content: text,
        };
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: formattedMessages }),
        signal: abortSignal,
      });

      if (!response.ok) {
        let errorMsg = "Unable to connect to Hermes Agent.";
        try {
          const errData = await response.json();
          if (errData?.error?.message) {
            errorMsg = errData.error.message;
          }
        } catch {
          // Keep default message if json parsing fails
        }
        throw new Error(errorMsg);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Unable to read response stream from Hermes Agent.");
      }

      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulatedText += decoder.decode(value, { stream: true });
        yield {
          content: [{ type: "text", text: accumulatedText }],
        };
      }
    },
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex flex-col h-screen w-full max-w-4xl mx-auto px-4 sm:px-6 py-4">
        {/* Header */}
        <header className="flex items-center justify-between py-3 border-b border-zinc-200/80 dark:border-zinc-800/80 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Hermes Chat
                </h1>
                <span className="text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  MVP
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Autonomous Agent Connected
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Port 8000</span>
          </div>
        </header>

        {/* Chat Thread */}
        <ThreadPrimitive.Root className="flex flex-col flex-1 h-[calc(100vh-140px)] min-h-0">
          <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto pr-1 space-y-4">
            <ThreadPrimitive.Empty>
              <div className="flex flex-col items-center justify-center h-full min-h-[360px] text-center px-4 my-auto">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20 shadow-xs">
                  <Bot className="w-7 h-7" />
                </div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Hermes AI Assistant
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mt-1 mb-6">
                  Mulai percakapan dengan Hermes Agent. Ajukan pertanyaan atau delegasikan instruksi.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-md text-left">
                  <div className="p-3 rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 text-xs text-zinc-600 dark:text-zinc-300 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Ringkasan performa sistem operasional</span>
                  </div>
                  <div className="p-3 rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 text-xs text-zinc-600 dark:text-zinc-300 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Tanyakan analisis data terbaru</span>
                  </div>
                </div>
              </div>
            </ThreadPrimitive.Empty>

            <ThreadPrimitive.Messages components={{ Message: ChatMessage }} />
          </ThreadPrimitive.Viewport>

          <ThreadPrimitive.ViewportFooter className="pt-3">
            <ChatComposer />
          </ThreadPrimitive.ViewportFooter>
        </ThreadPrimitive.Root>
      </div>
    </AssistantRuntimeProvider>
  );
}
