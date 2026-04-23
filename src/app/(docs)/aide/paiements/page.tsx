import Link from "next/link";
import { Screenshot, Callout } from "@/components/docs/doc-components";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Paiements — Documentation Jappalé Immo",
};

export default function PaiementsPage() {
  return (
    <>
      <h1>Paiements</h1>
      <p className="text-lg text-muted-foreground !mt-4">
        Enregistrez les encaissements, suivez les impayés, gérez les paiements partiels et
        envoyez des rappels à vos locataires.
      </p>

      <h2>Comprendre les statuts de paiement</h2>

      <p>Chaque paiement a un statut qui évolue dans le temps :</p>

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
              <td className="py-2 px-3"><span className="inline-block px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">En attente</span></td>
              <td className="py-2 px-3">Loyer dû, encore dans les délais.</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3"><span className="inline-block px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800">En retard</span></td>
              <td className="py-2 px-3">Date d'échéance dépassée sans paiement.</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3"><span className="inline-block px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">Partiel</span></td>
              <td className="py-2 px-3">Une partie du montant a été réglée, il reste un solde.</td>
            </tr>
            <tr>
              <td className="py-2 px-3"><span className="inline-block px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">Payé</span></td>
              <td className="py-2 px-3">Totalement réglé, quittance disponible.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="info" title="Passage automatique En attente → En retard">
        Chaque nuit à 6h, un robot vérifie tous les paiements en attente. Ceux dont la date
        d&apos;échéance est dépassée passent automatiquement en <strong>En retard</strong>.
      </Callout>

      <h2>La page Paiements</h2>

      <p>
        Depuis le tableau de bord, allez dans <strong>Paiements</strong>. Vous y voyez :
      </p>

      <ul>
        <li>Les paiements du mois en cours</li>
        <li>Les impayés toutes périodes confondues</li>
        <li>L&apos;historique complet des encaissements</li>
        <li>Des filtres par statut, locataire, bien</li>
      </ul>

      <Screenshot
        caption="Page Paiements avec filtres et actions rapides."
        filename="paiements/01-payments-page.png"
      />

      <h2>Enregistrer un paiement complet</h2>

      <p>
        Quand un locataire paye son loyer en entier, cliquez sur <strong>Marquer comme payé</strong>
        sur la ligne concernée.
      </p>

      <Screenshot
        caption="Bouton 'Marquer comme payé' et sélection du mode de paiement."
        filename="paiements/02-mark-paid.png"
      />

      <p>Une petite fenêtre s&apos;ouvre pour choisir le <strong>mode de paiement</strong> :</p>

      <ul>
        <li>Espèces</li>
        <li>Virement</li>
        <li>Wave</li>
        <li>Orange Money</li>
      </ul>

      <p>Le paiement passe en <strong>Payé</strong> avec la date du jour. La quittance PDF devient téléchargeable.</p>

      <h2>Enregistrer un paiement partiel</h2>

      <p>
        Si le locataire ne peut payer qu&apos;une partie, cliquez sur <strong>Paiement partiel</strong>
        et saisissez le montant versé.
      </p>

      <Screenshot
        caption="Saisie d'un paiement partiel avec montant et méthode."
        filename="paiements/03-partial-payment.png"
      />

      <Callout type="tip" title="Dans l'espace locataire">
        Un paiement partiel s&apos;affiche pour le locataire comme :
        <code>15 000 FCFA versés · reste 15 000 FCFA</code>.
        Le solde restant apparaît dans la <strong>Situation de votre compte</strong> sur sa page d&apos;accueil.
      </Callout>

      <h2>Compléter un paiement partiel</h2>

      <p>
        Quand le locataire règle le reste, retrouvez son paiement partiel et cliquez sur
        <strong> Compléter</strong>. Entrez le montant complémentaire. Deux cas :
      </p>

      <ul>
        <li>Si le nouveau montant couvre le solde restant, le paiement passe en <strong>Payé</strong>.</li>
        <li>Sinon, il reste en <strong>Partiel</strong> avec un nouveau solde mis à jour.</li>
      </ul>

      <h2>Gérer les retards</h2>

      <h3>Envoyer un rappel WhatsApp</h3>

      <p>
        Sur chaque paiement en retard, un bouton <strong>Envoyer un rappel</strong> ouvre WhatsApp
        avec un message pré-rempli adressé au locataire.
      </p>

      <Screenshot
        caption="Bouton 'Envoyer un rappel' sur un paiement en retard."
        filename="paiements/04-reminder.png"
      />

      <h3>Rappels automatiques par email</h3>

      <p>
        Tous les jours à 8h, Jappalé Immo envoie automatiquement un rappel par email :
      </p>

      <ul>
        <li><strong>3 jours avant</strong> l&apos;échéance : rappel préventif</li>
        <li><strong>Le jour J</strong> : rappel d&apos;échéance</li>
        <li><strong>7 jours après</strong> l&apos;échéance : relance de retard</li>
      </ul>

      <h2>La quittance de loyer</h2>

      <p>
        Dès qu&apos;un paiement passe en <strong>Payé</strong>, une quittance PDF officielle
        est générée avec :
      </p>

      <ul>
        <li>Le numéro du bail</li>
        <li>Le nom du locataire et son adresse</li>
        <li>Le bien loué</li>
        <li>Le montant du loyer + charges</li>
        <li>La période concernée</li>
        <li>La date et le mode de paiement</li>
      </ul>

      <p>
        Le locataire peut aussi la télécharger depuis son espace.
      </p>

      <h2>Paiements mensuels automatiques</h2>

      <p>
        Le <strong>1er de chaque mois à 8h</strong>, un robot crée automatiquement
        les nouvelles échéances pour tous vos baux actifs. Vous n&apos;avez rien à faire.
      </p>

      <Callout type="warning" title="Bail créé en cours de mois">
        Si vous créez un bail le 15 du mois, la première échéance est créée immédiatement.
        Les suivantes sont générées chaque 1er du mois.
      </Callout>

      <div className="not-prose mt-8 pt-6 border-t flex items-center justify-between">
        <Link href="/aide/baux" className="text-sm text-muted-foreground hover:text-foreground">
          ← Baux & contrats
        </Link>
        <Link href="/aide/signalements" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          Suite : Signalements <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </>
  );
}
