import Link from "next/link";
import { Screenshot, Callout } from "@/components/docs/doc-components";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Biens immobiliers — Documentation Jappalé Immo",
};

export default function BiensPage() {
  return (
    <>
      <h1>Biens immobiliers</h1>
      <p className="text-lg text-muted-foreground !mt-4">
        Cette section vous explique comment ajouter et organiser vos biens :
        appartements, maisons, terrains, locaux commerciaux et résidences entières.
      </p>

      <h2>Les types de biens</h2>

      <p>Jappalé Immo distingue plusieurs types de biens :</p>

      <ul>
        <li><strong>Résidence / Immeuble</strong> (BUILDING) — un bâtiment qui contient plusieurs logements. Ne se loue pas directement.</li>
        <li><strong>Appartement</strong> — un logement dans une résidence ou un immeuble.</li>
        <li><strong>Maison</strong> — un logement indépendant.</li>
        <li><strong>Terrain</strong> — à vendre ou à louer.</li>
        <li><strong>Local commercial</strong> — boutique, bureau.</li>
      </ul>

      <Callout type="info" title="Pourquoi distinguer Résidence et Appartement ?">
        Une résidence sert uniquement de <strong>regroupement</strong>. Elle permet d'associer
        plusieurs appartements à une même adresse et de retrouver facilement tous les logements
        d'un même immeuble. Ce sont les appartements individuels qui sont loués.
      </Callout>

      <h2>Créer une résidence (immeuble)</h2>

      <p>
        Depuis le tableau de bord, allez dans <strong>Biens → Ajouter un bien</strong>, puis
        sélectionnez le type <strong>Résidence</strong>.
      </p>

      <Screenshot
        caption="Formulaire de création d'une résidence."
        filename="biens/01-new-residence.png"
      />

      <p>Remplissez :</p>
      <ul>
        <li><strong>Nom de la résidence</strong> — ex : "Résidence Sacré-Cœur 3"</li>
        <li><strong>Adresse complète</strong></li>
        <li><strong>Ville</strong></li>
        <li><strong>Propriétaire</strong> (optionnel)</li>
        <li><strong>Photos</strong> — de la façade ou de l'entrée</li>
      </ul>

      <h2>Ajouter un appartement à une résidence</h2>

      <p>
        Depuis <strong>Biens → Ajouter un bien</strong>, sélectionnez <strong>Appartement</strong>.
        Dans le champ <strong>Résidence</strong>, sélectionnez l'immeuble que vous avez créé.
      </p>

      <Screenshot
        caption="Création d'un appartement rattaché à une résidence existante."
        filename="biens/02-new-apartment.png"
      />

      <Callout type="tip" title="Remplissage automatique">
        Quand vous sélectionnez une résidence, l'adresse et la ville sont automatiquement
        pré-remplies. Vous n'avez qu'à ajouter l'étage, le numéro d'appartement et le loyer.
      </Callout>

      <h3>Informations spécifiques à un appartement</h3>

      <ul>
        <li><strong>Numéro / Label</strong> — ex : "Appt 3B", "F3 Étage 2"</li>
        <li><strong>Étage</strong></li>
        <li><strong>Nombre de pièces</strong></li>
        <li><strong>Surface (m²)</strong></li>
        <li><strong>Loyer mensuel</strong></li>
        <li><strong>Charges mensuelles</strong> (optionnel)</li>
        <li><strong>Photos de l'intérieur</strong></li>
      </ul>

      <h2>Les statuts d'un bien</h2>

      <p>Chaque bien a un statut qui indique sa situation :</p>

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
              <td className="py-2 px-3"><span className="inline-block px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">Disponible</span></td>
              <td className="py-2 px-3">Libre, peut être loué ou vendu.</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3"><span className="inline-block px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">Occupé</span></td>
              <td className="py-2 px-3">Actuellement loué — un bail actif existe.</td>
            </tr>
            <tr>
              <td className="py-2 px-3"><span className="inline-block px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-800">Maintenance</span></td>
              <td className="py-2 px-3">Temporairement indisponible (travaux, rénovation).</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="info">
        Le statut passe automatiquement à <strong>Occupé</strong> quand vous créez un bail actif,
        et revient à <strong>Disponible</strong> quand le bail se termine.
      </Callout>

      <h2>Voir les détails d'un bien</h2>

      <p>
        Cliquez sur une ligne dans la liste des biens pour voir toutes les informations,
        le locataire actuel, l'historique des paiements et les photos.
      </p>

      <Screenshot
        caption="Page détail d'un appartement avec informations, locataire et historique."
        filename="biens/03-property-detail.png"
      />

      <h2>Modifier un bien</h2>

      <p>
        Sur la page de détail, cliquez sur <strong>Modifier</strong>.
        Vous pouvez mettre à jour toutes les informations, ajouter ou supprimer des photos,
        changer le loyer (pour les prochains baux — les baux existants conservent leur loyer d'origine).
      </p>

      <Callout type="warning" title="Attention à la modification du loyer">
        Modifier le loyer d'un bien n'affecte pas les baux déjà créés. Les paiements en cours
        restent au montant initial. Pour augmenter un loyer existant, créez un nouveau bail
        avec le nouveau montant après la fin du bail précédent.
      </Callout>

      <h2>Limites selon votre plan</h2>

      <div className="not-prose my-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-2 px-3 font-semibold">Plan</th>
              <th className="text-left py-2 px-3 font-semibold">Biens max</th>
              <th className="text-left py-2 px-3 font-semibold">Membres max</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3">Gratuit</td><td className="py-2 px-3">1</td><td className="py-2 px-3">1</td></tr>
            <tr className="border-b"><td className="py-2 px-3">Pro</td><td className="py-2 px-3">3</td><td className="py-2 px-3">3</td></tr>
            <tr className="border-b"><td className="py-2 px-3">Agence</td><td className="py-2 px-3">15</td><td className="py-2 px-3">10</td></tr>
            <tr><td className="py-2 px-3">Entreprise</td><td className="py-2 px-3">Illimité</td><td className="py-2 px-3">Illimité</td></tr>
          </tbody>
        </table>
      </div>

      <div className="not-prose mt-8 pt-6 border-t flex items-center justify-between">
        <Link href="/aide/demarrage" className="text-sm text-muted-foreground hover:text-foreground">
          ← Premiers pas
        </Link>
        <Link href="/aide/locataires" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          Suite : Locataires <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </>
  );
}
