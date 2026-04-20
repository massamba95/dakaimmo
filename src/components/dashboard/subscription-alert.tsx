"use client";

import { useEffect, useState } from "react";
import { useOrg } from "@/lib/hooks/use-org";
import { createClient } from "@/lib/supabase/client";
import { getSubscriptionDaysLeft } from "@/lib/plans";
import { AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";

export function SubscriptionAlert() {
  const { orgId, orgPlan } = useOrg();
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!orgId || !orgPlan || orgPlan === "FREE") return;
    async function fetchSub() {
      const supabase = createClient();
      const { data } = await supabase
        .from("subscriptions")
        .select("current_period_end")
        .eq("org_id", orgId!)
        .eq("status", "ACTIVE")
        .single();
      if (data) setDaysLeft(getSubscriptionDaysLeft(data.current_period_end));
    }
    fetchSub();
  }, [orgId, orgPlan]);

  if (daysLeft === null || daysLeft > 7) return null;

  const isUrgent = daysLeft <= 3;

  return (
    <div
      className={`px-4 py-2.5 flex items-center gap-3 text-sm ${
        isUrgent
          ? "bg-red-50 border-b border-red-200 text-red-800"
          : "bg-yellow-50 border-b border-yellow-200 text-yellow-800"
      }`}
    >
      {isUrgent ? (
        <AlertTriangle className="h-4 w-4 shrink-0" />
      ) : (
        <Clock className="h-4 w-4 shrink-0" />
      )}
      <span>
        {daysLeft === 0
          ? "Votre abonnement a expiré. Votre compte est repassé en plan gratuit."
          : `Votre abonnement expire dans ${daysLeft} jour${daysLeft > 1 ? "s" : ""}.`}
      </span>
      <Link
        href="/dashboard/upgrade"
        className={`ml-auto font-semibold underline underline-offset-2 shrink-0 ${
          isUrgent ? "text-red-700" : "text-yellow-700"
        }`}
      >
        Renouveler →
      </Link>
    </div>
  );
}
