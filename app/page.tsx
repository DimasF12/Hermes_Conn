import { HermesChat } from "@/components/chat/chat";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <HermesChat />
    </main>
  );
}
