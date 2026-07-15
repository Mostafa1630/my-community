"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";

export interface SidebarItem {
  href: string;
  label: string;
  // Pre-rendered icon element (e.g. <LayoutDashboard size={16} />), NOT a component
  // reference. This file is a Client Component, and its parent layouts are Server
  // Components — passing an un-rendered component/function across that boundary
  // is not serializable and throws at runtime. Passing an already-created element
  // works fine because React elements are serializable across the RSC boundary.
  icon: ReactNode;
}

export default function DashboardSidebar({ title, items }: { title: string; items: SidebarItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const closeOnScroll = () => setOpen(false);
    window.addEventListener("scroll", closeOnScroll, { passive: true });
    return () => window.removeEventListener("scroll", closeOnScroll);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const navList = (onNavigate?: () => void) => (
    <nav className="flex flex-col gap-1.5">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active ? "bg-primary-500 text-white shadow-card" : "text-ink/65 hover:bg-primary-50 hover:text-primary-700"
            }`}
          >
            {item.icon}
            <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile: menu button that opens an off-canvas sidebar */}
      <div className="lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-2.5 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm font-medium text-ink shadow-card"
        >
          <Menu size={18} />
          {title}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <aside className="absolute top-0 start-0 flex h-full w-72 max-w-[85%] flex-col gap-4 overflow-y-auto bg-surface p-4 shadow-raised">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">{title}</p>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink/50 hover:bg-ink/5"
                aria-label="close"
              >
                <X size={16} />
              </button>
            </div>
            {navList(() => setOpen(false))}
          </aside>
        </div>
      )}

      {/* Desktop: static vertical sidebar */}
      <aside className="hidden w-60 shrink-0 lg:block">
        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-ink/40">{title}</p>
        {navList()}
      </aside>
    </>
  );
}
