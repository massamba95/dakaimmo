export const PLANS = {
  FREE: {
    label: "Gratuit",
    maxProperties: 1,
    maxMembers: 1,
    price: 0,
  },
  PRO: {
    label: "Pro",
    maxProperties: 3,
    maxMembers: 3,
    price: 5000,
  },
  AGENCY: {
    label: "Agence",
    maxProperties: 15,
    maxMembers: 10,
    price: 10000,
  },
  ENTERPRISE: {
    label: "Entreprise",
    maxProperties: 999999,
    maxMembers: 999999,
    price: 20000,
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export function getPlanLimits(plan: string) {
  return PLANS[plan as PlanKey] ?? PLANS.FREE;
}

export function formatPrice(amount: number): string {
  return amount.toLocaleString("fr-FR") + " FCFA";
}

export function getTrialDaysLeft(trialEndsAt: string | null): number {
  if (!trialEndsAt) return 0;
  const diff = new Date(trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getSubscriptionDaysLeft(endDate: string | null): number {
  if (!endDate) return 0;
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
