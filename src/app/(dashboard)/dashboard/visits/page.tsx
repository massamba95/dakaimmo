"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Loader2, CheckCircle2, XCircle, Clock, CheckCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Visit {
  id: string;
  property_title: string;
  visitor_name: string;
  visitor_phone: string;
  visitor_email: string | null;
  requested_date: string;
  requested_time: string | null;
  message: string | null;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "DONE";
  created_at: string;
}

const statusConfig: Record<Visit["status"], { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Clock }> = {
  PENDING:   { label: "En attente",  variant: "secondary",    icon: Clock },
  CONFIRMED: { label: "Confirmée",   variant: "default",      icon: CheckCircle2 },
  CANCELLED: { label: "Annulée",     variant: "destructive",  icon: XCircle },
  DONE:      { label: "Effectuée",   variant: "outline",      icon: CheckCheck },
};

const nextActions: Record<Visit["status"], { status: Visit["status"]; label: string }[]> = {
  PENDING:   [{ status: "CONFIRMED", label: "Confirmer" }, { status: "CANCELLED", label: "Annuler" }],
  CONFIRMED: [{ status: "DONE", label: "Marquer effectuée" }, { status: "CANCELLED", label: "Annuler" }],
  CANCELLED: [],
  DONE:      [],
};

export default function VisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<Visit["status"] | "ALL">("ALL");

  useEffect(() => {
    fetch("/api/dashboard/visits")
      .then((r) => r.json())
      .then((data) => { setVisits(data); setLoading(false); });
  }, []);

  async function updateStatus(id: string, status: Visit["status"]) {
    setUpdating(id);
    await fetch(`/api/dashboard/visits/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setVisits((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
    setUpdating(null);
  }

  const counts = {
    ALL:       visits.length,
    PENDING:   visits.filter((v) => v.status === "PENDING").length,
    CONFIRMED: visits.filter((v) => v.status === "CONFIRMED").length,
    CANCELLED: visits.filter((v) => v.status === "CANCELLED").length,
    DONE:      visits.filter((v) => v.status === "DONE").length,
  };

  const filtered = filter === "ALL" ? visits : visits.filter((v) => v.status === filter);

  const tabs: { key: Visit["status"] | "ALL"; label: string }[] = [
    { key: "ALL",       label: `Toutes (${counts.ALL})` },
    { key: "PENDING",   label: `En attente (${counts.PENDING})` },
    { key: "CONFIRMED", label: `Confirmées (${counts.CONFIRMED})` },
    { key: "DONE",      label: `Effectuées (${counts.DONE})` },
    { key: "CANCELLED", label: `Annulées (${counts.CANCELLED})` },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <CalendarCheck className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Demandes de visite</h1>
          <p className="text-sm text-muted-foreground">Gérez les visites demandées depuis votre vitrine</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              filter === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <CalendarCheck className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Aucune demande de visite dans cette catégorie.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((visit) => {
            const cfg = statusConfig[visit.status];
            const StatusIcon = cfg.icon;
            const actions = nextActions[visit.status];
            const formattedDate = new Date(visit.requested_date).toLocaleDateString("fr-FR", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            });

            return (
              <div key={visit.id} className="bg-card border rounded-xl p-5 flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-base">{visit.property_title}</span>
                    <Badge variant={cfg.variant} className="flex items-center gap-1">
                      <StatusIcon className="h-3 w-3" />
                      {cfg.label}
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground space-y-0.5">
                    <p>
                      <span className="font-medium text-foreground">{visit.visitor_name}</span>
                      {" · "}
                      <a href={`tel:${visit.visitor_phone}`} className="hover:underline">{visit.visitor_phone}</a>
                      {visit.visitor_email && (
                        <> · <a href={`mailto:${visit.visitor_email}`} className="hover:underline">{visit.visitor_email}</a></>
                      )}
                    </p>
                    <p>
                      {formattedDate}
                      {visit.requested_time && ` à ${visit.requested_time}`}
                    </p>
                    {visit.message && (
                      <p className="italic text-xs mt-1">"{visit.message}"</p>
                    )}
                  </div>
                </div>

                {actions.length > 0 && (
                  <div className="flex gap-2 flex-shrink-0">
                    {actions.map((action) => (
                      <Button
                        key={action.status}
                        size="sm"
                        variant={action.status === "CANCELLED" ? "outline" : "default"}
                        disabled={updating === visit.id}
                        onClick={() => updateStatus(visit.id, action.status)}
                      >
                        {updating === visit.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          action.label
                        )}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
