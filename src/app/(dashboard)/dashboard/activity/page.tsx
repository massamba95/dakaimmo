"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useOrg } from "@/lib/hooks/use-org";
import { actionLabels, entityLabels } from "@/lib/activity-log";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/dashboard/search-bar";
import { History, Building2, Users, FileText, CreditCard, Plus, Pencil, Trash2 } from "lucide-react";

interface ActivityLog {
  id: string;
  user_name: string;
  action: string;
  entity_type: string;
  entity_name: string | null;
  details: string | null;
  created_at: string;
}

const actionIcons: Record<string, typeof Plus> = {
  CREATE: Plus,
  UPDATE: Pencil,
  DELETE: Trash2,
};

const entityIcons: Record<string, typeof Building2> = {
  PROPERTY: Building2,
  TENANT: Users,
  LEASE: FileText,
  PAYMENT: CreditCard,
};

const actionColors: Record<string, string> = {
  CREATE: "bg-green-100 text-green-700",
  UPDATE: "bg-blue-100 text-blue-700",
  DELETE: "bg-red-100 text-red-700",
};

export default function ActivityPage() {
  const { orgId, role } = useOrg();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [search, setSearch] = useState("");
  const [filterEntity, setFilterEntity] = useState("ALL");
  const [filterAction, setFilterAction] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgId) return;
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("org_id", orgId!)
        .order("created_at", { ascending: false })
        .limit(100);

      setLogs((data as ActivityLog[]) ?? []);
      setLoading(false);
    }
    load();
  }, [orgId]);

  if (role !== "ADMIN" && role !== "MANAGER") {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Vous n&apos;avez pas acces a cette page.</p>
      </div>
    );
  }

  const filtered = logs.filter((log) => {
    if (filterEntity !== "ALL" && log.entity_type !== filterEntity) return false;
    if (filterAction !== "ALL" && log.action !== filterAction) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        (log.user_name?.toLowerCase().includes(q)) ||
        (log.entity_name?.toLowerCase().includes(q)) ||
        (log.details?.toLowerCase().includes(q))
      );
    }
    return true;
  });

  if (loading) {
    return <div className="flex items-center justify-center py-20"><p className="text-muted-foreground">Chargement...</p></div>;
  }

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold">Historique d&apos;activite</h1>
        <p className="text-muted-foreground mt-1">Suivez toutes les actions effectuees dans votre organisation.</p>
      </div>

      {/* Filtres */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Rechercher..." />
        <select
          className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
          value={filterEntity}
          onChange={(e) => setFilterEntity(e.target.value)}
        >
          <option value="ALL">Tous les types</option>
          <option value="PROPERTY">Biens</option>
          <option value="TENANT">Locataires</option>
          <option value="LEASE">Baux</option>
          <option value="PAYMENT">Paiements</option>
        </select>
        <select
          className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
        >
          <option value="ALL">Toutes les actions</option>
          <option value="CREATE">Creations</option>
          <option value="UPDATE">Modifications</option>
          <option value="DELETE">Suppressions</option>
        </select>
      </div>

      {/* Liste des activites */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Activites recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Aucune activite enregistree.</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((log) => {
                const ActionIcon = actionIcons[log.action] ?? Pencil;
                const EntityIcon = entityIcons[log.entity_type] ?? Building2;
                return (
                  <div key={log.id} className="flex items-start gap-4 py-3 border-b last:border-0">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${actionColors[log.action] ?? "bg-gray-100"}`}>
                      <ActionIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{log.user_name ?? "Utilisateur"}</span>
                        <span className="text-sm text-muted-foreground">a</span>
                        <Badge variant="outline" className="text-xs">
                          {actionLabels[log.action] ?? log.action}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <EntityIcon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{entityLabels[log.entity_type] ?? log.entity_type}</span>
                        </div>
                      </div>
                      {log.entity_name && (
                        <p className="text-sm font-medium mt-0.5">{log.entity_name}</p>
                      )}
                      {log.details && (
                        <p className="text-xs text-muted-foreground mt-0.5">{log.details}</p>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log.created_at).toLocaleDateString("fr-FR")} {new Date(log.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
