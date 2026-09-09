import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvisoSimulacao, Logo } from "@/components/app-shell";
import { useAuth, rotaPorPapel } from "@/lib/auth";
import type { Papel } from "@/lib/mock";

export const Route = createFileRoute("/login/$tipo")({
  head: () => ({
    meta: [
      { title: "Entrar | CryptoFlow — simulador educacional de Bitcoin" },
      {
        name: "description",
        content:
          "Acesse o ambiente de simulação CryptoFlow como cliente, empresa ou administrador. Dados fictícios, sem operações reais.",
      },
      { property: "og:title", content: "Entrar no CryptoFlow" },
      { property: "og:description", content: "Login do simulador educacional de investimentos em Bitcoin." },
    ],
  }),
  component: Login,
});

const CONFIG: Record<Papel, { titulo: string; sub: string; icone: typeof User; demo: string }> = {
  cliente: { titulo: "Área do cliente", sub: "Carteira simulada, cotação e ordens fictícias", icone: User, demo: "cliente@exemplo.com.br" },
  empresa: { titulo: "Área da empresa", sub: "Recebimentos, pedidos, relatórios e equipe", icone: Building2, demo: "financeiro@nordestepag.com.br" },
  admin: { titulo: "Área administrativa", sub: "Gestão de usuários, empresas e indicadores", icone: ShieldCheck, demo: "admin@cryptoflow.dev" },
};

function Login() {
  const { tipo } = Route.useParams();
  const papel = (["cliente", "empresa", "admin"].includes(tipo) ? tipo : "cliente") as Papel;
  const cfg = CONFIG[papel];
  const Icone = cfg.icone;
  const { entrar } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(cfg.demo);
  const [senha, setSenha] = useState("simulacao123");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between border-r border-border bg-card p-10 lg:flex">
        <div className="absolute inset-0 malha-fina opacity-40" />
        <div className="relative">
          <Link to="/"><Logo /></Link>
        </div>
        <div className="relative space-y-4">
          <h2 className="font-display text-3xl font-semibold leading-tight">
            Aprenda a investir em Bitcoin sem arriscar um real.
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            O CryptoFlow reproduz a jornada completa de uma fintech de criptoativos — cotação,
            ordens, liquidação, relatórios e métricas de Data Science — em um ambiente totalmente
            simulado.
          </p>
          <AvisoSimulacao className="max-w-md" />
        </div>
        <p className="relative text-xs text-muted-foreground">© 2026 CryptoFlow Educação</p>
      </div>

      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm space-y-6">
          <div className="lg:hidden"><Link to="/"><Logo /></Link></div>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              <Icone className="size-3.5" /> {papel === "admin" ? "Administrador" : papel === "empresa" ? "Empresa (B2B)" : "Cliente (B2C)"}
            </span>
            <h1 className="mt-3 font-display text-2xl font-semibold">{cfg.titulo}</h1>
            <p className="text-sm text-muted-foreground">{cfg.sub}</p>
          </div>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              entrar({
                nome: papel === "empresa" ? "Marina Duarte" : papel === "admin" ? "Equipe CryptoFlow" : "Ana Beatriz Rocha",
                email,
                papel,
                organizacao: papel === "empresa" ? "Nordeste Pagamentos" : undefined,
              });
              navigate({ to: rotaPorPapel[papel] });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">{papel === "empresa" ? "E-mail corporativo" : "E-mail"}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">Entrar no simulador</Button>
          </form>

          <p className="text-xs text-muted-foreground">
            Credenciais de demonstração já preenchidas. Qualquer e-mail e senha entram no ambiente
            fictício.
          </p>

          <div className="space-y-2 border-t border-border pt-4 text-sm">
            {papel !== "admin" && (
              <p className="text-muted-foreground">
                Ainda não tem conta?{" "}
                <Link to="/cadastro/$tipo" params={{ tipo: papel }} className="text-accent hover:underline">
                  Criar cadastro de {papel}
                </Link>
              </p>
            )}
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              {(["cliente", "empresa", "admin"] as Papel[])
                .filter((p) => p !== papel)
                .map((p) => (
                  <Link key={p} to="/login/$tipo" params={{ tipo: p }} className="hover:text-foreground">
                    Entrar como {p}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
