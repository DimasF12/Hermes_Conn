"use client";

import {
  MessagePrimitive,
  MessagePartPrimitive,
  ActionBarPrimitive,
  ErrorPrimitive,
} from "@assistant-ui/react";
import { User, Bot, Copy, Check } from "lucide-react";

export function ChatMessage() {
  return (
    <MessagePrimitive.Root className="w-full">
      {/* User Message */}
      <MessagePrimitive.If user>
        <div className="flex justify-end items-start gap-2.5 my-3">
          <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-sm bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-4 py-2.5 text-sm shadow-sm">
            <MessagePrimitive.Parts
              components={{
                Text: () => (
                  <MessagePartPrimitive.Text className="whitespace-pre-wrap break-words leading-relaxed" />
                ),
              }}
            />
          </div>
          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shrink-0 text-xs font-medium mt-0.5">
            <User className="w-4 h-4" />
          </div>
        </div>
      </MessagePrimitive.If>

      {/* Assistant Message */}
      <MessagePrimitive.If assistant>
        <div className="flex justify-start items-start gap-3 my-4">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-xs mt-0.5">
            <Bot className="w-4 h-4" />
          </div>
          <div className="group relative max-w-[90%] sm:max-w-[85%] rounded-2xl rounded-tl-sm bg-zinc-100/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 px-4 py-3 text-sm border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
              Hermes Agent
            </div>
            <MessagePrimitive.Parts
              components={{
                Text: () => (
                  <MessagePartPrimitive.Text className="whitespace-pre-wrap break-words leading-relaxed text-zinc-800 dark:text-zinc-200" />
                ),
              }}
            />
            <MessagePrimitive.Error>
              <ErrorPrimitive.Message className="text-rose-500 dark:text-rose-400 text-xs mt-2 block font-medium" />
            </MessagePrimitive.Error>

            <ActionBarPrimitive.Root className="flex items-center gap-1 mt-2 text-zinc-400">
              <ActionBarPrimitive.Copy className="p-1 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors rounded cursor-pointer">
                <MessagePrimitive.If copied>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                </MessagePrimitive.If>
                <MessagePrimitive.If copied={false}>
                  <Copy className="w-3.5 h-3.5" />
                </MessagePrimitive.If>
              </ActionBarPrimitive.Copy>
            </ActionBarPrimitive.Root>
          </div>
        </div>
      </MessagePrimitive.If>
    </MessagePrimitive.Root>
  );
}
