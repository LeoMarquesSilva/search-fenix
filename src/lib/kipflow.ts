import type {
  CompanySearchResponseDto,
  CompanyFilterRequestDto,
  CompanyFilterResponseDto,
  CpfResponseDto,
  ContactSearchResponseDto,
  EmailSearchResponseDto,
} from "./types";
import type { CompanyDataset } from "./types";

const BASE_URL =
  process.env.KIPFLOW_BASE_URL || "https://api.kipflow.io";
const TIMEOUT_MS = 30000;
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE_MS = 1000;

function getApiKey(): string {
  const key = process.env.KIPFLOW_API_KEY;
  if (!key) {
    throw new Error("KIPFLOW_API_KEY não configurada. Configure em .env.local");
  }
  return key;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function kipflowFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const apiKey = getApiKey();
  const url = `${BASE_URL}${path}`;

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = (await response.json().catch(() => ({}))) as
        | T
        | { success?: boolean; error?: { code?: string; message?: string; ttl?: number } };

      if (response.status === 429) {
        const err = data as { error?: { ttl?: number } };
        const ttl = err?.error?.ttl ?? RETRY_DELAY_BASE_MS * Math.pow(2, attempt);
        if (attempt < MAX_RETRIES - 1) {
          await sleep(ttl);
          continue;
        }
        throw new Error(
          `RATE_LIMIT_EXCEEDED: Limite de requisições excedido. Aguarde alguns segundos.`
        );
      }

      if (!response.ok) {
        const err = data as { error?: { code?: string; message?: string } };
        const code = err?.error?.code ?? "UNKNOWN";
        const message = err?.error?.message ?? response.statusText;
        throw new Error(`${code}: ${message}`);
      }

      return data as T;
    } catch (err) {
      lastError =
        err instanceof Error ? err : new Error(String(err));
      if (
        lastError.message.includes("RATE_LIMIT_EXCEEDED") ||
        lastError.message.includes("429")
      ) {
        if (attempt < MAX_RETRIES - 1) {
          await sleep(RETRY_DELAY_BASE_MS * Math.pow(2, attempt));
          continue;
        }
      }
      throw lastError;
    }
  }

  throw lastError ?? new Error("Falha na requisição");
}

export async function getCompanyByCnpj(
  cnpj?: string,
  domain?: string,
  datasets: CompanyDataset[] = ["basic"]
): Promise<CompanySearchResponseDto> {
  if (!cnpj && !domain) {
    throw new Error("Informe cnpj ou domain");
  }
  const params = new URLSearchParams();
  if (cnpj) params.set("cnpj", cnpj.replace(/\D/g, ""));
  if (domain) params.set("domain", domain);
  if (datasets.length) params.set("datasets", datasets.join(","));
  const query = params.toString();
  return kipflowFetch<CompanySearchResponseDto>(
    `/companies/v1/search${query ? `?${query}` : ""}`
  );
}

export async function searchCompaniesWithFilters(
  body: CompanyFilterRequestDto
): Promise<CompanyFilterResponseDto> {
  return kipflowFetch<CompanyFilterResponseDto>("/companies/v1/search", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getCpf(
  cpf: string,
  datasets: string[] = ["basic"]
): Promise<CpfResponseDto> {
  const clean = cpf.replace(/\D/g, "");
  if (clean.length !== 11) {
    throw new Error("CPF deve ter 11 dígitos");
  }
  const params = new URLSearchParams({ cpf: clean });
  if (datasets.length) params.set("datasets", datasets.join(","));
  return kipflowFetch<CpfResponseDto>(
    `/cpf/v1/search?${params.toString()}`
  ).catch(() =>
    kipflowFetch<CpfResponseDto>(`/people/v1/search?${params.toString()}`)
  );
}

export async function getPhones(
  cnpj?: string,
  domain?: string,
  options: {
    phone_limit?: number;
    exclude_contador?: boolean;
    only_whatsapp?: boolean;
    tipo?: "FIXO" | "MOVEL";
  } = {}
): Promise<ContactSearchResponseDto> {
  if (!cnpj && !domain) {
    throw new Error("Informe cnpj ou domain");
  }
  const params = new URLSearchParams();
  if (cnpj) params.set("cnpj", cnpj.replace(/\D/g, ""));
  if (domain) params.set("domain", domain);
  params.set("phone_limit", String(options.phone_limit ?? 10));
  if (options.exclude_contador !== undefined)
    params.set("exclude_contador", String(options.exclude_contador));
  if (options.only_whatsapp !== undefined)
    params.set("only_whatsapp", String(options.only_whatsapp));
  if (options.tipo) params.set("tipo", options.tipo);
  return kipflowFetch<ContactSearchResponseDto>(
    `/contacts/v1/phones?${params.toString()}`
  );
}

export async function getEmails(
  cnpj?: string,
  domain?: string,
  emailLimit = 10
): Promise<EmailSearchResponseDto> {
  if (!cnpj && !domain) {
    throw new Error("Informe cnpj ou domain");
  }
  const params = new URLSearchParams();
  if (cnpj) params.set("cnpj", cnpj.replace(/\D/g, ""));
  if (domain) params.set("domain", domain);
  params.set("email_limit", String(Math.min(50, Math.max(1, emailLimit))));
  return kipflowFetch<EmailSearchResponseDto>(
    `/contacts/v1/emails?${params.toString()}`
  );
}
