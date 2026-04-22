"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, MapPin, Home, Ruler, DoorOpen, CalendarDays, CreditCard, ShieldCheck, ChevronDown } from "lucide-react";

interface LeaseData {
  id: string;
  created_at: string;
  start_date: string;
  end_date: string | null;
  rent_amount: number;
  deposit: number;
  status: string;
  property: {
    title: string;
    address: string;
    city: string;
    rooms: number | null;
    area: number | null;
    charges: number;
  } | null;
}

interface ContratData {
  leases: LeaseData[];
  orgName: string;
}

export default function LocataireContratPage() {
  const [data, setData] = useState<ContratData | null>(null);
  const [selectedLeaseId, setSelectedLeaseId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: tenant } = await supabase
        .from("tenants")
        .select("id, org_id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (!tenant) { setLoading(false); return; }

      const [leasesRes, orgRes] = await Promise.all([
        supabase
          .from("leases")
          .select("id, created_at, start_date, end_date, rent_amount, deposit, status, properties(title, address, city, rooms, area, charges)")
          .eq("tenant_id", tenant.id)
          .order("created_at", { ascending: false }),
        supabase.from("organizations").select("name").eq("id", tenant.org_id).single(),
      ]);

      const raw = leasesRes.data ?? [];
      const leases: LeaseData[] = raw.map((l) => {
        const prop = Array.isArray(l.properties)
          ? (l.properties[0] ?? null)
          : (l.properties as LeaseData["property"] | null);
        return {
          id: l.id,
          created_at: l.created_at,
          start_date: l.start_date,
          end_date: l.end_date,
          rent_amount: l.rent_amount,
          deposit: l.deposit,
          status: l.status,
          property: prop,
        };
      });

      leases.sort((a, b) => (a.status === "ACTIVE" ? -1 : 1) - (b.status === "ACTIVE" ? -1 : 1));

      const result = {
        leases,
        orgName: (orgRes.data as { name: string } | null)?.name ?? "Jappalé Immo",
      };
      setData(result);
      if (leases.length > 0) setSelectedLeaseId(leases[0].id);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><p className="text-muted-foreground">Chargement...</p></div>;
  }

  if (!data || data.leases.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <FileText className="h-12 w-12 text-muted-foreground opacity-40 mb-3" />
        <p className="text-muted-foreground">Aucun contrat trouvé.</p>
      </div>
    );
  }

  const lease = data.leases.find((l) => l.id === selectedLeaseId) ?? data.leases[0];
  const property = lease.property;
  const leaseNumber = `BAI-${new Date(lease.created_at).getFullYear()}-${lease.id.slice(0, 6).toUpperCase()}`;
  const isActive = lease.status === "ACTIVE";

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Mon contrat</h1>
        <p className="text-muted-foreground mt-1">Détails de votre bail.</p>
      </div>

      {/* Sélecteur de bail si plusieurs */}
      {data.leases.length > 1 && (
        <div className="flex items-center gap-3">
          <label htmlFor="lease-select" className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            Bail affiché :
          </label>
          <div className="relative flex-1 max-w-xs">
            <select
              id="lease-select"
              value={selectedLeaseId}
              onChange={(e) => setSelectedLeaseId(e.target.value)}
              className="w-full appearance-none rounded-lg border border-input bg-card px-3 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {data.leases.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.property?.title ?? `Bail ${l.id.slice(0, 6).toUpperCase()}`}
                  {l.status === "ACTIVE" ? " · Actif" : " · Terminé"}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}

      {/* Détails bail */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Bail {leaseNumber}
            <Badge variant={isActive ? "default" : "secondary"} className="ml-auto">
              {isActive ? "Actif" : lease.status === "EXPIRED" ? "Expiré" : "Résilié"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Date de début</p>
                <p className="font-medium">{new Date(lease.start_date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Date de fin</p>
                <p className="font-medium">{lease.end_date ? new Date(lease.end_date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "Indéterminée"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Loyer mensuel</p>
                <p className="font-semibold text-lg">{lease.rent_amount.toLocaleString("fr-FR")} FCFA</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Caution versée</p>
                <p className="font-medium">{lease.deposit.toLocaleString("fr-FR")} FCFA</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bien loué */}
      {property && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Bien loué
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="font-semibold text-base">{property.title}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              {property.address}, {property.city}
            </div>
            <div className="flex flex-wrap gap-4 pt-1">
              {property.rooms && (
                <div className="flex items-center gap-1.5 text-sm">
                  <DoorOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{property.rooms} pièces</span>
                </div>
              )}
              {property.area && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <span>{property.area} m²</span>
                </div>
              )}
            </div>
            {property.charges > 0 && (
              <div className="pt-2 border-t text-sm flex justify-between">
                <span className="text-muted-foreground">Charges mensuelles</span>
                <span className="font-medium">{property.charges.toLocaleString("fr-FR")} FCFA</span>
              </div>
            )}
            <div className="text-sm flex justify-between border-t pt-2">
              <span className="text-muted-foreground">Total mensuel (loyer + charges)</span>
              <span className="font-semibold">{(lease.rent_amount + (property.charges ?? 0)).toLocaleString("fr-FR")} FCFA</span>
            </div>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Pour toute question sur votre contrat, contactez votre agence · {data.orgName}
      </p>
    </div>
  );
}
