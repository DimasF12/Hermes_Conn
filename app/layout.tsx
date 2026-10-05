import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "./viewer.css";

export const metadata: Metadata = {
  title: "AIKO - AI Sales Intelligence",
  description: "C-Level Command Center — pratinjau laporan intelijen eksekutif dalam format HTML interaktif.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body>
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try { document.documentElement.dataset.theme = localStorage.getItem('aiko-ui-theme') === 'dark' ? 'dark' : 'light'; } catch (_) {}`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
