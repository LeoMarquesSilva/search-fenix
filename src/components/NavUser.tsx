"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogIn, LogOut } from "lucide-react";

interface NavUserProps {
  user: { email?: string; id: string } | null;
}

export function NavUser({ user }: NavUserProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden text-sm text-[#f1f1f1]/70 sm:inline" title={user.email}>
          {user.email}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-[#f1f1f1]/80 transition hover:bg-[#D5B170]/10 hover:text-[#D5B170]"
          aria-label="Sair"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Sair
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-[#f1f1f1]/80 transition hover:bg-[#D5B170]/10 hover:text-[#D5B170]"
    >
      <LogIn className="h-4 w-4" aria-hidden />
      Entrar
    </Link>
  );
}
