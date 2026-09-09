import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  Building2,
  GraduationCap,
  LineChart as LineIcon,
  Lock,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { AvisoSimulacao, Logo } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { PRECO_BTC, SERIE, VARIACAO_24H, VARIACAO_30D, brl, dataBR, pct } from "@/lib/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CryptoFlow — simulador educacional de investimentos em Bitcoin" },
      {
        name: "description",
        content:
          "Plataforma fintech educacional para simular investimentos em Bitcoin com dados fictícios. Painéis para clientes, empresas e administradores, com métricas de Data Science.",
      },
      { property: "og:title", content: "CryptoFlow — simulador educacional de Bitcoin" },
      {
        property: "og:description",
        content:
          "Simule compra e venda de Bitcoin, acompanhe carteira, pedidos e indicadores. Ambiente 100% fictício, sem operações reais.",
      },
    ],
  }),
  component: Landing,
});

const RECURSOS = [
  { icone: LineIcon, titulo: "Cotação e ordens simuladas", texto: "Série histórica fictícia de Bitcoin, livro de ofertas ilustrativo e execução de compra e venda sem risco." },
  { icone: BarChart3, titulo: "Métricas de Data Science", texto: "Volatilidade, drawdown, Sharpe, rentabilidade x CDI, coortes e segmentação de usuários prontos para estudo." },
  { icone: Building2, titulo: "Camada B2B completa", texto: "Empresas acompanham recebimentos, pedidos dos clientes, relatórios gerenciais e permissões de equipe." },
  { icone: ShieldCheck, titulo: "Governança e auditoria", texto: "Painel administrativo com gestão de usuários, empresas, fila operacional e indicadores consolidados." },
];

const PERFIS = [
  { papel: "cliente" as const, icone: User, titulo: "Sou cliente", texto: "Carteira simulada, cotação, compra e venda, pedidos e histórico de rentabilidade." },
  { papel: "empresa" as const, icone: Building2, titulo: "Sou empresa", texto: "Recebimentos, pedidos da base, relatórios exportáveis e gestão de equipe." },
  { papel: "admin" as const, icone: Lock, titulo: "Sou administrador", texto: "Gestão de usuários e empresas, pedidos e indicadores consolidados da plataforma." },
];

function Landing() {
  const serie = SERIE.slice(-120);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
          <Logo />
          <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
            <a href="#recursos" className="hover:text-foreground">Recursos</a>
            <a href="#perfis" className="hover:text-foreground">Perfis de acesso</a>
            <a href="#dados" className="hover:text-foreground">Data Science</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login/$tipo" params={{ tipo: "cliente" }}>Entrar</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/cadastro/$tipo" params={{ tipo: "cliente" }}>Criar conta</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 malha-fina opacity-30" />
        <div className="absolute inset-0 brilho-topo" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <GraduationCap className="size-3.5 text-primary" /> Fintech educacional · dados fictícios
            </span>
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Simule investimentos em Bitcoin e entenda a operação de uma fintech por dentro
            </h1>
            <p className="max-w-xl text-base text-muted-foreground">
              O CryptoFlow é um ambiente de estudo que reproduz cotação, carteira, ordens,
              liquidação e relatórios de uma plataforma de criptoativos — para pessoas físicas,
              empresas e times de dados. Nenhuma operação é real.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/cadastro/$tipo" params={{ tipo: "cliente" }}>Começar simulação</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/login/$tipo" params={{ tipo: "empresa" }}>Acesso empresarial</Link>
              </Button>
            </div>
            <AvisoSimulacao className="max-w-xl" />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Cotação fictícia BTC/BRL</p>
                <p className="font-display text-3xl font-semibold">{brl(PRECO_BTC)}</p>
                <p className={VARIACAO_24H >= 0 ? "text-sm text-success" : "text-sm text-destructive"}>
                  {pct(VARIACAO_24H)} em 24h · {pct(VARIACAO_30D)} em 30 dias
                </p>
              </div>
              <Sparkles className="size-5 text-primary" />
            </div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={serie}>
                  <defs>
                    <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="data" tickFormatter={dataBR} minTickGap={50} stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis hide domain={["dataMin", "dataMax"]} />
                  <Tooltip
                    contentStyle={{ background: "var(--color-background)", border: "1px solid var(--color-border)", borderRadius: 12 }}
                    formatter={(v: number) => brl(v)}
                    labelFormatter={dataBR}
                  />
                  <Area type="monotone" dataKey="preco" name="Preço" stroke="var(--color-chart-1)" strokeWidth={2} fill="url(#heroGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Série gerada artificialmente para fins didáticos — não reflete o mercado real.
            </p>
          </div>
        </div>
      </section>

      <section id="recursos" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-3xl font-semibold">Tudo o que uma fintech precisa, em modo estudo</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Uma base completa para aulas, portfólios e provas de conceito de produtos financeiros.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {RECURSOS.map((r) => (
            <article key={r.titulo} className="rounded-xl border border-border bg-card p-5">
              <r.icone className="size-5 text-primary" />
              <h3 className="mt-3 text-lg font-semibold">{r.titulo}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="perfis" className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display text-3xl font-semibold">Três experiências, um só ambiente</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {PERFIS.map((p) => (
              <article key={p.papel} className="flex flex-col rounded-xl border border-border bg-card p-5">
                <p.icone className="size-5 text-accent" />
                <h3 className="mt-3 text-lg font-semibold">{p.titulo}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{p.texto}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link to="/login/$tipo" params={{ tipo: p.papel }}>Entrar</Link>
                  </Button>
                  {p.papel !== "admin" && (
                    <Button asChild size="sm" variant="secondary">
                      <Link to="/cadastro/$tipo" params={{ tipo: p.papel }}>Cadastrar</Link>
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="dados" className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-semibold">Feito para quem estuda dados</h2>
            <p className="mt-2 text-muted-foreground">
              Cada tela expõe métricas prontas para análise: tendência de preço, rentabilidade
              comparada, volatilidade, drawdown, ticket médio, frequência de operação e segmentação
              por perfil de risco.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {["Séries temporais diárias de preço e volume","Rentabilidade da carteira x CDI fictício","Coortes de usuários por faixa etária e perfil","Funil de pedidos: liquidado, pendente, cancelado"].map((i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 rounded-full bg-primary" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { k: "180 dias", v: "de série histórica fictícia" },
              { k: "60+ pedidos", v: "para exercícios de análise" },
              { k: "3 painéis", v: "cliente, empresa e admin" },
              { k: "0 risco", v: "nenhuma operação real" },
            ].map((c) => (
              <div key={c.k} className="rounded-xl border border-border bg-card p-5">
                <p className="font-display text-2xl font-semibold text-primary">{c.k}</p>
                <p className="text-sm text-muted-foreground">{c.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-6xl space-y-4 px-4 py-10 text-sm text-muted-foreground">
          <Logo />
          <p className="max-w-3xl">
            CryptoFlow é um projeto educacional de simulação. Não somos corretora, não custodiamos
            ativos, não executamos ordens e não oferecemos recomendação de investimento. Todos os
            valores, cotações, clientes e empresas exibidos são fictícios.
          </p>
          <p>© 2026 CryptoFlow Educação · Ambiente de simulação</p>
        </div>
      </footer>
    </div>
  );
}
