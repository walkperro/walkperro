// src/app/layout.tsx
import "./globals.css";

export const metadata = { title: "WalkPerro", description: "Grind today. Win forever." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script defer src="https://assets.lemonsqueezy.com/lemon.js"></script>
      </head>
      <body className="bg-white text-black antialiased">
        <header className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-semibold">WalkPerro</a>
          <nav className="flex gap-6 text-sm text-zinc-700">
            <a href="/products/100-days">$100 Days</a>
            <a href="/products/wealth-hacks">Wealth Hacks</a>
            <a href="/products/25-prompts">25 Prompts</a>
            <a href="/products/all-in-one-bundle">Bundle</a>
          </nav>
        </header>
        {children}
        <footer className="mt-16 border-t">
          <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-zinc-600 flex flex-wrap gap-6 justify-between">
            <span>© {new Date().getFullYear()} WalkPerro</span>
            <div className="flex gap-6">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <a href="/contact">Contact</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
