import Link from "next/link";
import { Screenshot, Callout, Step } from "@/components/docs/doc-components";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Premiers pas — Documentation Jappalé Immo",
};

export default function DemarragePage() {
  return (
    <>
      <h1>Premiers pas</h1>
      <p className="text-lg text-muted-foreground !mt-4">
        Créez votre compte, configurez votre agence et ajoutez votre premier bien en moins de 10 minutes.
      </p>

      <h2>1. Créer votre compte agence</h2>
      <p>
        Rendez-vous sur <a href="https://www.jappaleimmo.com/register" target="_blank" rel="noopener noreferrer">jappaleimmo.com/register</a> pour créer votre compte.
        Vous avez le choix entre deux options :
      </p>

      <ul>
        <li><strong>Créer une nouvelle agence</strong> — si vous êtes gérant ou propriétaire et lancez votre espace pour la première fois.</li>
        <li><strong>Rejoindre une équipe existante</strong> — si un collègue vous a envoyé un code d'invitation.</li>
      </ul>

      <Screenshot
        caption="Page d'inscription : choix entre créer une agence ou rejoindre une équipe."
        filename="demarrage/01-register.png"
      />

      <div className="not-prose my-6">
        <Step number={1} title="Renseigner vos informations personnelles">
          <p>Prénom, nom, téléphone et email. Utilisez un <strong>email professionnel actif</strong> — c'est par cet email que vous vous connecterez.</p>
        </Step>
        <Step number={2} title="Nommer votre agence">
          <p>Choisissez un nom clair, par exemple <em>"Agence Madi Immo"</em> ou <em>"Gestion Keur Massar"</em>. Ce nom apparaîtra sur vos quittances et sur le portail de vos locataires.</p>
        </Step>
        <Step number={3} title="Définir un mot de passe">
          <p>Au moins 8 caractères. Gardez-le en lieu sûr.</p>
        </Step>
      </div>

      <Callout type="success" title="Essai gratuit 30 jours">
        À la création du compte, vous bénéficiez automatiquement d'un essai gratuit de 30 jours
        avec toutes les fonctionnalités — sans carte bancaire requise.
      </Callout>

      <h2>2. Compléter votre profil</h2>

      <p>
        Une fois connecté, allez dans <strong>Paramètres → Mon profil</strong> pour compléter vos informations.
        Ces informations s'affichent sur le portail locataire et sur les quittances PDF.
      </p>

      <Screenshot
        caption="Page paramètres : profil personnel avec téléphone, email et adresse."
        filename="demarrage/02-profile.png"
      />

      <Callout type="tip" title="À remplir absolument">
        <ul className="list-disc pl-5">
          <li><strong>Téléphone</strong> — affiché sur l'espace locataire pour contact WhatsApp</li>
          <li><strong>Email</strong> — pour que vos locataires puissent vous écrire</li>
          <li><strong>Adresse</strong> — l'adresse physique de votre agence</li>
        </ul>
      </Callout>

      <h2>3. Ajouter votre premier bien</h2>

      <p>
        Depuis le tableau de bord, cliquez sur <strong>Biens → Ajouter un bien</strong>.
        Deux cas possibles :
      </p>

      <ul>
        <li><strong>Un bien unique</strong> (maison, appartement, terrain) : créez-le directement.</li>
        <li><strong>Un immeuble avec plusieurs appartements</strong> : créez d'abord la résidence (type BUILDING), puis ajoutez chaque appartement séparément en les rattachant à la résidence.</li>
      </ul>

      <Screenshot
        caption="Formulaire de création d'un bien : type, adresse, loyer, photos."
        filename="demarrage/03-new-property.png"
      />

      <p>
        Plus de détails dans la section <Link href="/aide/biens">Biens immobiliers</Link>.
      </p>

      <h2>4. Créer un locataire</h2>

      <p>
        Allez dans <strong>Locataires → Ajouter un locataire</strong>.
        Remplissez ses informations : prénom, nom, téléphone, email (important pour l'invitation),
        numéro de CNI.
      </p>

      <Screenshot
        caption="Formulaire de création d'un locataire."
        filename="demarrage/04-new-tenant.png"
      />

      <h2>5. Associer le locataire à un bien (créer un bail)</h2>

      <p>
        Depuis <strong>Baux → Nouveau bail</strong>, sélectionnez :
      </p>

      <ul>
        <li>Le <strong>bien</strong> concerné (seuls les appartements et maisons apparaissent, pas les immeubles)</li>
        <li>Le <strong>locataire</strong></li>
        <li>La <strong>date de début</strong> du bail</li>
        <li>Le <strong>loyer mensuel</strong> et la <strong>caution</strong></li>
      </ul>

      <Callout type="info" title="Ce qui se passe ensuite">
        Dès la création du bail, Jappalé Immo génère automatiquement les paiements mensuels.
        Chaque mois, une nouvelle échéance est créée pour votre locataire.
      </Callout>

      <h2>6. Inviter votre locataire sur son espace</h2>

      <p>
        Depuis la page du locataire, cliquez sur <strong>Inviter sur l'espace locataire</strong>.
        Un lien est envoyé à son email (ou affiché pour que vous le copiez sur WhatsApp).
      </p>

      <p>
        Le locataire pourra alors :
      </p>

      <ul>
        <li>Voir son solde et ses prochaines échéances</li>
        <li>Télécharger ses quittances</li>
        <li>Consulter son contrat</li>
        <li>Signaler un problème dans son logement</li>
      </ul>

      <div className="not-prose mt-8 pt-6 border-t flex items-center justify-between">
        <Link href="/aide" className="text-sm text-muted-foreground hover:text-foreground">
          ← Retour à l&apos;accueil
        </Link>
        <Link href="/aide/biens" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          Suite : Biens immobiliers <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </>
  );
}
