import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Overview" },
  { to: "/architecture", label: "Figures" },
  { to: "/simulator", label: "Simulator" },
  { to: "/claims", label: "Claims" },
  { to: "/research", label: "Research" },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link to="/" className="font-mono text-sm font-bold tracking-widest text-primary">
            UCAS<span className="text-muted-foreground">/OSMP</span>
          </Link>
          <nav className="flex flex-wrap gap-4">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: true }}
                className="label-mono hover:text-foreground"
                activeProps={{ className: "label-mono !text-primary" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 label-mono">
          Patent drafting package for attorney review — not a filed application. Simulator uses synthetic data; no
          safety or certification claim.
        </div>
      </footer>
    </div>
  );
}

export function PageTitle({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-8">
      <div className="label-mono text-primary">{kicker}</div>
      <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">{title}</h1>
      {children && <p className="mt-4 max-w-3xl text-muted-foreground">{children}</p>}
    </div>
  );
}
