import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { Painel, StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabelaPedidos } from "./app.cliente";
import {
  fetchComportamento,
  fetchEmpresas,
  fetchPedidos,
  fetchPerfilRisco,
  fetchPreco,
  fetchUsuarios,
} from "@/lib/data-source";
import { CarregandoAPI, ErroAPI } from "@/components/api-status";
import { brl, pct } from "@/lib/mock";

export const Route = createFileRoute("/app/admin")({
  loader: async () => {
    const [preco, empresas, usuarios, pedidos, comportamento, perfilRisco] = await Promise.all([
      fetchPreco(),
      fetchEmpresas(),
      fetchUsuarios(),
      fetchPedidos(),
      fetchComportamento(),
      fetchPerfilRisco(),
    ]);
    return { preco, empresas, usuarios, pedidos, comportamento, perfilRisco };
  },
  pendingComponent: CarregandoAPI,
  errorComponent: ErroAPI,
  head: () => ({
    meta: [
      { title: "Painel administrativo | CryptoFlow" },
      {
        name: "description",
        content:
          "Gestão fictícia de usuários e empresas, acompanhamento de pedidos e indicadores consolidados do simulador CryptoFlow.",
      },
      { property: "og:title", content: "Painel administrativo | CryptoFlow" },
      { property: "og:description", content: "Indicadores consolidados e gestão no ambiente simulado." },
    ],
  }),
  component: PainelAdmin,
});

const ABAS = [
  { chave: "indicadores", rotulo: "Indicadores" },
  { chave: "usuarios", rotulo: "Usuários" },
  { chave: "empresas", rotulo: "Empresas" },
  { chave: "pedidos", rotulo: "Pedidos" },
  { chave: "ciencia", rotulo: "Data Science" },
];

const CORES = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)"];

function PainelAdmin() {
  const dados = Route.useLoaderData();
  const PRECO_BTC = dados.preco.precoBtc;
  const VARIACAO_30D = dados.preco.variacao30d;
  const EMPRESAS = dados.empresas;
  const USUARIOS = dados.usuarios;
  const PEDIDOS = dados.pedidos;
  const comportamento = dados.comportamento;
  const perfilRisco = dados.perfilRisco;

  const [aba, setAba] = useState("indicadores");
  const volume = PEDIDOS.reduce((s, p) => s + p.total, 0);
  const pendentes = PEDIDOS.filter((p) => p.status === "Pendente").length;

  return (
    <AppShell papel="admin" titulo="Administrador" itens={ABAS} ativo={aba} onSelecionar={setAba}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard rotulo="Volume transacionado" valor={brl(volume)} detalhe="Somatório de ordens simuladas" />
        <StatCard rotulo="Usuários cadastrados" valor={String(USUARIOS.length * 84)} detalhe={`${pct(12.6)} no trimestre`} tom="alta" />
        <StatCard rotulo="Empresas parceiras" valor={String(EMPRESAS.length)} detalhe="1 aguardando aprovação" />
        <StatCard rotulo="Cotação BTC / var. 30d" valor={brl(PRECO_BTC)} detalhe={pct(VARIACAO_30D)} tom={VARIACAO_30D >= 0 ? "alta" : "baixa"} />
      </div>

      {aba === "indicadores" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Painel titulo="Usuários por faixa etária" descricao="Base fictícia segmentada" className="lg:col-span-2">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comportamento}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="faixa" stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                  <Legend />
                  <Bar dataKey="usuarios" name="Usuários" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="ticket" name="Ticket médio (R$)" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Painel>
          <Painel titulo="Perfis de risco" descricao="Distribuição percentual fictícia">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={perfilRisco} dataKey="valor" nameKey="nome" innerRadius={55} outerRadius={95} paddingAngle={3}>
                    {perfilRisco.map((_, i) => (
                      <Cell key={i} fill={CORES[i % CORES.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Painel>
          <Painel titulo="Fila operacional" descricao="Itens simulados que exigem atenção" className="lg:col-span-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard rotulo="Pedidos pendentes" valor={String(pendentes)} detalhe="Aguardando liquidação fictícia" />
              <StatCard rotulo="Cadastros em análise" valor="7" detalhe="Documentos simulados" />
              <StatCard rotulo="Alertas de risco" valor="2" detalhe="Regras educativas de monitoramento" tom="baixa" />
            </div>
          </Painel>
        </div>
      )}

      {aba === "usuarios" && (
        <Painel titulo="Gestão de usuários" descricao="Registros fictícios para fins didáticos">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead className="text-right">Patrimônio</TableHead>
                  <TableHead className="text-right">Operações</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {USUARIOS.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-mono text-xs">{u.id}</TableCell>
                    <TableCell>{u.nome}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>{u.empresa}</TableCell>
                    <TableCell>{u.perfil}</TableCell>
                    <TableCell className="text-right">{brl(u.patrimonio)}</TableCell>
                    <TableCell className="text-right">{u.operacoes}</TableCell>
                    <TableCell>
                      <Badge variant={u.status === "Ativo" ? "secondary" : "outline"}>{u.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Painel>
      )}

      {aba === "empresas" && (
        <Painel titulo="Empresas parceiras" descricao="Contas B2B fictícias">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Razão social</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead className="text-right">Clientes</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {EMPRESAS.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-mono text-xs">{e.id}</TableCell>
                    <TableCell>{e.nome}</TableCell>
                    <TableCell className="text-muted-foreground">{e.cnpj}</TableCell>
                    <TableCell>{e.plano}</TableCell>
                    <TableCell className="text-right">{e.clientes}</TableCell>
                    <TableCell>
                      <Badge variant={e.status === "Ativa" ? "secondary" : "outline"}>{e.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Painel>
      )}

      {aba === "pedidos" && (
        <Painel titulo="Todos os pedidos" descricao="Ordens simuladas de todas as empresas">
          <TabelaPedidos pedidos={PEDIDOS.slice(0, 40)} comCliente />
        </Painel>
      )}

      {aba === "ciencia" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Painel titulo="Comportamento: frequência x ticket" descricao="Dispersão por faixa etária (dados fictícios)">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid stroke="var(--color-border)" />
                  <XAxis type="number" dataKey="frequencia" name="Operações/mês" stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis type="number" dataKey="ticket" name="Ticket (R$)" stroke="var(--color-muted-foreground)" fontSize={11} />
                  <ZAxis type="number" dataKey="usuarios" range={[80, 500]} name="Usuários" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                  <Scatter data={comportamento} fill="var(--color-chart-4)" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </Painel>
          <Painel titulo="Roteiro de estudo sugerido" descricao="Como usar estes dados em exercícios">
            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Analise a série de preços: médias móveis, volatilidade e retornos logarítmicos.</li>
              <li>Compare a rentabilidade da carteira simulada com o CDI fictício.</li>
              <li>Segmente usuários por faixa etária, perfil de risco e ticket médio (clusterização).</li>
              <li>Modele a probabilidade de um pedido ficar pendente a partir de valor e tipo.</li>
              <li>Construa indicadores de retenção e frequência de operação por coorte.</li>
            </ol>
          </Painel>
        </div>
      )}
    </AppShell>
  );
}
