import type { CompanyDto } from "@/lib/types";

interface CompanyCardProps {
  company: CompanyDto;
  costFormatted?: string;
}

function Field({ label, value }: { label: string; value?: string | number | boolean }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="grid gap-1">
      <span className="text-xs font-medium uppercase tracking-wider text-[#f1f1f1]/60">
        {label}
      </span>
      <span className="text-sm text-[#f1f1f1]">
        {typeof value === "boolean" ? (value ? "Sim" : "Não") : String(value)}
      </span>
    </div>
  );
}

export function CompanyCard({ company, costFormatted }: CompanyCardProps) {
  return (
    <article className="fenix-card-full rounded-xl border p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-xl font-semibold text-[#f1f1f1]">
          {company.razao_social ?? company.nome_fantasia ?? "—"}
        </h2>
        {costFormatted && (
          <span className="text-xs text-[#f1f1f1]/60">
            Custo: {costFormatted}
          </span>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="CNPJ" value={company.cnpj} />
        <Field label="Nome Fantasia" value={company.nome_fantasia} />
        <Field label="Situação" value={company.situacao_cadastral} />
        <Field label="Porte" value={company.porte} />
        <Field label="Natureza Jurídica" value={company.natureza_juridica} />
        <Field label="Data Início" value={company.data_inicio_atividade} />
        <Field label="Endereço" value={company.endereco} />
        <Field label="Bairro" value={company.bairro} />
        <Field label="Município" value={company.municipio} />
        <Field label="UF" value={company.uf} />
        <Field label="CEP" value={company.cep} />
        <Field label="Segmento" value={company.segmento} />
        <Field label="Capital Social" value={company.capital_social != null ? `R$ ${company.capital_social.toLocaleString("pt-BR")}` : undefined} />
        <Field label="Faixa Faturamento" value={company.faixa_faturamento_grupo} />
        <Field label="Faixa Funcionários" value={company.faixa_funcionarios_grupo} />
        <Field label="Forma Tributação" value={company.forma_de_tributacao} />
      </div>

      {company.cnae_principal_desc_subclasse && (
        <div className="mt-4 border-t border-[#D5B170]/20 pt-4">
          <Field label="CNAE Principal" value={company.cnae_principal_desc_subclasse} />
        </div>
      )}

      {company.telefones && company.telefones.length > 0 && (
        <div className="mt-4 border-t border-[#D5B170]/20 pt-4">
          <span className="text-xs font-medium uppercase tracking-wider text-[#f1f1f1]/60">
            Telefones
          </span>
          <ul className="mt-1 space-y-1">
            {company.telefones.map((t, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span>{t.telefone_completo}</span>
                {t.whatsapp && (
                  <span className="rounded bg-[#D5B170]/20 px-1.5 py-0.5 text-xs text-[#D5B170]">
                    WhatsApp
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {company.sites && company.sites.length > 0 && (
        <div className="mt-4 border-t border-[#D5B170]/20 pt-4">
          <span className="text-xs font-medium uppercase tracking-wider text-[#f1f1f1]/60">
            Sites
          </span>
          <ul className="mt-1 space-y-1">
            {company.sites.map((s, i) => (
              <li key={i}>
                <a
                  href={`https://${s.site}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fenix-link text-sm underline"
                >
                  {s.site}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {company.emails && company.emails.length > 0 && (
        <div className="mt-4 border-t border-[#D5B170]/20 pt-4">
          <span className="text-xs font-medium uppercase tracking-wider text-[#f1f1f1]/60">
            Emails
          </span>
          <ul className="mt-1 space-y-1">
            {company.emails.map((e, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                {e.nome && <span className="text-[#f1f1f1]/60">{e.nome}:</span>}
                <a href={`mailto:${e.email}`} className="fenix-link hover:underline">
                  {e.email}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(company.facebook?.length || company.instagram?.length || company.linkedin_url || company.twitter) ? (
        <div className="mt-4 border-t border-[#D5B170]/20 pt-4">
          <span className="text-xs font-medium uppercase tracking-wider text-[#f1f1f1]/60">
            Redes Sociais
          </span>
          <ul className="mt-1 space-y-1">
            {company.facebook?.map((f, i) => (
              <li key={`fb-${i}`}>
                <a href={`https://${f.url}`} target="_blank" rel="noopener noreferrer" className="fenix-link text-sm hover:underline">
                  Facebook: {f.url}
                </a>
              </li>
            ))}
            {company.instagram?.map((ig, i) => (
              <li key={`ig-${i}`}>
                <a href={`https://${ig.url}`} target="_blank" rel="noopener noreferrer" className="fenix-link text-sm hover:underline">
                  Instagram: {ig.url}
                </a>
              </li>
            ))}
            {company.linkedin_url && (
              <li>
                <a href={`https://${company.linkedin_url}`} target="_blank" rel="noopener noreferrer" className="fenix-link text-sm hover:underline">
                  LinkedIn: {company.linkedin_url}
                </a>
              </li>
            )}
            {company.twitter && (
              <li>
                <a href={`https://${company.twitter}`} target="_blank" rel="noopener noreferrer" className="fenix-link text-sm hover:underline">
                  Twitter: {company.twitter}
                </a>
              </li>
            )}
          </ul>
        </div>
      ) : null}

      {company.atividades_secundarias && company.atividades_secundarias.length > 0 && (
        <div className="mt-4 border-t border-[#D5B170]/20 pt-4">
          <span className="text-xs font-medium uppercase tracking-wider text-[#f1f1f1]/60">
            Atividades Secundárias (CNAE)
          </span>
          <ul className="mt-1 space-y-1">
            {company.atividades_secundarias.map((a, i) => (
              <li key={i} className="text-sm">
                {a.desc_subclasse ?? a.desc_classe ?? `${a.classe}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {company.socios && company.socios.length > 0 && (
        <div className="mt-4 border-t border-[#D5B170]/20 pt-4">
          <span className="text-xs font-medium uppercase tracking-wider text-[#f1f1f1]/60">
            Sócios
          </span>
          <ul className="mt-1 space-y-2">
            {company.socios.map((s, i) => (
              <li key={i} className="rounded-lg border border-[#D5B170]/20 px-3 py-2 text-sm">
                <div className="font-medium">{s.nome_socio ?? s.nome_com_cnpj_cpf}</div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#f1f1f1]/60">
                  {s.qualificacao_socio && <span>Qualificação: {s.qualificacao_socio}</span>}
                  {s.data_entrada_sociedade && <span>Entrada: {s.data_entrada_sociedade}</span>}
                  {s.faixa_etaria_socio && <span>Faixa etária: {s.faixa_etaria_socio}</span>}
                  {s.sexo && <span>Sexo: {s.sexo}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {company.divida && (company.divida.dividas?.length || company.divida.total) && (
        <div className="mt-4 border-t border-[#D5B170]/20 pt-4">
          <span className="text-xs font-medium uppercase tracking-wider text-[#f1f1f1]/60">
            Dívida Ativa da União
          </span>
          <div className="mt-1 space-y-2">
            {(company.divida.total ?? 0) > 0 && (
              <div className="text-sm">
                <span className="font-medium">Total consolidado: </span>
                R$ {(company.divida.total ?? 0).toLocaleString("pt-BR")}
                {company.divida.total_previdenciaria != null && company.divida.total_previdenciaria > 0 && (
                  <span className="ml-2 text-[#f1f1f1]/60">(Prev: R$ {company.divida.total_previdenciaria.toLocaleString("pt-BR")})</span>
                )}
                {company.divida.total_nao_previdenciaria != null && company.divida.total_nao_previdenciaria > 0 && (
                  <span className="ml-2 text-[#f1f1f1]/60">(Não prev: R$ {company.divida.total_nao_previdenciaria.toLocaleString("pt-BR")})</span>
                )}
              </div>
            )}
            {company.divida.dividas?.map((d, i) => (
              <div key={i} className="rounded-lg border border-[#D5B170]/40 bg-[#D5B170]/10 px-3 py-2 text-sm">
                <div className="font-medium">{d.nome_devedor}</div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#f1f1f1]/60">
                  {d.valor_consolidado != null && <span>Valor: R$ {d.valor_consolidado.toLocaleString("pt-BR")}</span>}
                  {d.tipo_divida && <span>Tipo: {d.tipo_divida}</span>}
                  {d.data_inscricao && <span>Inscrição: {d.data_inscricao}</span>}
                  {d.situacao_inscricao && <span>{d.situacao_inscricao}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
