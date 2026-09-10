// Fonte única dos dados "reais" do CryptoFlow.
//
// Hoje (Fase 1): lê um JSON gerado em lote pelo pipeline de Data Science em
// Python (ver /cryptoflow-ds no repositório, fora de src/). Roda-se o script,
// o arquivo abaixo é regravado, o dashboard reflete o novo snapshot.
//
// Amanhã (Fase 2 — API ao vivo): troca-se o bloco de import estático por um
// fetch para a API (ver cryptoflow-ds/cryptoflow_ds/api_preview.py), dentro
// de uma server function do TanStack Start para não expor a URL da API no
// bundle do cliente. Os nomes exportados abaixo (SERIE, PRECO_BTC, USUARIOS
// etc.) continuam os mesmos — nenhuma rota ou componente precisa mudar.
//
// Tipos (Papel, Pedido, PontoPreco) e os helpers de formatação (brl, btc,
// pct, dataBR) continuam vindo de "./mock" — só os DADOS mudaram de fonte.

import raw from "@/data/cryptoflow-data.json";
import type { Pedido } from "./mock";

const data = raw;

export const SERIE = data.serie;
export const PRECO_BTC = data.precoBtc;
export const VARIACAO_24H = data.variacao24h;
export const VARIACAO_30D = data.variacao30d;

export const EMPRESAS = data.empresas;
export const USUARIOS = data.usuarios;

// `status` e `tipo` em Pedido são union types literais ("Compra" | "Venda"...);
// o import de JSON infere `string` para eles. O pipeline Python garante que só
// os valores válidos são emitidos (ver cryptoflow_ds/schemas.py), então o cast
// aqui é seguro — é a mesma garantia que um endpoint tipado com Pydantic daria.
export const PEDIDOS = data.pedidos as Pedido[];

export const CARTEIRA_INICIAL = data.carteiraInicial;
export const rentabilidade = data.rentabilidade;
export const comportamento = data.comportamento;
export const perfilRisco = data.perfilRisco;
export const recebimentosEmpresa = data.recebimentosEmpresa;

// Novo: ainda não consumido por nenhuma tela, mas já disponível para quando
// o dashboard ganhar um card de "alertas simulados" (a landing page já promete
// isso). Gerado por detecção de anomalias (z-score) em cryptoflow_ds/alerts.py.
export const ALERTAS = data.alertas;

// Metadados úteis para depuração ou para exibir "dados gerados em..." na UI.
export const META = data.meta;
export const GERADO_EM = data.generatedAt;
