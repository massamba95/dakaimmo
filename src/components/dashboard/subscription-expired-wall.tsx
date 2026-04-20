"use client";

import { useEffect, useState } from "react";
import { useOrg } from "@/lib/hooks/use-org";
import { createClient } from "@/lib/supabase/client";
import { PLANS } from "@/lib/plans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CreditCard, Home, Users, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type PlanKey = "FREE" | "PRO" | "AGENCY" | "ENTERPRISE";
const PLAN_ORDER: PlanKey[] = ["PRO", "AGENCY", "ENTERPRISE"];

export function SubscriptionExpiredWall({ children }: { children: React.ReactNode }) {
  const { orgId, role } = useOrg();
  const [expiredPlan, setExpiredPlan] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!orgId) return;
    async function check() {
      const supabase = createClient();
      const { data } = await supabase
        .from("subscriptions")
        .select("plan")
        .eq("org_id", orgId!)
        .eq("status", "PAST_DUE")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      setExpiredPlan(data?.plan ?? null);
      setChecked(true);
    }
    check();
  }, [orgId]);

  if (!checked) return <>{children}</>;

  if (!expiredPlan) return <>{children}</>;

  if (role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-10 pb-8 px-8">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
            <h2 className="text-xl font-bold mt-4">Abonnement expiré</h2>
            <p className="text-muted-foreground mt-2">
              L&apos;abonnement de votre organisation a expiré. Contactez votre administrateur pour renouveler l&apos;accès.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <RenewalWall expiredPlan={expiredPlan as PlanKey} orgId={orgId!} />;
}

function RenewalWall({ expiredPlan, orgId }: { expiredPlan: PlanKey; orgId: string }) {
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>(expiredPlan);
  const [method, setMethod] = useState<"WAVE" | "ORANGE_MONEY">("WAVE");
  const [transactionRef, setTransactionRef] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const wavePhone = process.env.NEXT_PUBLIC_WAVE_PHONE ?? "";
  const omPhone = process.env.NEXT_PUBLIC_OM_PHONE ?? "";
  const plan = PLANS[selectedPlan];

  async function handleSubmit() {
    if (!transactionRef.trim()) {
      toast.error("Entrez votre référence de transaction.");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/subscriptions/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: selectedPlan, method, transactionRef: transactionRef.trim() }),
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json();
      toast.error(data.error ?? "Erreur lors de l'envoi.");
    }
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-10 pb-8 px-8">
            <RefreshCw className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-xl font-bold mt-4">Demande envoyée !</h2>
            <p className="text-muted-foreground mt-2">
              Votre paiement a bien été soumis. La validation est effectuée sous 24h ouvrées. Votre accès sera rétabli dès confirmation.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="max-w-lg w-full space-y-6">

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-7 w-7 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold">Abonnement expiré</h1>
          <p className="text-muted-foreground mt-1">
            Renouvelez pour retrouver accès à toutes vos fonctionnalités.
          </p>
        </div>

        {/* Choix du plan */}
        <div className="grid grid-cols-3 gap-3">
          {PLAN_ORDER.map((planKey) => {
            const p = PLANS[planKey];
            const isSelected = selectedPlan === planKey;
            const wasExpired = planKey === expiredPlan;
            return (
              <button
                key={planKey}
                onClick={() => setSelectedPlan(planKey)}
                className={`relative p-3 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/40"
                }`}
              >
                {wasExpired && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] px-1.5 py-0 bg-orange-500">
                    Ancien
                  </Badge>
                )}
                <p className="font-semibold text-sm">{p.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {p.price.toLocaleString("fr-FR")} FCFA
                </p>
                <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    {p.maxProperties >= 999999 ? "∞" : p.maxProperties} biens
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {p.maxMembers >= 999999 ? "∞" : p.maxMembers} membres
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Formulaire paiement */}
        <Card className="border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              Payer le plan {plan.label} — {plan.price.toLocaleString("fr-FR")} FCFA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">

            {/* Méthode */}
            <div className="flex gap-3">
              <button
                onClick={() => setMethod("WAVE")}
                className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-colors ${
                  method === "WAVE"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                Wave
              </button>
              <button
                onClick={() => setMethod("ORANGE_MONEY")}
                className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-colors ${
                  method === "ORANGE_MONEY"
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                Orange Money
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-muted/50 border rounded-lg p-3 space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Numéro à créditer</p>
                <p className="text-lg font-bold font-mono">
                  {method === "WAVE"
                    ? (wavePhone || <span className="text-destructive text-sm">Non configuré</span>)
                    : (omPhone || <span className="text-destructive text-sm">Non configuré</span>)
                  }
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Montant exact</p>
                <p className="text-lg font-bold text-primary">
                  {plan.price.toLocaleString("fr-FR")} FCFA
                </p>
              </div>
              <p className="text-xs text-muted-foreground border-t pt-2">
                Ajoutez votre email en message/référence pour faciliter la validation.
              </p>
            </div>

            {/* Référence */}
            <div className="space-y-1.5">
              <Label htmlFor="txref">Référence de transaction</Label>
              <Input
                id="txref"
                placeholder={method === "WAVE" ? "Ex : W-2024-XXXXXX" : "Ex : OM-XXXXXXXX"}
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Référence reçue par SMS de confirmation {method === "WAVE" ? "Wave" : "Orange Money"}.
              </p>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleSubmit}
              disabled={submitting || !transactionRef.trim()}
            >
              {submitting ? "Envoi en cours..." : "J'ai payé — Soumettre ma demande"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
