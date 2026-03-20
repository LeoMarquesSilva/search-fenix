"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Home,
  LayoutDashboard,
  History,
  Bookmark,
  Building2,
  Filter,
  User,
  Phone,
  Mail,
  Users,
  Shield,
} from "lucide-react";
import { NavUser } from "./NavUser";

const BASE_LINKS = [
  { href: "/", label: "Início", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/historico", label: "Histórico", icon: History },
  { href: "/buscas-salvas", label: "Buscas salvas", icon: Bookmark },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/empresas", label: "Empresa por CNPJ", icon: Building2 },
  { href: "/empresas/filtros", label: "Busca Avançada", icon: Filter },
  { href: "/cpf", label: "CPF", icon: User },
  { href: "/contatos/telefones", label: "Telefones", icon: Phone },
  { href: "/contatos/emails", label: "Emails", icon: Mail },
];

const ADMIN_LINKS = [{ href: "/admin/usuarios", label: "Admin", icon: Shield }];

interface AppSidebarProps {
  isAdmin: boolean;
  user: { email?: string; id: string; avatar_url?: string; name?: string } | null;
}

export function AppSidebar({ isAdmin, user }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border bg-sidebar">
      <SidebarRail className="hover:after:bg-sidebar-primary/30" />
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight text-sidebar-foreground">
          SearchFênix
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {[...BASE_LINKS, ...(isAdmin ? ADMIN_LINKS : [])].map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    render={
                      <Link href={href} className="text-sidebar-foreground/90 hover:text-sidebar-accent-foreground">
                        <Icon className="size-4" aria-hidden />
                        <span>{label}</span>
                      </Link>
                    }
                    isActive={pathname === href || (href !== "/" && pathname.startsWith(href))}
                    tooltip={label}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
