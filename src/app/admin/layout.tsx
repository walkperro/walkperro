import Link from "next/link";

const adminNavLinks = [
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/leadops", label: "LeadOps" },
  { href: "/admin/leadops/sources", label: "Sources" },
  { href: "/admin/leadops/categories", label: "Categories" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="adminShellNavWrap">
        <div className="adminShellNav">
          <div className="adminShellBrand">
            <span>WalkPerro</span>
            <small>Admin</small>
          </div>
          <nav className="adminShellLinks" aria-label="Admin navigation">
            {adminNavLinks.map((link) => (
              <Link key={link.href} href={link.href} className="adminShellLink">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      {children}
    </>
  );
}
