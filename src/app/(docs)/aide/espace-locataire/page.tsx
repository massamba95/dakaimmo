import Link from "next/link";
import { Screenshot, Callout } from "@/components/docs/doc-components";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Espace locataire — Documentation Jappalé Immo",
};

export default function EspaceLocatairePage() {
  return (
    <>
      <h1>Espace locataire</h1>
      <p className="text-lg text-muted-foreground !mt-4">
        Ce guide explique ce que voient et ce que peuvent faire vos locataires dans leur espace.
        Vous pouvez le partager avec eux.
      </p>

      <Callout type="info" title="Pour les agences">
        Cette page décrit le point de vue du locataire. Utilisez-la comme support pour former vos
        locataires ou pour répondre à leurs questions.
      </Callout>

      <h2>Comment le locataire accède à son espace</h2>

      <p>
        Quand vous invitez un locataire depuis sa fiche, il reçoit un email contenant un lien
        sécurisé. En cliquant dessus, il arrive sur une page où il définit son mot de passe.
      </p>

      <Screenshot
        caption="Email d'invitation reçu par le locataire."
        filename="locataire/01-invitation-email.png"
      />

      <p>
        Une fois son mot de passe créé, il peut se connecter à tout moment sur
        <a href="https://www.jappaleimmo.com/login?redirect=/locataire" target="_blank" rel="noopener noreferrer"> jappaleimmo.com/login</a>
        avec son email et son mot de passe.
      </p>

      <h2>1. La page d&apos;accueil du locataire</h2>

      <p>
        Au lancement, le locataire voit :
      </p>

      <ul>
        <li>Un <strong>message de bienvenue personnalisé</strong></li>
        <li>Sa <strong>situation de compte</strong> (numéro de contrat, adresse, solde)</li>
        <li>Ses <strong>demandes en cours</strong> (signalements ouverts)</li>
        <li>Les <strong>coordonnées de l&apos;agence</strong> en bas</li>
      </ul>

      <Screenshot
        caption="Page d'accueil de l'espace locataire."
        filename="locataire/02-home.png"
      />

      <Callout type="tip" title="Locataire avec plusieurs baux">
        Si le locataire loue plusieurs biens chez vous, la page d&apos;accueil affiche une mini-carte
        par bail, avec le statut de chacun (à jour ou en retard). Un solde global s&apos;affiche en bas
        si au moins un bail est en retard.
      </Callout>

      <h2>2. Mon contrat</h2>

      <p>
        Dans la section <strong>Mon contrat</strong>, le locataire retrouve :
      </p>

      <ul>
        <li>Numéro unique du bail</li>
        <li>Dates de début et de fin</li>
        <li>Loyer mensuel et caution versée</li>
        <li>Informations du bien loué</li>
      </ul>

      <Screenshot
        caption="Page Mon contrat."
        filename="locataire/03-contract.png"
      />

      <p>
        S&apos;il a plusieurs baux, un sélecteur en haut permet de basculer de l&apos;un à l&apos;autre.
      </p>

      <h2>3. Mes paiements</h2>

      <p>
        Le locataire consulte l&apos;historique complet de ses paiements avec leur statut
        (Payé, En attente, En retard, Partiel).
      </p>

      <Screenshot
        caption="Historique des paiements du locataire."
        filename="locataire/04-payments.png"
      />

      <p>
        Pour chaque paiement <strong>Payé</strong>, un bouton <strong>Télécharger quittance</strong>
        génère le PDF officiel en un clic.
      </p>

      <h2>4. Documents</h2>

      <p>
        La section <strong>Documents</strong> regroupe toutes les quittances générées, triées par mois.
        Le locataire peut les télécharger à tout moment, même des années plus tard.
      </p>

      <Screenshot
        caption="Page Documents avec toutes les quittances."
        filename="locataire/05-documents.png"
      />

      <h2>5. Signaler un problème</h2>

      <p>
        Pour signaler un problème dans son logement (fuite, panne, etc.), le locataire va dans
        <strong> Signaler un problème</strong>.
      </p>

      <Screenshot
        caption="Formulaire de signalement avec catégorie et photos."
        filename="locataire/06-signaler.png"
      />

      <p>Il choisit :</p>

      <ul>
        <li>Une catégorie (Plomberie, Électricité, Chauffage, etc.)</li>
        <li>Un titre court</li>
        <li>Une description détaillée</li>
        <li>Des photos (jusqu&apos;à 3)</li>
      </ul>

      <p>
        Sur la même page, il voit l&apos;historique de ses signalements précédents et leur statut
        (Ouvert, En cours, Résolu).
      </p>

      <h2>6. Mon profil</h2>

      <p>
        Le locataire peut mettre à jour son téléphone directement depuis son espace. Les autres
        informations (nom, email) ne sont modifiables que par l&apos;agence.
      </p>

      <Screenshot
        caption="Page Mon profil côté locataire."
        filename="locataire/07-profile.png"
      />

      <h2>Mot de passe oublié</h2>

      <p>
        Si le locataire oublie son mot de passe, il clique sur <strong>Mot de passe oublié</strong>
        sur la page de connexion. Un email de réinitialisation lui est envoyé.
      </p>

      <h2>Contacter l&apos;agence</h2>

      <p>
        En bas de la page d&apos;accueil, le locataire voit les coordonnées de l&apos;agence
        (téléphone, email, adresse) et peut :
      </p>

      <ul>
        <li>Appeler directement en cliquant sur le numéro</li>
        <li>Envoyer un email en cliquant sur l&apos;email</li>
        <li>Démarrer une conversation WhatsApp avec le bouton <strong>Contacter l&apos;agence</strong></li>
      </ul>

      <div className="not-prose mt-8 pt-6 border-t flex items-center justify-between">
        <Link href="/aide/abonnement" className="text-sm text-muted-foreground hover:text-foreground">
          ← Abonnement
        </Link>
        <Link href="/aide" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          Retour à l&apos;accueil <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </>
  );
}
