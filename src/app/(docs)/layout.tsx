"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Building2, Menu, X, Rocket, Home, Users, FileText, CreditCard,
  Wrench, Download, Settings, Crown, UserCircle, BookOpen,
  FileDown,
} from "lucide-react";

const navSections = [
  {
    title: "Introduction",
    items: [
      { href: "/aide",             label: "Bienvenue",              icon: BookOpen,   pdf: "00-introduction.pdf" },
      { href: "/aide/demarrage",   label: "Premiers pas",           icon: Rocket,     pdf: "01-demarrage.pdf" },
    ],
  },
  {
    title: "Gestion courante",
    items: [
      { href: "/aide/biens",            label: "Biens immobiliers",       icon: Home,        pdf: "02-biens.pdf" },
      { href: "/aide/locataires",       label: "Locataires",              icon: Users,       pdf: "03-locataires.pdf" },
      { href: "/aide/baux",             label: "Baux & contrats",         icon: FileText,    pdf: "04-baux.pdf" },
      { href: "/aide/paiements",        label: "Paiements",               icon: CreditCard,  pdf: "05-paiements.pdf" },
      { href: "/aide/signalements",     label: "Signalements",            icon: Wrench,      pdf: "06-signalements.pdf" },
      { href: "/aide/documents",        label: "Quittances & documents",  icon: Download,    pdf: "07-documents.pdf" },
    ],
  },
  {
    title: "Administration",
    items: [
      { href: "/aide/parametres",  label: "Paramètres",     icon: Settings,  pdf: "08-parametres.pdf" },
      { href: "/aide/abonnement",  label: "Abonnement",     icon: Crown,     pdf: "09-abonnement.pdf" },
    ],
  },
  {
    title: "Côté locataire",
    items: [
      { href: "/aide/espace-locataire", label: "Espace locataire", icon: UserCircle,  pdf: "10-espace-locataire.pdf" },
    ],
  },
];

const allItems = navSections.flatMap((s) => s.items);

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentItem = allItems.find((i) => i.href === pathname);
  const currentPdf = currentItem?.pdf;

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-bold">Jappalé Immo</span>
            <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">· Documentation</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden sm:block">
              <Button variant="ghost" size="sm">Retour au site</Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Se connecter</Button>
            </Link>
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <nav className="sticky top-20 space-y-6">
            {navSections.map((section) => (
              <div key={section.title}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
                  {section.title}
                </p>
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                            active
                              ? "bg-primary text-primary-foreground font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Sidebar mobile overlay */}
        {mobileOpen && (
          <div
            className="lg:hidden fixed inset-0 z-30 bg-black/30"
            onClick={() => setMobileOpen(false)}
          >
            <div
              className="absolute left-0 top-14 bottom-0 w-72 bg-white overflow-y-auto p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="space-y-6">
                {navSections.map((section) => (
                  <div key={section.title}>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
                      {section.title}
                    </p>
                    <ul className="space-y-0.5">
                      {section.items.map((item) => {
                        const active = pathname === item.href;
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                                active
                                  ? "bg-primary text-primary-foreground font-medium"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              )}
                            >
                              <item.icon className="h-4 w-4 shrink-0" />
                              {item.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Contenu */}
        <main className="flex-1 min-w-0">
          {/* Barre d'actions (cachée en print) */}
          <div className="no-print mb-4 flex items-center justify-end gap-2 flex-wrap">
            {currentPdf && (
              <a href={`/docs/pdfs/${currentPdf}`} download>
                <Button size="sm" variant="outline" className="gap-2">
                  <FileDown className="h-4 w-4" />
                  Télécharger cette section (PDF)
                </Button>
              </a>
            )}
            <a href="/docs/pdfs/guide-complet.pdf" download>
              <Button size="sm" className="gap-2">
                <FileDown className="h-4 w-4" />
                Guide complet (PDF)
              </Button>
            </a>
          </div>

          <article className="doc-content bg-white rounded-xl border p-6 sm:p-10 max-w-3xl">
            {children}
          </article>
        </main>
      </div>
    </div>
  );
}
