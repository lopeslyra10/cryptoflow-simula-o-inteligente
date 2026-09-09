import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvisoSimulacao, Logo } from "@/components/app-shell";
import { useAuth, rotaPorPapel } from "@/lib/auth";

export const Route = createFileRoute("/cadastro/$tipo")({
  head: () => ({
    meta: [
      { title: "Criar conta | CryptoFlow — simulador de investimentos" },
      {
        name: "description",
        content:
          "Crie uma conta fictícia de cliente ou empresa no CryptoFlow e explore o simulador educacional de investimentos em Bitcoin.",
      },
      { property: "og:title", content: "Criar conta no CryptoFlow" },
      { property: "og:description", content: "Cadastro de cliente ou empresa no simulador educacional." },
    ],
  }),
  component: Cadastro,
});

function Cadastro() {
  const { tipo } = Route.useParams();
  const empresa = tipo === "empresa";
  const papel = empresa ? ("empresa" as const) : ("cliente" as const);
  const { entrar } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: empresa ? "Nordeste Pagamentos" : "Ana Beatriz Rocha",
    doc: empresa ? "12.345.678/0001-90" : "123.456.789-00",
    email: empresa ? "financeiro@nordestepag.com.br" : "cliente@exemplo.com.br",
    senha: "simulacao123",
  });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-6 px-4 py-12">
      <Link to="/"><Logo /></Link>
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
          {empresa ? <Building2 className="size-3.5" /> : <User className="size-3.5" />}
          {empresa ? "Cadastro empresarial (B2B)" : "Cadastro pessoa física (B2C)"}
        </span>
        <h1 className="mt-3 font-display text-2xl font-semibold">
          {empresa ? "Cadastre sua empresa" : "Crie sua conta de estudo"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Nenhum dado é validado ou enviado: o cadastro apenas abre o ambiente simulado.
        </p>
      </div>

      <form
        className="space-y-4 rounded-xl border border-border bg-card p-5"
        onSubmit={(e) => {
          e.preventDefault();
          entrar({
            nome: empresa ? "Marina Duarte" : form.nome,
            email: form.email,
            papel,
            ...(empresa ? { organizacao: form.nome } : {}),
          });
          navigate({ to: rotaPorPapel[papel] });
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="nome">{empresa ? "Razão social" : "Nome completo"}</Label>
          <Input id="nome" value={form.nome} onChange={set("nome")} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="doc">{empresa ? "CNPJ" : "CPF"}</Label>
          <Input id="doc" value={form.doc} onChange={set("doc")} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" value={form.email} onChange={set("email")} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="senha">Senha</Label>
          <Input id="senha" type="password" value={form.senha} onChange={set("senha")} required />
        </div>
        <Button type="submit" className="w-full">Criar conta simulada</Button>
        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/login/$tipo" params={{ tipo: papel }} className="text-accent hover:underline">
            Entrar
          </Link>
        </p>
      </form>

      <AvisoSimulacao />
    </div>
  );
}
