// Estados de loader compartilhados pelas rotas que buscam dados da API
// (ver src/lib/data-source.ts). Ficam num lugar só pra não repetir o
// mesmo marcado em cada arquivo de rota.

export function CarregandoAPI() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <p className="text-sm text-muted-foreground">Carregando dados da API...</p>
    </div>
  );
}

export function ErroAPI({ error }: { error: unknown }) {
  const mensagem = error instanceof Error ? error.message : String(error);
  return (
    <div className="mx-auto max-w-lg space-y-3 px-4 py-24 text-center">
      <p className="text-lg font-semibold text-destructive">Não foi possível conectar à API</p>
      <p className="text-sm text-muted-foreground">
        Confirme que ela está rodando em{" "}
        <code className="rounded bg-secondary px-1 py-0.5">http://localhost:8000</code> (
        <code className="rounded bg-secondary px-1 py-0.5">uvicorn cryptoflow_ds.api:app --reload</code>) e
        recarregue a página.
      </p>
      <p className="text-xs text-muted-foreground">{mensagem}</p>
    </div>
  );
}
