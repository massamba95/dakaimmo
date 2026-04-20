import Link from "next/link";
import { Building2 } from "lucide-react";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-7 w-7 text-primary" />
            <span className="text-lg font-bold">Jappalé Immo</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/cgu" className="text-muted-foreground hover:text-foreground">
              CGU
            </Link>
            <Link href="/confidentialite" className="text-muted-foreground hover:text-foreground">
              Confidentialité
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 bg-muted/20 py-12">
        <div className="container mx-auto px-4">
          <article className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-xl border shadow-sm [&_p]:leading-relaxed [&_p]:text-sm [&_p]:sm:text-base [&_p]:text-foreground/90 [&_p]:mt-3 [&_ul]:text-sm [&_ul]:sm:text-base [&_ul]:text-foreground/90 [&_li]:leading-relaxed [&_a]:underline [&_a]:underline-offset-2 [&_h2]:border-t [&_h2]:pt-6 [&_h2:first-of-type]:border-t-0 [&_h2:first-of-type]:pt-0">
            {children}
          </article>
        </div>
      </main>

      <footer className="border-t py-6 bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; 2026 Jappalé Immo ·{" "}
          <Link href="/" className="hover:text-foreground">Retour à l&apos;accueil</Link>
        </div>
      </footer>
    </div>
  );
}
