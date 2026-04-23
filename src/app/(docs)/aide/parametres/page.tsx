import Link from "next/link";
import { Screenshot, Callout } from "@/components/docs/doc-components";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Paramètres — Documentation Jappalé Immo",
};

export default function ParametresPage() {
  return (
    <>
      <h1>Paramètres</h1>
      <p className="text-lg text-muted-foreground !mt-4">
        Configurez votre profil, votre agence et invitez des collaborateurs.
      </p>

      <h2>Mon profil</h2>

      <p>
        Depuis le menu, cliquez sur <strong>Paramètres</strong>. L&apos;onglet <strong>Profil</strong>
        contient vos informations personnelles.
      </p>

      <Screenshot
        caption="Page de paramètres — onglet Profil."
        filename="parametres/01-profile.png"
      />

      <h3>Champs importants</h3>

      <ul>
        <li><strong>Prénom et nom</strong></li>
        <li><strong>Téléphone</strong> — affiché aux locataires pour le bouton WhatsApp</li>
        <li><strong>Email</strong> — votre identifiant de connexion</li>
        <li><strong>Adresse</strong> — l&apos;adresse physique de votre agence</li>
      </ul>

      <Callout type="tip" title="Affiché dans l'espace locataire">
        Votre téléphone, email et adresse sont visibles par vos locataires dans la section
        <strong> Contact agence</strong> de leur espace. Assurez-vous que ces informations
        sont à jour et professionnelles.
      </Callout>

      <h2>Mon agence</h2>

      <p>
        Dans l&apos;onglet <strong>Organisation</strong>, vous pouvez modifier le nom de votre agence.
      </p>

      <Screenshot
        caption="Configuration de l'organisation (nom de l'agence)."
        filename="parametres/02-organization.png"
      />

      <Callout type="info">
        Le nom de l&apos;agence apparaît sur les quittances, dans l&apos;espace locataire et dans
        tous les emails envoyés à vos locataires.
      </Callout>

      <h2>Inviter un collaborateur</h2>

      <p>
        Dans <strong>Paramètres → Équipe</strong>, vous pouvez inviter d&apos;autres personnes
        à rejoindre votre agence.
      </p>

      <Screenshot
        caption="Gestion de l'équipe : liste des membres et invitations en attente."
        filename="parametres/03-team.png"
      />

      <h3>Les rôles disponibles</h3>

      <div className="not-prose my-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-2 px-3 font-semibold">Rôle</th>
              <th className="text-left py-2 px-3 font-semibold">Permissions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-3 font-semibold">Administrateur</td>
              <td className="py-2 px-3">Tous les droits, y compris facturation et gestion d&apos;équipe</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3 font-semibold">Manager</td>
              <td className="py-2 px-3">Gestion des biens, locataires, baux et paiements</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3 font-semibold">Agent</td>
              <td className="py-2 px-3">Consultation et saisie, pas de suppression</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3 font-semibold">Comptable</td>
              <td className="py-2 px-3">Accès aux paiements et quittances uniquement</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-semibold">Secrétaire</td>
              <td className="py-2 px-3">Saisie locataires et signalements, lecture seule sur le reste</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Envoyer une invitation</h3>

      <ol>
        <li>Cliquez sur <strong>Inviter un membre</strong></li>
        <li>Entrez son email et choisissez un rôle</li>
        <li>Envoyez l&apos;invitation</li>
        <li>La personne reçoit un email avec un lien pour rejoindre l&apos;agence</li>
      </ol>

      <p>
        Vous pouvez aussi donner le <strong>code d&apos;invitation</strong> de votre agence —
        le nouveau collaborateur pourra le saisir lors de son inscription sur <code>/register</code>.
      </p>

      <Callout type="warning" title="Limites selon votre plan">
        Le nombre de membres est limité par votre plan : 1 pour Gratuit, 3 pour Pro,
        10 pour Agence, illimité pour Entreprise.
      </Callout>

      <h2>Changer son mot de passe</h2>

      <p>
        Pour changer votre mot de passe, déconnectez-vous puis sur la page de connexion cliquez
        sur <strong>Mot de passe oublié</strong>. Vous recevrez un email avec un lien de réinitialisation.
      </p>

      <h2>Se déconnecter</h2>

      <p>
        Bouton <strong>Déconnexion</strong> en bas de la barre latérale.
        Déconnectez-vous toujours si vous utilisez un ordinateur partagé.
      </p>

      <div className="not-prose mt-8 pt-6 border-t flex items-center justify-between">
        <Link href="/aide/documents" className="text-sm text-muted-foreground hover:text-foreground">
          ← Quittances & documents
        </Link>
        <Link href="/aide/abonnement" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          Suite : Abonnement <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </>
  );
}
