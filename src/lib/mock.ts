// Dados 100% fictícios para o ambiente de simulação CryptoFlow.
// Nada aqui representa cotações, clientes ou operações reais.

export type Papel = "cliente" | "empresa" | "admin";

export type PontoPreco = { data: string; preco: number; volume: number };

// Gerador determinístico (mesmo resultado no servidor e no navegador).
function rnd(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export const DATA_BASE = new Date("2026-09-08T00:00:00Z");
export const PRECO_INICIAL = 486_500;

export function serieBTC(dias = 180): PontoPreco[] {
  const r = rnd(20260908);
  const pontos: PontoPreco[] = [];
  let preco = PRECO_INICIAL;
  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date(DATA_BASE.getTime() - i * 86_400_000);
    const tendencia = 1 + 0.0016 * Math.sin(i / 21) + 0.0011;
    const ruido = (r() - 0.48) * 0.035;
    preco = Math.max(120_000, preco * tendencia * (1 + ruido));
    pontos.push({
      data: d.toISOString().slice(0, 10),
      preco: Math.round(preco * 100) / 100,
      volume: Math.round(180 + r() * 940),
    });
  }
  return pontos;
}

export const SERIE = serieBTC();
export const PRECO_BTC = SERIE[SERIE.length - 1]!.preco;
export const VARIACAO_24H =
  ((PRECO_BTC - SERIE[SERIE.length - 2]!.preco) / SERIE[SERIE.length - 2]!.preco) * 100;
export const VARIACAO_30D =
  ((PRECO_BTC - SERIE[SERIE.length - 31]!.preco) / SERIE[SERIE.length - 31]!.preco) * 100;

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });
export const btc = (v: number) => `${v.toFixed(6)} BTC`;
export const pct = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(2)}%`;
export const dataBR = (iso: string) => new Date(iso).toLocaleDateString("pt-BR");

export type Pedido = {
  id: string;
  data: string;
  tipo: "Compra" | "Venda";
  quantidade: number;
  precoUnitario: number;
  total: number;
  status: "Liquidado" | "Pendente" | "Cancelado";
  cliente: string;
  empresa: string;
};

const NOMES = [
  "Ana Beatriz Rocha","Carlos Menezes","Marina Duarte","Rafael Antunes","Juliana Prado",
  "Diego Fontes","Larissa Camargo","Bruno Tavares","Camila Nogueira","Felipe Aragão",
  "Patrícia Lemos","Vinícius Barros","Renata Siqueira","Thiago Moura","Aline Peixoto",
];

export const EMPRESAS = [
  { id: "EMP-01", nome: "Nordeste Pagamentos", cnpj: "12.345.678/0001-90", plano: "Enterprise", clientes: 412, status: "Ativa" },
  { id: "EMP-02", nome: "Vértice Capital", cnpj: "98.765.432/0001-11", plano: "Pro", clientes: 187, status: "Ativa" },
  { id: "EMP-03", nome: "Atlas Fintech", cnpj: "45.221.908/0001-33", plano: "Pro", clientes: 96, status: "Em análise" },
  { id: "EMP-04", nome: "Litoral Invest", cnpj: "31.554.022/0001-72", plano: "Starter", clientes: 54, status: "Ativa" },
];

export function gerarPedidos(qtd = 60): Pedido[] {
  const r = rnd(4242);
  const lista: Pedido[] = [];
  for (let i = 0; i < qtd; i++) {
    const idx = SERIE.length - 1 - Math.floor(r() * 120);
    const ponto = SERIE[Math.max(0, idx)]!;
    const quantidade = Math.round((0.002 + r() * 0.09) * 1e6) / 1e6;
    const tipo = r() > 0.42 ? "Compra" : "Venda";
    const status = r() > 0.88 ? (r() > 0.5 ? "Pendente" : "Cancelado") : "Liquidado";
    lista.push({
      id: `PED-${(10_450 + i).toString()}`,
      data: ponto.data,
      tipo,
      quantidade,
      precoUnitario: ponto.preco,
      total: Math.round(quantidade * ponto.preco * 100) / 100,
      status: status as Pedido["status"],
      cliente: NOMES[Math.floor(r() * NOMES.length)]!,
      empresa: EMPRESAS[Math.floor(r() * EMPRESAS.length)]!.nome,
    });
  }
  return lista.sort((a, b) => (a.data < b.data ? 1 : -1));
}

export const PEDIDOS = gerarPedidos();

export const USUARIOS = NOMES.map((nome, i) => {
  const r = rnd(900 + i);
  return {
    id: `USR-${2100 + i}`,
    nome,
    email: `${nome.toLowerCase().normalize("NFD").replace(/[^a-z ]/g, "").split(" ")[0]}@exemplo.com.br`,
    empresa: EMPRESAS[i % EMPRESAS.length]!.nome,
    perfil: (["Conservador", "Moderado", "Arrojado"] as const)[i % 3]!,
    patrimonio: Math.round(3_000 + r() * 220_000),
    operacoes: Math.round(4 + r() * 120),
    status: r() > 0.15 ? "Ativo" : "Inativo",
  };
});

// Carteira simulada do cliente demonstrativo
export const CARTEIRA_INICIAL = { saldoBRL: 42_500, saldoBTC: 0.184213, aportes: 68_000 };

export const rentabilidade = SERIE.slice(-120).map((p, i, arr) => ({
  data: p.data,
  carteira: Math.round(((p.preco / arr[0]!.preco - 1) * 100 + i * 0.02) * 100) / 100,
  cdi: Math.round(i * 0.043 * 100) / 100,
}));

export const comportamento = [
  { faixa: "18-24", usuarios: 128, ticket: 480, frequencia: 3.1 },
  { faixa: "25-34", usuarios: 421, ticket: 1240, frequencia: 5.4 },
  { faixa: "35-44", usuarios: 318, ticket: 2380, frequencia: 4.2 },
  { faixa: "45-59", usuarios: 176, ticket: 3910, frequencia: 2.6 },
  { faixa: "60+", usuarios: 63, ticket: 5120, frequencia: 1.4 },
];

export const perfilRisco = [
  { nome: "Conservador", valor: 38 },
  { nome: "Moderado", valor: 41 },
  { nome: "Arrojado", valor: 21 },
];

export const recebimentosEmpresa = SERIE.slice(-12).map((p, i) => ({
  mes: `S${i + 1}`,
  recebido: Math.round(48_000 + (p.preco % 40_000) + i * 3_200),
  taxa: Math.round((1_400 + (p.volume % 900)) * 1.1),
}));
