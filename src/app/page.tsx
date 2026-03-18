import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Search,
  User,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
  params?: Promise<Record<string, string>>;
};

const cards = [
  {
    href: "/dashboard",
    title: "Dashboard de Gastos",
    description: "Acompanhe custos, histórico e preços por consulta",
    icon: LayoutDashboard,
  },
  {
    href: "/empresas",
    title: "Empresa por CNPJ",
    description: "Consulte dados cadastrais por CNPJ ou domínio",
    icon: Building2,
  },
  {
    href: "/empresas/filtros",
    title: "Busca Avançada",
    description: "Filtre empresas por situação, CNAE, localização e mais",
    icon: Search,
  },
  {
    href: "/cpf",
    title: "Consulta CPF",
    description: "Dados de pessoa física por CPF",
    icon: User,
  },
  {
    href: "/contatos/telefones",
    title: "Telefones",
    description: "Busque telefones de empresa por CNPJ ou domínio",
    icon: Phone,
  },
  {
    href: "/contatos/emails",
    title: "Emails",
    description: "Gere emails de pessoas da empresa via LinkedIn",
    icon: Mail,
  },
];

export default async function Home({ searchParams, params }: PageProps) {
  await Promise.all([searchParams ?? Promise.resolve({}), params ?? Promise.resolve({})]);
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-16 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-[#f1f1f1] sm:text-5xl">
          SearchFênix
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-[#f1f1f1]/70">
          Consulte dados empresariais e pessoais de forma rápida e confiável.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={href} className="group block cursor-pointer">
            <Card className="h-full transition-all duration-200 hover:border-[#D5B170]/50 hover:shadow-lg hover:shadow-[#D5B170]/10">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[#D5B170]/15 text-[#D5B170] transition-colors group-hover:bg-[#D5B170]/25">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </div>
                <CardTitle className="group-hover:text-[#D5B170] transition-colors">
                  {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent />
              <CardFooter>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-[#D5B170]">
                  Acessar
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
