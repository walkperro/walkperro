// Admin root layout — CSRF cookie is issued by middleware (Next.js 15+ doesn't
// allow setting cookies from server components). Layout just passes through.
export const dynamic = "force-dynamic";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
