"use client";

import { useEffect, useRef, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={containerRef}>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="rounded-lg p-2 text-white hover:bg-white/10"
      >
        <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
        {open ? (
          <X aria-hidden="true" className="size-5" />
        ) : (
          <Menu aria-hidden="true" className="size-5" />
        )}
      </button>

      {open ? (
        <div
          id="mobile-menu"
          className="absolute left-0 right-0 top-full z-40 bg-secondary px-4 py-3 shadow-card"
        >
          <NavList items={items} onNavigate={() => setOpen(false)} />
          <div className="mt-3 border-t border-white/10 pt-3">
            <p className="text-sm text-white">
              {name} · {role}
            </p>
            <form action={logoutAction}>
              <button
                type="submit"
                className="mt-2 inline-flex items-center gap-2 py-2 text-sm text-white/80 underline hover:text-white"
              >
                <LogOut aria-hidden="true" className="size-4" />
                Sair
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
