"use client";

import { use, useState } from "react";
import { ErrorAlert } from "@/components/ErrorAlert";
import { SaveSearchButton } from "@/components/SaveSearchButton";
import { useCostTracker } from "@/hooks/useCostTracker";
import { ProcessosCard } from "@/components/ProcessosCard";
import { ResultDisplay } from "@/components/ResultDisplay";
import type { CompanySearchResponseDto } from "@/lib/types";
import type { CompanyDataset } from "@/lib/types";

const DATASETS: { value: CompanyDataset; label: string }[] = [
  { value: "basic", label: "Básico" },
  { value: "complete", label: "Completo" },
  { value: "address", label: "Endereço" },
  { value: "online_presence", label: "Presença Online" },
  { value: "partners", label: "Sócios" },
  { value: "debts", label: "Dívida Ativa" },
];

const ALL_DATASETS: CompanyDataset[] = ["basic", "complete", "address", "online_presence", "partners", "debts"];

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
  params?: Promise<Record<string, string>>;
};

export default function EmpresasPage({ searchParams, params }: PageProps) {
  use(searchParams ?? Promise.resolve({}));
  use(params ?? Promise.resolve({}));
  const [cnpj, setCnpj] = useState("");
  const [domain, setDomain] = useState("");
  const [datasets, setDatasets] = useState<CompanyDataset[]>(["basic", "complete", "address", "partners", "debts"]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompanySearchResponseDto | null>(null);
  const [error, setError] = useState<{ code?: string; message?: string } | null>(null);
  const { addCost } = useCostTracker();

  const toggleDataset = (d: CompanyDataset) => {
    setDatasets((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const selectAllDatasets = () => {
    setDatasets(ALL_DATASETS);
  };

  const clearDatasets = () => {
    setDatasets(["basic"]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!cnpj.trim() && !domain.trim()) {
      setError({ code: "MISSING_PARAMETER", message: "Informe CNPJ ou domínio" });
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cnpj.trim()) params.set("cnpj", cnpj.replace(/\D/g, ""));
      if (domain.trim()) params.set("domain", domain.trim());
      params.set("datasets", datasets.join(","));
      const res = await fetch(`/api/empresas?${params.toString()}`);
      const data = (await res.json()) as CompanySearchResponseDto;
      if (!res.ok) {
        setError(data.error ?? { message: "Erro na consulta" });
        return;
      }
      setResult(data);
      if (data.cost != null && data.cost > 0) {
        addCost("Empresa por CNPJ", data.cost, data.costFormatted, data.datasets?.join(", "));
      }
    } catch {
      setError({ message: "Erro ao conectar. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#f1f1f1]">
            Empresa por CNPJ ou Domínio
          </h1>
          <p className="mt-2 text-[#f1f1f1]/70">
            Consulte dados cadastrais da Receita Federal.
          </p>
        </div>
        {(cnpj.trim() || domain.trim()) && (
          <SaveSearchButton
            searchType="empresa_cnpj"
            params={{ cnpj: cnpj.trim() || null, domain: domain.trim() || null, datasets }}
          />
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="cnpj" className="block text-sm font-medium text-[#f1f1f1]/90">
              CNPJ
            </label>
            <input
              id="cnpj"
              type="text"
              placeholder="00.000.000/0001-00"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              className="fenix-input mt-1 w-full rounded-lg border px-4 py-2 font-mono text-sm"
            />
          </div>
          <div>
            <label htmlFor="domain" className="block text-sm font-medium text-[#f1f1f1]/90">
              Domínio
            </label>
            <input
              id="domain"
              type="text"
              placeholder="empresa.com.br"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="fenix-input mt-1 w-full rounded-lg border px-4 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <span className="block text-sm font-medium text-[#f1f1f1]/90">
            Datasets (custo por dataset)
          </span>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {DATASETS.map(({ value, label }) => (
              <label key={value} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={datasets.includes(value)}
                  onChange={() => toggleDataset(value)}
                  className="rounded border-[#D5B170]/30 text-[#D5B170] focus:ring-[#D5B170]/50"
                />
                <span className="text-sm text-[#f1f1f1]">{label}</span>
              </label>
            ))}
            <button
              type="button"
              onClick={selectAllDatasets}
              className="text-xs text-[#D5B170] hover:underline"
            >
              Todos
            </button>
            <button
              type="button"
              onClick={clearDatasets}
              className="text-xs text-[#f1f1f1]/60 hover:underline"
            >
              Apenas básico
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="fenix-btn-primary inline-flex items-center gap-2 rounded-lg px-6 py-2.5 font-medium transition disabled:opacity-50"
        >
          {loading && (
            <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          {loading ? "Consultando…" : "Consultar"}
        </button>
      </form>

      {error && (
        <div className="mt-6">
          <ErrorAlert
            message={error.message ?? "Erro"}
            code={error.code}
            onDismiss={() => setError(null)}
          />
        </div>
      )}

      {result?.success && result.data && (
        <div className="mt-8 space-y-6">
          <ResultDisplay
            type="company"
            data={result.data}
            costFormatted={result.costFormatted}
          />
          {result.data.cnpj && (
            <ProcessosCard cnpj={String(result.data.cnpj).padStart(14, "0")} />
          )}
        </div>
      )}
    </div>
  );
}
