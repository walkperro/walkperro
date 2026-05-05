import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  external?: boolean;
};

const base =
  "inline-flex items-center justify-center font-mono uppercase tracking-label text-[0.75rem] px-5 py-3 border transition-colors duration-snap ease-snap";

const variants: Record<Variant, string> = {
  primary:
    "bg-charcoal text-bone border-charcoal hover:bg-signal hover:text-charcoal hover:border-charcoal",
  ghost:
    "bg-transparent text-charcoal border-charcoal hover:bg-charcoal hover:text-bone",
};

export default function Button({
  children,
  href,
  variant = "primary",
  className,
  type = "button",
  onClick,
  external,
}: ButtonProps) {
  const cls = cn(base, variants[variant], className);

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noreferrer" className={cls}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
