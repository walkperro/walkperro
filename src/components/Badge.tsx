import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "live";
};

export default function Badge({ children, className, tone = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono uppercase tracking-label text-[0.7rem] px-2 py-1 border",
        tone === "live"
          ? "border-charcoal bg-signal text-charcoal"
          : "border-charcoal text-charcoal",
        className
      )}
    >
      {children}
    </span>
  );
}
