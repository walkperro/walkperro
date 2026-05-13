import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function PanelShell({
  email,
  title,
  children,
}: {
  email: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-dvh bg-bone text-charcoal flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar email={email} title={title} />
        <div className="flex-1 p-8 max-w-[1200px] w-full">{children}</div>
      </div>
    </main>
  );
}
