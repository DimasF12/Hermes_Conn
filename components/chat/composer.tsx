"use client";

import { ComposerPrimitive, useAuiState } from "@assistant-ui/react";
import { SendHorizontal, Square } from "lucide-react";

export function ChatComposer() {
  const isRunning = useAuiState((s) => s.thread.isRunning);

  return (
    <ComposerPrimitive.Root className="relative flex items-end gap-2 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:border-emerald-500 transition-all">
      <ComposerPrimitive.Input
        autoFocus
        placeholder="Kirim pesan ke Hermes Agent..."
        rows={1}
        className="flex-1 max-h-36 min-h-[42px] resize-none bg-transparent px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
      />
      {isRunning ? (
        <ComposerPrimitive.Cancel
          title="Hentikan respons"
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors shrink-0 cursor-pointer"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
        </ComposerPrimitive.Cancel>
      ) : (
        <ComposerPrimitive.Send
          title="Kirim pesan"
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white transition-colors shrink-0 cursor-pointer"
        >
          <SendHorizontal className="w-4 h-4" />
        </ComposerPrimitive.Send>
      )}
    </ComposerPrimitive.Root>
  );
}
