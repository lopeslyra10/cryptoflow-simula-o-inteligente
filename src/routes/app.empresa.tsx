import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Building2, Download, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Painel, StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TabelaPedidos } from "./app.cliente";
import { fetchPedidos, fetchSerie, fetchRecebimentosEmpresa } from "@/lib/data-source";
import { CarregandoAPI, ErroAPI } from "@/components/api-status";
import { brl, dataBR, pct } from "@/lib/mock";

export const Route = createFileRoute("/app/empresa")({
  loader: async () => {
    const [pedidos, serie, recebimentosEmpresa] = await Promise.all([
      fetchPedidos(),
      fetchSerie(),
      fetchRecebimentosEmpresa(),
    ]);
    return { pedidos, serie, recebimentosEmpresa };
  },
  pendingComponent: CarregandoAPI,
  errorComponent: ErroAPI,
  head: () => ({
    meta: [
      { title: "Painel da empresa | CryptoFlow" },
      {
        name: "description",
        content:
          "Recebimentos simulados, pedidos de clientes, relatórios gerenciais e gestão de equipe no ambiente educacional CryptoFlow.",
      },
      { property: "og:title", content: "Painel da empresa | CryptoFlow" },
      { property: "og:description", content: "Recebimentos, pedidos, relatórios e equipe em ambiente simulado." },
    ],
  }),
  component: PainelEmpresa,
});

const ABAS = [
  { chave: "recebimentos", rotulo: "Recebimentos" },
  { chave: "pedidos", rotulo: "Pedidos" },
  { chave: "relatorios", rotulo: "Relatórios" },
  { chave: "equipe", rotulo: "Equipe" },
];

const EQUIPE = [
  { nome: "Marina Duarte", cargo: "Diretora financeira", acesso: "Administrador", status: "Ativo" },
  { nome: "Rafael Antunes", cargo: "Analista de liquidação", acesso: "Operador", status: "Ativo" },
  { nome: "Camila Nogueira", cargo: "Analista de dados", acesso: "Leitura", status: "Ativo" },
  { nome: "Bruno Tavares", cargo: "Suporte a clientes", acesso: "Operador", status: "Convite pendente" },
];

function PainelEmpresa() {
  const dados = Route.useLoaderData();
  const PEDIDOS = dados.pedidos;
  const SERIE = dados.serie;
  const recebimentosEmpresa = dados.recebimentosEmpresa;

  const [aba, setAba] = useState("recebimentos");
  const pedidos = PEDIDOS.filter((p) => p.empresa === "Nordeste Pagamentos").slice(0, 20);
  const recebido = recebimentosEmpresa.reduce((s, r) => s + r.recebido, 0);
  const taxas = recebimentosEmpresa.reduce((s, r) => s + r.taxa, 0);

  return (
    <AppShell papel="empresa" titulo="Empresa B2B" itens={ABAS} ativo={aba} onSelecionar={setAba}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard rotulo="Recebimentos (12 semanas)" valor={brl(recebido)} detalhe={`${pct(8.4)} vs. período anterior`} tom="alta" />
        <StatCard rotulo="Taxas simuladas" valor={brl(taxas)} detalhe="Receita de intermediação fictícia" />
        <StatCard rotulo="Pedidos no período" valor={String(pedidos.length)} detalhe="Ordens de clientes vinculados" icone={<Building2 className="size-4 text-muted-foreground" />} />
        <StatCard rotulo="Clientes ativos" valor="412" detalhe="Base fictícia vinculada à empresa" icone={<Users className="size-4 text-muted-foreground" />} />
      </div>

      {aba === "recebimentos" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Painel titulo="Recebimentos semanais" descricao="Valores fictícios liquidados por semana" className="lg:col-span-2">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recebimentosEmpresa}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="mes" stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} width={70} tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} formatter={(v: number) => brl(v)} />
                  <Legend />
                  <Bar dataKey="recebido" name="Recebido" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="taxa" name="Taxas" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Painel>
          <Painel titulo="Liquidações previstas" descricao="Agenda fictícia dos próximos dias">
            <ul className="space-y-2 text-sm">
              {SERIE.slice(-5).map((s, i) => (
                <li key={s.data} className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2">
                  <span>{dataBR(s.data)}</span>
                  <span className="font-medium">{brl(12_400 + i * 3_150)}</span>
                </li>
              ))}
            </ul>
          </Painel>
        </div>
      )}

      {aba === "pedidos" && (
        <Painel titulo="Pedidos dos clientes" descricao="Ordens simuladas originadas pela sua base">
          <TabelaPedidos pedidos={pedidos} comCliente />
        </Painel>
      )}

      {aba === "relatorios" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Painel titulo="Ticket médio e volume" descricao="Séries fictícias para análise exploratória">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SERIE.slice(-60)}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="data" tickFormatter={dataBR} minTickGap={40} stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} labelFormatter={dataBR} />
                  <Line type="monotone" dataKey="volume" name="Volume (un.)" stroke="var(--color-chart-3)" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Painel>
          <Painel titulo="Exportações" descricao="Arquivos de exemplo para exercícios de Data Science">
            <div className="space-y-2">
              {["Pedidos consolidados (CSV)", "Recebimentos por semana (CSV)", "Base de clientes anonimizada (CSV)", "Série histórica BTC (CSV)"].map((r) => (
                <div key={r} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                  <span>{r}</span>
                  <Button variant="secondary" size="sm"><Download className="size-4" /> Simular</Button>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                Os downloads são ilustrativos e não geram arquivos reais.
              </p>
            </div>
          </Painel>
        </div>
      )}

      {aba === "equipe" && (
        <Painel titulo="Equipe" descricao="Usuários fictícios com acesso ao ambiente da empresa">
          <ul className="divide-y divide-border">
            {EQUIPE.map((m) => (
              <li key={m.nome} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="font-medium">{m.nome}</p>
                  <p className="text-xs text-muted-foreground">{m.cargo}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{m.acesso}</Badge>
                  <Badge variant={m.status === "Ativo" ? "secondary" : "outline"}>{m.status}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </Painel>
      )}
    </AppShell>
  );
}
