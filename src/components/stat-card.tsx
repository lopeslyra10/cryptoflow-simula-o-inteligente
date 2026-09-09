import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  rotulo,
  valor,
  detalhe,
  tom = "neutro",
  icone,
}: {
  rotulo: string;
  valor: string;
  detalhe?: string;
  tom?: "neutro" | "alta" | "baixa";
  icone?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{rotulo}</p>
        {icone}
      </div>
      <p className="mt-2 font-display text-2xl font-semibold">{valor}</p>
      {detalhe && (
        <p
          className={cn(
            "mt-1 text-xs",
            tom === "alta" && "text-success",
            tom === "baixa" && "text-destructive",
            tom === "neutro" && "text-muted-foreground",
          )}
        >
          {detalhe}
        </p>
      )}
    </div>
  );
}

export function Painel({
  titulo,
  descricao,
  children,
  className,
}: {
  titulo: string;
  descricao?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-xl border border-border bg-card p-4", className)}>
      <header className="mb-4">
        <h3 className="font-display text-base font-semibold">{titulo}</h3>
        {descricao && <p className="text-xs text-muted-foreground">{descricao}</p>}
      </header>
      {children}
    </section>
  );
}
