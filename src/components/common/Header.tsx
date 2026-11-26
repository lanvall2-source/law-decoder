"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale, FileSearch, BookOpen, FileText, Compass } from "lucide-react";

const NAV_ITEMS = [
  { href: "/review", label: "계약서 해독", icon: FileSearch },
  { href: "/terms", label: "법률용어 번역", icon: BookOpen },
  { href: "/lawsuit", label: "소장 도우미", icon: FileText },
  { href: "/guides", label: "체크 가이드", icon: Compass },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="print:hidden sticky top-0 z-40 w-full bg-[#0F172A] text-white border-b border-slate-800 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
            <Scale className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-semibold tracking-tight leading-none">
              계약서·생활법률 해독기
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  active
                    ? "bg-white text-slate-900"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Bottom Fixed Nav (Thumb-optimized) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[11px] font-bold transition-colors ${
                active ? "text-[#0F172A] bg-slate-100" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${active ? "text-amber-600" : ""}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
