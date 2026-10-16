import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
      <span className="text-primary">[</span>
      {children}
      <span className="text-primary">]</span>
    </p>
  );
}

export function Bar({ label, v }: { label: string; v: number }) {
  return (
    <div>
      <div className="flex justify-between text-[11px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono tabular">{v}</span>
      </div>
      <div className="mt-1.5 h-1 bg-secondary">
        <div className="h-full bg-primary" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
