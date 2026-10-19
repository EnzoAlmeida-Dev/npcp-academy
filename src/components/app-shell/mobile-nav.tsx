"use client";

import { useState } from "react";

import { logoutAction } from "@/features/auth/actions";
import type { NavItem } from "@/lib/navigation";

import { NavList } from "./nav-list";

export function MobileNav({
  items,
  name,
  role,
}: {
  items: NavItem[];
  name: string;
  role: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="rounded-lg p-2 text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
        <span aria-hidden="true" className="block text-lg leading-none">
          {open ? "✕" : "☰"}
        </span>
      </button>

      {open ? (
        <div
          id="mobile-menu"
          className="absolute left-0 right-0 top-full bg-secondary px-4 py-3 shadow-card"
        >
          <NavList items={items} onNavigate={() => setOpen(false)} />
          <div className="mt-3 border-t border-white/10 pt-3">
            <p className="text-sm text-white">
              {name} · {role}
            </p>
            <form action={logoutAction}>
              <button
                type="submit"
                className="mt-2 text-sm text-white/70 underline hover:text-white"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
