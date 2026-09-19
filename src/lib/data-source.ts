// Fonte única dos dados "reais" do CryptoFlow.
//
// Fase 5 (API ao vivo): cada função abaixo busca de um endpoint da API
// FastAPI (ver /cryptoflow-ds/cryptoflow_ds/api.py), que por sua vez lê do
// mesmo banco SQLite que o pipeline Python popula. Antes disso (Fase 1),
// este arquivo importava um snapshot estático em
// src/data/cryptoflow-data.json — esse arquivo pode continuar existindo
// no repositório como referência/fallback offline, mas não é mais
// importado aqui.
//
// Cada rota chama as funções que precisa dentro do seu `loader` do
// TanStack Router e lê o resultado via `Route.useLoaderData()` — não tem
// mais um valor pronto no escopo do módulo, porque agora é uma
// requisição de rede, não um import estático resolvido em build time.

import type { Pedido } from "./mock";

// Ajustável via variável de ambiente (arquivo .env na raiz do projeto:
// VITE_API_BASE_URL=http://localhost:8000) se a API rodar em outro
// endereço/porta. Sem isso, usa o padrão local.
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

async function fetchJSON<T>(caminho: string): Promise<T> {
  const resposta = await fetch(`${API_BASE}${caminho}`);
  if (!resposta.ok) {
    throw new Error(`API respondeu ${resposta.status} em ${caminho}`);
  }
  return resposta.json() as Promise<T>;
}

// --- Tipos (espelham cryptoflow_ds/schemas.py) --------------------------

export type PontoPreco = { data: string; preco: number; volume: number };
export type PrecoResumo = { precoBtc: number; variacao24h: number; variacao30d: number };

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  empresa: string;
  perfil: "Conservador" | "Moderado" | "Arrojado";
  patrimonio: number;
  operacoes: number;
  status: "Ativo" | "Inativo";
  explicacao: string;
};

export type Empresa = {
  id: string;
  nome: string;
  cnpj: string;
  plano: "Starter" | "Pro" | "Enterprise";
  clientes: number;
  status: "Ativa" | "Em análise";
};

export type Carteira = { saldoBRL: number; saldoBTC: number; aportes: number };
export type RentabilidadePonto = { data: string; carteira: number; cdi: number };
export type ComportamentoFaixa = { faixa: string; usuarios: number; ticket: number; frequencia: number };
export type PerfilRiscoItem = { nome: string; valor: number };
export type RecebimentoSemana = { mes: string; recebido: number; taxa: number };

export type Alerta = {
  data: string;
  tipo: "alta_atipica" | "queda_atipica";
  zScore: number;
  variacaoPct: number;
  mensagem: string;
};

// --- Um fetcher por endpoint ---------------------------------------------

export const fetchPreco = () => fetchJSON<PrecoResumo>("/api/preco");
export const fetchSerie = () => fetchJSON<PontoPreco[]>("/api/serie");
export const fetchAlertas = () => fetchJSON<Alerta[]>("/api/alertas");
export const fetchUsuarios = () => fetchJSON<Usuario[]>("/api/usuarios");
export const fetchEmpresas = () => fetchJSON<Empresa[]>("/api/empresas");
export const fetchPedidos = () => fetchJSON<Pedido[]>("/api/pedidos");
export const fetchCarteiraInicial = () => fetchJSON<Carteira>("/api/carteira-inicial");
export const fetchRentabilidade = () => fetchJSON<RentabilidadePonto[]>("/api/rentabilidade");
export const fetchComportamento = () => fetchJSON<ComportamentoFaixa[]>("/api/comportamento");
export const fetchPerfilRisco = () => fetchJSON<PerfilRiscoItem[]>("/api/perfil-risco");
export const fetchRecebimentosEmpresa = () => fetchJSON<RecebimentoSemana[]>("/api/recebimentos-empresa");
