import Link from "next/link";
import { Screenshot, Callout } from "@/components/docs/doc-components";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Abonnement — Documentation Jappalé Immo",
};

export default function AbonnementPage() {
  return (
    <>
      <h1>Abonnement</h1>
      <p className="text-lg text-muted-foreground !mt-4">
        Changez de plan, payez par Wave ou Orange Money et gérez votre facturation.
      </p>

      <h2>Les plans disponibles</h2>

      <div className="not-prose my-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-2 px-3 font-semibold">Plan</th>
              <th className="text-left py-2 px-3 font-semibold">Prix</th>
              <th className="text-left py-2 px-3 font-semibold">Biens</th>
              <th className="text-left py-2 px-3 font-semibold">Membres</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3 font-semibold">Gratuit</td><td className="py-2 px-3">0 FCFA/mois</td><td className="py-2 px-3">1</td><td className="py-2 px-3">1</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-semibold">Pro</td><td className="py-2 px-3">5 000 FCFA/mois</td><td className="py-2 px-3">3</td><td className="py-2 px-3">3</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-semibold">Agence</td><td className="py-2 px-3">10 000 FCFA/mois</td><td className="py-2 px-3">15</td><td className="py-2 px-3">10</td></tr>
            <tr><td className="py-2 px-3 font-semibold">Entreprise</td><td className="py-2 px-3">20 000 FCFA/mois</td><td className="py-2 px-3">Illimité</td><td className="py-2 px-3">Illimité</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Votre essai gratuit</h2>

      <p>
        À la création de votre compte, vous bénéficiez automatiquement de <strong>30 jours d&apos;essai</strong>
        avec toutes les fonctionnalités. Aucune carte bancaire requise.
      </p>

      <p>
        À la fin de la période d&apos;essai, deux choix :
      </p>

      <ul>
        <li><strong>Souscrire à un plan payant</strong> pour continuer à utiliser toutes les fonctionnalités.</li>
        <li><strong>Rester sur le plan Gratuit</strong> : vos données restent intactes mais vos limites sont réduites à 1 bien et 1 utilisateur.</li>
      </ul>

      <h2>Changer de plan</h2>

      <p>
        Depuis votre tableau de bord, cliquez sur votre plan actuel (en haut à droite) puis sur
        <strong> Changer de plan</strong>. Vous arrivez sur la page <strong>Upgrade</strong>.
      </p>

      <Screenshot
        caption="Page de sélection du plan."
        filename="abonnement/01-plans.png"
      />

      <h2>Payer par Wave ou Orange Money</h2>

      <p>
        Actuellement, le paiement de l&apos;abonnement se fait manuellement :
      </p>

      <ol>
        <li>Choisissez le plan souhaité sur la page Upgrade</li>
        <li>Le système vous affiche le numéro Wave ou Orange Money à créditer</li>
        <li>Depuis votre application Wave ou OM, envoyez le montant à ce numéro</li>
        <li>Notez la <strong>référence de transaction</strong> (ex : <code>W-2026-XXXXXX</code>)</li>
        <li>Revenez sur Jappalé Immo, collez la référence dans le formulaire et validez</li>
      </ol>

      <Screenshot
        caption="Formulaire de soumission du paiement avec référence de transaction."
        filename="abonnement/02-payment-form.png"
      />

      <h2>Validation de votre paiement</h2>

      <p>
        Nous vérifions manuellement chaque paiement (généralement sous 24h ouvrées). Une fois validé :
      </p>

      <ul>
        <li>Votre plan passe automatiquement au niveau souscrit</li>
        <li>Les limites sont mises à jour (plus de biens, plus de membres)</li>
        <li>Votre période d&apos;abonnement commence (30 jours)</li>
      </ul>

      <Callout type="info" title="Notification de validation">
        Vous recevez un email dès que votre paiement est validé. En cas de problème avec la
        référence, nous vous contactons par email ou WhatsApp.
      </Callout>

      <h2>Renouvellement mensuel</h2>

      <p>
        À la fin de vos 30 jours, votre abonnement <strong>n&apos;est pas renouvelé automatiquement</strong>.
        Vous recevez un email de rappel 3 jours avant l&apos;échéance. Répétez simplement la procédure
        de paiement pour prolonger.
      </p>

      <Callout type="warning" title="Si vous ne renouvelez pas">
        Votre compte repasse au plan Gratuit (1 bien, 1 utilisateur). Vos biens supplémentaires
        restent stockés mais vous ne pouvez plus y ajouter de nouveaux paiements tant que vous
        ne réactivez pas un plan payant.
      </Callout>

      <h2>Passer à un plan inférieur</h2>

      <p>
        Pour rétrograder (ex : Agence → Pro), contactez le support par email à
        <a href="mailto:contact@jappaleimmo.com"> contact@jappaleimmo.com</a>.
        Nous vous aidons à migrer sans perdre de données.
      </p>

      <h2>Facturation et reçu</h2>

      <p>
        Pour obtenir un reçu officiel de votre paiement d&apos;abonnement, envoyez-nous un email
        avec votre référence de transaction. Nous vous transmettons un reçu PDF dans la journée.
      </p>

      <div className="not-prose mt-8 pt-6 border-t flex items-center justify-between">
        <Link href="/aide/parametres" className="text-sm text-muted-foreground hover:text-foreground">
          ← Paramètres
        </Link>
        <Link href="/aide/espace-locataire" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          Suite : Espace locataire <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </>
  );
}
