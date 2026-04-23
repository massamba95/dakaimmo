import Link from "next/link";
import { Screenshot, Callout } from "@/components/docs/doc-components";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Baux & contrats — Documentation Jappalé Immo",
};

export default function BauxPage() {
  return (
    <>
      <h1>Baux & contrats</h1>
      <p className="text-lg text-muted-foreground !mt-4">
        Le bail associe un locataire à un bien. C&apos;est lui qui déclenche la génération
        automatique des paiements mensuels.
      </p>

      <h2>Créer un nouveau bail</h2>

      <p>
        Depuis le tableau de bord, allez dans <strong>Baux → Nouveau bail</strong>.
      </p>

      <Screenshot
        caption="Formulaire de création d'un bail : bien, locataire, dates, loyer."
        filename="baux/01-new-lease.png"
      />

      <h3>Champs à remplir</h3>

      <ul>
        <li><strong>Bien immobilier</strong> — sélectionnez dans la liste. Seuls les biens louables (appartements, maisons, locaux) apparaissent, pas les résidences.</li>
        <li><strong>Locataire</strong> — sélectionnez dans la liste de vos locataires existants.</li>
        <li><strong>Date de début</strong> — date à laquelle le bail prend effet.</li>
        <li><strong>Date de fin</strong> (optionnel) — laissez vide pour un bail à durée indéterminée.</li>
        <li><strong>Loyer mensuel</strong> — automatiquement rempli depuis le bien, modifiable.</li>
        <li><strong>Caution</strong> — généralement 2 ou 3 mois de loyer.</li>
      </ul>

      <Callout type="info" title="Génération automatique des paiements">
        Dès la création du bail, Jappalé Immo crée automatiquement la première échéance de paiement.
        Les échéances suivantes sont générées le 1er de chaque mois.
      </Callout>

      <h2>Liste des baux</h2>

      <p>
        La page <strong>Baux</strong> affiche tous vos baux avec :
      </p>

      <ul>
        <li>Le locataire et le bien</li>
        <li>Les dates de début et fin</li>
        <li>Le loyer</li>
        <li>Le statut (Actif, Terminé, Résilié)</li>
      </ul>

      <Screenshot
        caption="Liste des baux avec filtres par statut."
        filename="baux/02-leases-list.png"
      />

      <h2>Les statuts d'un bail</h2>

      <div className="not-prose my-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-2 px-3 font-semibold">Statut</th>
              <th className="text-left py-2 px-3 font-semibold">Signification</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-3"><span className="inline-block px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">Actif</span></td>
              <td className="py-2 px-3">Bail en cours. Les paiements sont générés chaque mois.</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3"><span className="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">Terminé</span></td>
              <td className="py-2 px-3">Bail arrivé à échéance normalement. L'historique reste consultable.</td>
            </tr>
            <tr>
              <td className="py-2 px-3"><span className="inline-block px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800">Résilié</span></td>
              <td className="py-2 px-3">Bail rompu avant terme.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Numéro de bail</h2>

      <p>
        Chaque bail reçoit automatiquement un numéro unique au format <code>BAI-YEAR-XXXXXX</code>,
        par exemple <code>BAI-2026-A3F2B1</code>.
        Ce numéro apparaît sur les quittances et dans l&apos;espace locataire.
      </p>

      <h2>Clôturer un bail</h2>

      <p>
        Quand un locataire quitte le logement, cliquez sur le bail puis sur <strong>Clôturer</strong>.
        Le statut passe à <strong>Terminé</strong>, les paiements futurs ne sont plus générés,
        et le bien redevient <strong>Disponible</strong>.
      </p>

      <Callout type="warning" title="Ne supprimez pas un bail terminé">
        L'historique des paiements reste attaché au bail. Si vous le supprimez, vous perdez
        toutes les quittances et paiements du locataire. Préférez toujours la clôture.
      </Callout>

      <h2>Un locataire, plusieurs baux</h2>

      <p>
        Le même locataire peut avoir plusieurs baux actifs en même temps, par exemple s&apos;il
        loue son appartement principal et un bureau. Il suffit de créer un bail par bien loué.
      </p>

      <p>
        Dans son espace locataire, il verra un sélecteur en haut pour basculer entre ses différents baux.
      </p>

      <div className="not-prose mt-8 pt-6 border-t flex items-center justify-between">
        <Link href="/aide/locataires" className="text-sm text-muted-foreground hover:text-foreground">
          ← Locataires
        </Link>
        <Link href="/aide/paiements" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          Suite : Paiements <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </>
  );
}
