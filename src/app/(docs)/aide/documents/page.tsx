import Link from "next/link";
import { Screenshot, Callout } from "@/components/docs/doc-components";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Quittances & documents — Documentation Jappalé Immo",
};

export default function DocumentsPage() {
  return (
    <>
      <h1>Quittances & documents</h1>
      <p className="text-lg text-muted-foreground !mt-4">
        Chaque paiement validé génère automatiquement une quittance officielle en PDF.
        Vous pouvez aussi la télécharger à tout moment depuis l&apos;espace locataire.
      </p>

      <h2>Qu&apos;est-ce qu&apos;une quittance de loyer ?</h2>

      <p>
        La quittance est un document officiel signé par le bailleur attestant qu&apos;un locataire
        a bien réglé son loyer pour une période donnée. Elle est utile au locataire comme
        justificatif pour sa banque, son employeur ou l&apos;administration.
      </p>

      <h2>Contenu d&apos;une quittance Jappalé Immo</h2>

      <ul>
        <li>Nom et coordonnées de l&apos;agence</li>
        <li>Numéro unique de bail (<code>BAI-2026-XXXXXX</code>)</li>
        <li>Nom complet et téléphone du locataire</li>
        <li>Titre du bien et adresse complète</li>
        <li>Période concernée (ex : avril 2026)</li>
        <li>Montant du loyer + charges</li>
        <li>Mode de paiement (Espèces, Wave, OM, Virement)</li>
        <li>Date de paiement</li>
        <li>Mention légale de quittance</li>
      </ul>

      <Screenshot
        placeholder
        caption="Exemple d'une quittance PDF générée par Jappalé Immo."
        filename="documents/01-quittance-example.png"
      />

      <h2>Télécharger une quittance — côté agence</h2>

      <p>
        Depuis <strong>Paiements</strong>, cliquez sur un paiement avec le statut <strong>Payé</strong>.
        Un bouton <strong>Télécharger quittance</strong> apparaît.
      </p>

      <Screenshot
        caption="Bouton 'Télécharger quittance' sur un paiement payé."
        filename="documents/02-download-button.png"
      />

      <p>Le PDF s&apos;ouvre directement dans votre navigateur, prêt à imprimer ou à envoyer par email.</p>

      <h2>Télécharger une quittance — côté locataire</h2>

      <p>
        Le locataire retrouve toutes ses quittances dans <strong>Documents</strong>, triées par mois.
      </p>

      <Screenshot
        caption="Page Documents dans l'espace locataire."
        filename="documents/03-tenant-docs-page.png"
      />

      <Callout type="info" title="Aucune démarche nécessaire">
        Les quittances sont générées automatiquement dès que vous validez un paiement.
        Vous n&apos;avez rien à faire — votre locataire peut les télécharger 24h/24 depuis son téléphone.
      </Callout>

      <h2>Paiements partiels</h2>

      <p>
        Un paiement en statut <strong>Partiel</strong> n&apos;a pas de quittance téléchargeable —
        seul le paiement complet (statut Payé) produit une quittance officielle.
      </p>

      <p>
        Une fois le solde complété et le paiement passé en <strong>Payé</strong>, la quittance
        est disponible.
      </p>

      <h2>Format et conformité</h2>

      <p>
        Les quittances générées sont conformes aux usages sénégalais. Elles peuvent être utilisées
        comme justificatif de domicile ou de paiement de loyer devant toute administration.
      </p>

      <Callout type="tip" title="Personnalisation">
        Pour l&apos;instant, la mise en page des quittances est standard. Les plans
        <strong> Agence</strong> et <strong>Entreprise</strong> bénéficieront prochainement
        de quittances personnalisées (logo de votre agence, couleurs).
      </Callout>

      <div className="not-prose mt-8 pt-6 border-t flex items-center justify-between">
        <Link href="/aide/signalements" className="text-sm text-muted-foreground hover:text-foreground">
          ← Signalements
        </Link>
        <Link href="/aide/parametres" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          Suite : Paramètres <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </>
  );
}
