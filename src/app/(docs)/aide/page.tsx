import Link from "next/link";
import {
  Rocket, Home, Users, FileText, CreditCard, Wrench, Download,
  Settings, Crown, UserCircle, ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Documentation — Jappalé Immo",
  description: "Guide complet d'utilisation de Jappalé Immo — gestion immobilière au Sénégal.",
};

const sections = [
  { href: "/aide/demarrage",        icon: Rocket,      title: "Premiers pas",            desc: "Créer votre compte et configurer votre agence en moins de 10 minutes." },
  { href: "/aide/biens",            icon: Home,        title: "Biens immobiliers",       desc: "Ajouter, modifier et gérer vos biens — résidences, appartements, terrains." },
  { href: "/aide/locataires",       icon: Users,       title: "Locataires",              desc: "Créer les dossiers locataires et leur donner accès à leur espace personnel." },
  { href: "/aide/baux",             icon: FileText,    title: "Baux & contrats",         desc: "Associer un locataire à un bien, fixer le loyer et la caution." },
  { href: "/aide/paiements",        icon: CreditCard,  title: "Paiements",               desc: "Enregistrer les encaissements, gérer les retards et paiements partiels." },
  { href: "/aide/signalements",     icon: Wrench,      title: "Signalements",            desc: "Traiter les demandes d'intervention envoyées par vos locataires." },
  { href: "/aide/documents",        icon: Download,    title: "Quittances & documents",  desc: "Générer et télécharger les quittances de loyer officielles en PDF." },
  { href: "/aide/parametres",       icon: Settings,    title: "Paramètres",              desc: "Configurer votre profil, votre agence et inviter des collaborateurs." },
  { href: "/aide/abonnement",       icon: Crown,       title: "Abonnement",              desc: "Changer de plan, payer par Wave ou Orange Money, gérer votre facturation." },
  { href: "/aide/espace-locataire", icon: UserCircle,  title: "Espace locataire",        desc: "Guide à partager avec vos locataires pour qu'ils utilisent leur portail." },
];

export default function AideAccueilPage() {
  return (
    <>
      <h1>Documentation Jappalé Immo</h1>
      <p className="text-lg text-muted-foreground !mt-4">
        Bienvenue dans le guide complet de Jappalé Immo. Vous trouverez ici toutes les instructions
        pour utiliser la plateforme au quotidien — de la création de votre compte à la génération
        des quittances.
      </p>

      <h2>Par où commencer ?</h2>
      <p>
        Si c'est votre première visite, suivez ces trois étapes dans l'ordre :
      </p>
      <ol>
        <li>Lisez la section <Link href="/aide/demarrage">Premiers pas</Link> pour créer votre compte.</li>
        <li>Ajoutez votre premier bien via la section <Link href="/aide/biens">Biens immobiliers</Link>.</li>
        <li>Créez un locataire et un bail en suivant <Link href="/aide/locataires">Locataires</Link> puis <Link href="/aide/baux">Baux</Link>.</li>
      </ol>

      <h2>Toutes les sections</h2>
      <div className="not-prose grid sm:grid-cols-2 gap-3 mt-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group flex items-start gap-3 rounded-lg border bg-card p-4 hover:border-primary hover:shadow-sm transition-all"
          >
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
              <s.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-sm">{s.title}</h3>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <h2>Besoin d'aide ?</h2>
      <p>
        Vous ne trouvez pas la réponse à votre question ? Contactez-nous par WhatsApp ou email :
      </p>
      <ul>
        <li>WhatsApp : <a href="https://wa.me/33745862602" target="_blank" rel="noopener noreferrer">+33 7 45 86 26 02</a></li>
        <li>Email : <a href="mailto:contact@jappaleimmo.com">contact@jappaleimmo.com</a></li>
      </ul>
    </>
  );
}
