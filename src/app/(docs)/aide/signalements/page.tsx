import Link from "next/link";
import { Screenshot, Callout } from "@/components/docs/doc-components";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Signalements — Documentation Jappalé Immo",
};

export default function SignalementsPage() {
  return (
    <>
      <h1>Signalements</h1>
      <p className="text-lg text-muted-foreground !mt-4">
        Vos locataires peuvent signaler un problème (fuite, panne, dégât) depuis leur espace.
        Vous les gérez depuis l&apos;onglet Signalements du tableau de bord.
      </p>

      <h2>Comment un locataire crée un signalement</h2>

      <p>
        Depuis son espace, le locataire va sur <strong>Signaler un problème</strong>, remplit :
      </p>

      <ul>
        <li><strong>Catégorie</strong> : Plomberie, Électricité, Appareils, Chauffage/clim, Structure, Autre</li>
        <li><strong>Titre</strong> : ex "Fuite sous l&apos;évier"</li>
        <li><strong>Description</strong> : détails du problème</li>
        <li><strong>Photos</strong> : jusqu&apos;à 3 photos (5 Mo chacune max)</li>
      </ul>

      <Screenshot
        caption="Formulaire de signalement côté locataire."
        filename="signalements/01-tenant-form.png"
      />

      <h2>Voir les signalements côté agence</h2>

      <p>
        Depuis le tableau de bord, allez dans <strong>Signalements</strong>. Vous voyez :
      </p>

      <ul>
        <li>Tous les signalements triés par date</li>
        <li>Le locataire et le bien concernés</li>
        <li>Le statut de chaque demande</li>
        <li>Les photos jointes</li>
      </ul>

      <Screenshot
        caption="Liste des signalements côté agence avec filtres."
        filename="signalements/02-issues-list.png"
      />

      <h2>Les statuts d'un signalement</h2>

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
              <td className="py-2 px-3"><span className="inline-block px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-800">Ouvert</span></td>
              <td className="py-2 px-3">Nouveau signalement, pas encore traité.</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3"><span className="inline-block px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">En cours</span></td>
              <td className="py-2 px-3">Vous traitez le problème, un technicien est mandaté.</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3"><span className="inline-block px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">Résolu</span></td>
              <td className="py-2 px-3">Le problème est réglé.</td>
            </tr>
            <tr>
              <td className="py-2 px-3"><span className="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">Fermé</span></td>
              <td className="py-2 px-3">Signalement clôturé administrativement.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Traiter un signalement</h2>

      <p>
        Cliquez sur un signalement pour voir les détails. Vous pouvez :
      </p>

      <ul>
        <li>Changer le statut (Ouvert → En cours → Résolu)</li>
        <li>Contacter le locataire par WhatsApp depuis sa fiche</li>
        <li>Voir les photos en grand</li>
      </ul>

      <Screenshot
        caption="Détail d'un signalement avec photos et changement de statut."
        filename="signalements/03-issue-detail.png"
      />

      <Callout type="tip" title="Communiquez avec votre locataire">
        Quand vous changez le statut, prévenez le locataire par WhatsApp. Il verra aussi
        le changement de statut dans son espace, mais un message direct est toujours apprécié.
      </Callout>

      <h2>Notifications</h2>

      <p>
        Un <strong>badge rouge</strong> apparaît dans votre sidebar à côté de "Signalements" tant
        qu&apos;il reste des signalements <strong>Ouvert</strong>. Il disparaît une fois que tout
        est passé en "En cours" ou "Résolu".
      </p>

      <div className="not-prose mt-8 pt-6 border-t flex items-center justify-between">
        <Link href="/aide/paiements" className="text-sm text-muted-foreground hover:text-foreground">
          ← Paiements
        </Link>
        <Link href="/aide/documents" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          Suite : Quittances & documents <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </>
  );
}
