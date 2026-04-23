import Link from "next/link";
import { Screenshot, Callout } from "@/components/docs/doc-components";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Locataires — Documentation Jappalé Immo",
};

export default function LocatairesPage() {
  return (
    <>
      <h1>Locataires</h1>
      <p className="text-lg text-muted-foreground !mt-4">
        Créez les fiches de vos locataires, gérez leurs informations et donnez-leur accès
        à leur espace personnel.
      </p>

      <h2>Créer un locataire</h2>

      <p>
        Depuis le tableau de bord, allez dans <strong>Locataires → Ajouter un locataire</strong>.
      </p>

      <Screenshot
        caption="Formulaire de création d'un locataire avec informations personnelles et CNI."
        filename="locataires/01-new-tenant.png"
      />

      <h3>Informations obligatoires</h3>

      <ul>
        <li><strong>Prénom</strong></li>
        <li><strong>Nom</strong></li>
        <li><strong>Téléphone</strong> (format sénégalais : 77XXXXXXX ou +221 77XXXXXXX)</li>
      </ul>

      <h3>Informations recommandées</h3>

      <ul>
        <li><strong>Email</strong> — nécessaire pour envoyer l'invitation à l'espace locataire</li>
        <li><strong>Numéro CNI</strong> — pièce d'identité</li>
        <li><strong>Adresse personnelle</strong></li>
        <li><strong>Profession</strong></li>
      </ul>

      <Callout type="tip" title="L'email est crucial">
        Sans email, vous ne pourrez pas inviter votre locataire sur son espace personnel.
        Il ne pourra donc pas consulter son solde ni télécharger ses quittances.
      </Callout>

      <h2>Liste des locataires</h2>

      <p>
        La page <strong>Locataires</strong> vous affiche tous vos locataires avec en un coup d'œil :
      </p>

      <ul>
        <li>Leur nom complet et leurs coordonnées</li>
        <li>Le bien qu'ils louent actuellement (s'ils ont un bail actif)</li>
        <li>Le statut de leurs paiements</li>
      </ul>

      <Screenshot
        caption="Liste des locataires avec filtres par statut."
        filename="locataires/02-tenants-list.png"
      />

      <h2>Voir les détails d'un locataire</h2>

      <p>
        Cliquez sur un locataire pour voir sa fiche complète :
      </p>

      <ul>
        <li>Coordonnées complètes</li>
        <li>Copie de la CNI (si uploadée)</li>
        <li>Bail(s) en cours</li>
        <li>Historique des paiements</li>
        <li>Signalements effectués</li>
      </ul>

      <Screenshot
        caption="Fiche détaillée d'un locataire."
        filename="locataires/03-tenant-detail.png"
      />

      <h2>Inviter le locataire sur son espace</h2>

      <p>
        Pour que le locataire puisse consulter son portail, vous devez l'inviter :
      </p>

      <ol>
        <li>Sur la fiche du locataire, cliquez sur <strong>Inviter sur l&apos;espace locataire</strong></li>
        <li>Un email est envoyé avec un lien sécurisé</li>
        <li>Le locataire clique sur le lien, définit son mot de passe et accède à son espace</li>
      </ol>

      <Screenshot
        caption="Bouton d'invitation sur l'espace locataire."
        filename="locataires/04-invite-button.png"
      />

      <Callout type="info" title="Alternative : lien direct WhatsApp">
        Si votre locataire n'utilise pas son email, vous pouvez aussi copier le lien d'invitation
        et l'envoyer par WhatsApp. Il fonctionnera exactement de la même façon.
      </Callout>

      <h2>Un locataire avec plusieurs baux</h2>

      <p>
        Si un locataire loue plusieurs biens chez vous, créez simplement un nouveau bail pour chaque bien.
        Le même locataire peut avoir plusieurs baux simultanés — il verra un <strong>sélecteur de bail</strong>
        dans son espace pour passer de l'un à l'autre.
      </p>

      <Screenshot
        caption="Sélecteur de bail dans l'espace locataire (visible uniquement si plusieurs baux)."
        filename="locataires/05-multi-leases.png"
      />

      <h2>Modifier un locataire</h2>

      <p>
        Sur la fiche du locataire, cliquez sur <strong>Modifier</strong>.
        Vous pouvez mettre à jour toutes ses informations sauf son email
        (l'email est lié au compte d'authentification une fois l'invitation acceptée).
      </p>

      <h2>Supprimer un locataire</h2>

      <Callout type="warning" title="Attention à la suppression">
        Supprimer un locataire supprime aussi <strong>tous ses baux et paiements</strong>.
        Préférez plutôt clôturer son bail (le passer en "Terminé") pour conserver l'historique.
      </Callout>

      <div className="not-prose mt-8 pt-6 border-t flex items-center justify-between">
        <Link href="/aide/biens" className="text-sm text-muted-foreground hover:text-foreground">
          ← Biens immobiliers
        </Link>
        <Link href="/aide/baux" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          Suite : Baux & contrats <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </>
  );
}
