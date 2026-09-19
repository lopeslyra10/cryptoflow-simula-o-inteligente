import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, Bitcoin, Wallet } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Painel, StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  fetchAlertas,
  fetchCarteiraInicial,
  fetchPedidos,
  fetchPreco,
  fetchRentabilidade,
  fetchSerie,
} from "@/lib/data-source";
import { brl, btc, dataBR, pct, type Pedido } from "@/lib/mock";
import { CarregandoAPI, ErroAPI } from "@/components/api-status";

export const Route = createFileRoute("/app/cliente")({
  loader: async () => {
    const [preco, serie, pedidos, carteiraInicial, rentabilidade, alertas] = await Promise.all([
      fetchPreco(),
      fetchSerie(),
      fetchPedidos(),
      fetchCarteiraInicial(),
      fetchRentabilidade(),
      fetchAlertas(),
    ]);
    return { preco, serie, pedidos, carteiraInicial, rentabilidade, alertas };
  },
  pendingComponent: CarregandoAPI,
  errorComponent: ErroAPI,
  head: () => ({
    meta: [
      { title: "Painel do cliente | CryptoFlow" },
      {
        name: "description",
        content:
          "Carteira simulada, cotação fictícia de Bitcoin, compra e venda simuladas, pedidos e histórico de rentabilidade.",
      },
      { property: "og:title", content: "Painel do cliente | CryptoFlow" },
      { property: "og:description", content: "Carteira simulada e ordens fictícias de Bitcoin." },
    ],
  }),
  component: PainelCliente,
});

const ABAS = [
  { chave: "carteira", rotulo: "Carteira" },
  { chave: "negociar", rotulo: "Comprar / Vender" },
  { chave: "pedidos", rotulo: "Pedidos" },
  { chave: "historico", rotulo: "Histórico & Análises" },
];

function PainelCliente() {
  const dados = Route.useLoaderData();
  const PRECO_BTC = dados.preco.precoBtc;
  const VARIACAO_24H = dados.preco.variacao24h;
  const VARIACAO_30D = dados.preco.variacao30d;
  const SERIE = dados.serie;
  const PEDIDOS = dados.pedidos;
  const rentabilidade = dados.rentabilidade;
  const ALERTAS = dados.alertas;

  const [aba, setAba] = useState("carteira");
  const [carteira, setCarteira] = useState(dados.carteiraInicial);
  const [meusPedidos, setMeusPedidos] = useState<Pedido[]>(() => PEDIDOS.slice(0, 12));
  const [tipo, setTipo] = useState<"Compra" | "Venda">("Compra");
  const [valor, setValor] = useState("2500");
  const [mensagem, setMensagem] = useState<string | null>(null);

  const patrimonio = carteira.saldoBRL + carteira.saldoBTC * PRECO_BTC;
  const lucro = patrimonio - carteira.aportes;
  const serie90 = useMemo(() => SERIE.slice(-90), [SERIE]);

  function executar() {
    const v = Number(valor.replace(",", "."));
    if (!v || v <= 0) return;
    const quantidade = Math.round((v / PRECO_BTC) * 1e6) / 1e6;
    if (tipo === "Compra" && v > carteira.saldoBRL) {
      setMensagem("Saldo simulado em reais insuficiente para esta ordem.");
      return;
    }
    if (tipo === "Venda" && quantidade > carteira.saldoBTC) {
      setMensagem("Quantidade de BTC simulada insuficiente para esta ordem.");
      return;
    }
    setCarteira((c) => ({
      ...c,
      saldoBRL: Math.round((tipo === "Compra" ? c.saldoBRL - v : c.saldoBRL + v) * 100) / 100,
      saldoBTC:
        Math.round((tipo === "Compra" ? c.saldoBTC + quantidade : c.saldoBTC - quantidade) * 1e6) /
        1e6,
    }));
    setMeusPedidos((p) => [
      {
        id: `PED-${11000 + p.length}`,
        data: SERIE[SERIE.length - 1]!.data,
        tipo,
        quantidade,
        precoUnitario: PRECO_BTC,
        total: v,
        status: "Liquidado",
        cliente: "Ana Beatriz Rocha",
        empresa: "Nordeste Pagamentos",
      },
      ...p,
    ]);
    setMensagem(`Ordem simulada de ${tipo.toLowerCase()} registrada: ${btc(quantidade)} por ${brl(v)}.`);
    setAba("pedidos");
  }

  return (
    <AppShell papel="cliente" titulo="Cliente B2C" itens={ABAS} ativo={aba} onSelecionar={setAba}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          rotulo="Patrimônio simulado"
          valor={brl(patrimonio)}
          detalhe={`${lucro >= 0 ? "Ganho" : "Perda"} de ${brl(Math.abs(lucro))} sobre aportes`}
          tom={lucro >= 0 ? "alta" : "baixa"}
          icone={<Wallet className="size-4 text-muted-foreground" />}
        />
        <StatCard rotulo="Saldo em reais" valor={brl(carteira.saldoBRL)} detalhe="Disponível para ordens fictícias" />
        <StatCard
          rotulo="Posição em Bitcoin"
          valor={btc(carteira.saldoBTC)}
          detalhe={brl(carteira.saldoBTC * PRECO_BTC)}
          icone={<Bitcoin className="size-4 text-primary" />}
        />
        <StatCard
          rotulo="Cotação BTC (fictícia)"
          valor={brl(PRECO_BTC)}
          detalhe={`${pct(VARIACAO_24H)} em 24h · ${pct(VARIACAO_30D)} em 30d`}
          tom={VARIACAO_24H >= 0 ? "alta" : "baixa"}
        />
      </div>

      {aba === "carteira" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Painel titulo="Cotação do Bitcoin" descricao="Série fictícia dos últimos 90 dias (BRL)" className="lg:col-span-2">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={serie90}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="data" tickFormatter={dataBR} minTickGap={40} stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} width={70} tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
                  <Tooltip
                    contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }}
                    formatter={(v: number) => brl(v)}
                    labelFormatter={dataBR}
                  />
                  <Area type="monotone" dataKey="preco" name="Preço" stroke="var(--color-chart-1)" fill="url(#grad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Painel>
          <Painel titulo="Composição da carteira" descricao="Distribuição simulada dos ativos">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2">
                <span>Bitcoin</span>
                <strong>{((carteira.saldoBTC * PRECO_BTC) / patrimonio * 100).toFixed(1)}%</strong>
              </li>
              <li className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2">
                <span>Caixa (BRL)</span>
                <strong>{((carteira.saldoBRL / patrimonio) * 100).toFixed(1)}%</strong>
              </li>
              <li className="flex items-center justify-between px-3 py-2 text-muted-foreground">
                <span>Total aportado</span>
                <span>{brl(carteira.aportes)}</span>
              </li>
              <li className="flex items-center justify-between px-3 py-2 text-muted-foreground">
                <span>Preço médio simulado</span>
                <span>{brl(carteira.aportes / (carteira.saldoBTC || 1))}</span>
              </li>
            </ul>
          </Painel>
        </div>
      )}

      {aba === "negociar" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Painel titulo="Nova ordem simulada" descricao="Nenhuma ordem é enviada a mercado">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button variant={tipo === "Compra" ? "default" : "secondary"} onClick={() => setTipo("Compra")}>
                  <ArrowUpRight className="size-4" /> Comprar
                </Button>
                <Button variant={tipo === "Venda" ? "default" : "secondary"} onClick={() => setTipo("Venda")}>
                  <ArrowDownRight className="size-4" /> Vender
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor em reais</Label>
                <Input id="valor" inputMode="decimal" value={valor} onChange={(e) => setValor(e.target.value)} />
              </div>
              <div className="rounded-lg bg-secondary p-3 text-sm">
                <p className="flex justify-between"><span className="text-muted-foreground">Cotação</span><span>{brl(PRECO_BTC)}</span></p>
                <p className="flex justify-between"><span className="text-muted-foreground">Quantidade estimada</span><span>{btc((Number(valor.replace(",", ".")) || 0) / PRECO_BTC)}</span></p>
                <p className="flex justify-between"><span className="text-muted-foreground">Taxa simulada (0,5%)</span><span>{brl((Number(valor.replace(",", ".")) || 0) * 0.005)}</span></p>
              </div>
              <Button className="w-full" onClick={executar}>Confirmar ordem simulada</Button>
              {mensagem && <p className="text-xs text-accent">{mensagem}</p>}
            </div>
          </Painel>
          <Painel titulo="Livro de ofertas fictício" descricao="Profundidade ilustrativa" className="lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              {(["Compra", "Venda"] as const).map((lado) => (
                <div key={lado}>
                  <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">{lado}</p>
                  <ul className="space-y-1 text-sm">
                    {Array.from({ length: 6 }).map((_, i) => {
                      const preco = PRECO_BTC * (1 + (lado === "Compra" ? -1 : 1) * (i + 1) * 0.0009);
                      return (
                        <li key={i} className="flex justify-between rounded bg-secondary/60 px-2 py-1">
                          <span className={lado === "Compra" ? "text-success" : "text-destructive"}>{brl(preco)}</span>
                          <span className="text-muted-foreground">{(0.02 + i * 0.013).toFixed(4)} BTC</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </Painel>
        </div>
      )}

      {aba === "pedidos" && (
        <Painel titulo="Meus pedidos" descricao="Ordens simuladas registradas nesta sessão e no histórico fictício">
          <TabelaPedidos pedidos={meusPedidos} />
        </Painel>
      )}

      {aba === "historico" && (
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Painel titulo="Rentabilidade acumulada" descricao="Carteira simulada x CDI fictício (%)">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rentabilidade}>
                    <CartesianGrid stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="data" tickFormatter={dataBR} minTickGap={40} stroke="var(--color-muted-foreground)" fontSize={11} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                    <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} labelFormatter={dataBR} />
                    <Legend />
                    <Line type="monotone" dataKey="carteira" name="Carteira" stroke="var(--color-chart-1)" dot={false} strokeWidth={2} />
                    <Line type="monotone" dataKey="cdi" name="CDI" stroke="var(--color-chart-2)" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Painel>
            <Painel titulo="Indicadores para estudo" descricao="Métricas usuais em Data Science aplicadas a séries de preço">
              <div className="grid gap-3 sm:grid-cols-2">
                <StatCard rotulo="Volatilidade 30d" valor="4,82%" detalhe="Desvio-padrão dos retornos diários" />
                <StatCard rotulo="Índice Sharpe simulado" valor="1,34" detalhe="Retorno excedente / volatilidade" />
                <StatCard rotulo="Máximo drawdown" valor="-18,7%" detalhe="Maior queda do pico ao vale" tom="baixa" />
                <StatCard rotulo="Preço médio de compra" valor={brl(carteira.aportes / (carteira.saldoBTC || 1))} detalhe="Custo médio ponderado" />
              </div>
            </Painel>
          </div>

          <Painel
            titulo="Alertas de anomalia"
            descricao="Movimentos de preço fora do padrão, detectados por z-score sobre os retornos diários"
          >
            {ALERTAS.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum alerta no período simulado.</p>
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2">
                {[...ALERTAS].reverse().slice(0, 8).map((a, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 rounded-lg bg-secondary px-3 py-2 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      {a.tipo === "alta_atipica" ? (
                        <ArrowUpRight className="size-4 text-success" />
                      ) : (
                        <ArrowDownRight className="size-4 text-destructive" />
                      )}
                      <div>
                        <p className="font-medium">
                          {a.tipo === "alta_atipica" ? "Alta atípica" : "Queda atípica"}
                        </p>
                        <p className="text-xs text-muted-foreground">{dataBR(a.data)}</p>
                      </div>
                    </div>
                    <Badge variant={a.tipo === "alta_atipica" ? "secondary" : "destructive"}>
                      {pct(a.variacaoPct)}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Painel>
        </div>
      )}
    </AppShell>
  );
}

export function TabelaPedidos({ pedidos, comCliente = false }: { pedidos: Pedido[]; comCliente?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pedido</TableHead>
            <TableHead>Data</TableHead>
            {comCliente && <TableHead>Cliente</TableHead>}
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Quantidade</TableHead>
            <TableHead className="text-right">Preço</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pedidos.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-mono text-xs">{p.id}</TableCell>
              <TableCell>{dataBR(p.data)}</TableCell>
              {comCliente && <TableCell>{p.cliente}</TableCell>}
              <TableCell className={p.tipo === "Compra" ? "text-success" : "text-destructive"}>{p.tipo}</TableCell>
              <TableCell className="text-right font-mono text-xs">{p.quantidade.toFixed(6)}</TableCell>
              <TableCell className="text-right">{brl(p.precoUnitario)}</TableCell>
              <TableCell className="text-right">{brl(p.total)}</TableCell>
              <TableCell>
                <Badge variant={p.status === "Liquidado" ? "secondary" : p.status === "Pendente" ? "outline" : "destructive"}>
                  {p.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
