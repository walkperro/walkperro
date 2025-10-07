// src/app/layout.tsx
export const metadata = { title: "WalkPerro", description: "Grind today. Win forever." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Lemon Squeezy modal script */}
        <script defer src="https://assets.lemonsqueezy.com/lemon.js"></script>
      </head>
      <body className="bg-white text-black antialiased">{children}</body>
    </html>
  );
}
