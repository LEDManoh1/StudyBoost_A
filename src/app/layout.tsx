import type { Metadata } from "next";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "StudyBoost AI | Elevate Your Learning",
  description: "AI-powered educational tools for students and educators. Generate flashcards, summaries, and exam questions instantly.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[var(--background)] text-[var(--foreground)] font-inter antialiased">
        <ServiceWorkerRegister />
        <nav className="glass-nav sticky top-0 z-50 backdrop-blur-md bg-[var(--glass)] border-b border-[var(--glass-border)] px-8 py-4">
          <div className="max-w-[1200px] mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold m-0 text-gradient">StudyBoost AI</h1>
            <div className="flex gap-8 items-center hidden md:flex">
              <a href="/dashboard" className="hover:text-[var(--primary)] transition-colors">Dashboard</a>
              <a href="/pricing" className="hover:text-[var(--primary)] transition-colors">Pricing</a>
              <button className="btn-primary transform hover:scale-105 transition-transform">Get Started</button>
            </div>
            {/* Mobile menu trigger could be here, but Sidebar handles dashboard nav on mobile */}
          </div>
        </nav>
        <main className="min-h-[calc(100vh-80px)]">
          {children}
        </main>
        <footer className="py-16 md:py-24 border-t border-[var(--glass-border)] text-center text-[var(--foreground)] opacity-60">
          <p>&copy; 2026 StudyBoost AI. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
