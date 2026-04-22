"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, FileDown, CheckCircle2 } from "lucide-react";
import { generateQuittancePDF } from "@/lib/pdf/quittance";

interface QuittanceRow {
  id: string;
  lease_id: string;
  amount: number;
  due_date: string;
  paid_date: string | null;
  method: string;
  leaseCreatedAt: string;
  rentAmount: number;
  charges: number;
  propertyTitle: string;
  propertyAddress: string;
  propertyCity: string;
  tenantFirstName: string;
  tenantLastName: string;
  tenantPhone: string;
  orgName: string;
}

export default function LocataireDocumentsPage() {
  const [quittances, setQuittances] = useState<QuittanceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: tenant } = await supabase
        .from("tenants")
        .select("id, org_id, first_name, last_name, phone")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (!tenant) { setLoading(false); return; }

      const [leasesRes, orgRes] = await Promise.all([
        supabase
          .from("leases")
          .select("id, created_at, rent_amount, properties(title, address, city, charges)")
          .eq("tenant_id", tenant.id),
        supabase.from("organizations").select("name").eq("id", tenant.org_id).single(),
      ]);

      const leases = leasesRes.data ?? [];
      const orgName = (orgRes.data as { name: string } | null)?.name ?? "Jappalé Immo";

      if (leases.length === 0) { setLoading(false); return; }

      const leaseIds = leases.map((l) => l.id);

      const { data: payments } = await supabase
        .from("payments")
        .select("id, lease_id, amount, due_date, paid_date, method")
        .in("lease_id", leaseIds)
        .eq("status", "PAID")
        .order("due_date", { ascending: false });

      const rows: QuittanceRow[] = (payments ?? []).map((p) => {
        const lease = leases.find((l) => l.id === p.lease_id)!;
        const prop = Array.isArray(lease.properties)
          ? (lease.properties[0] ?? null)
          : (lease.properties as { title: string; address: string; city: string; charges: number } | null);
        return {
          id: p.id,
          lease_id: p.lease_id,
          amount: p.amount,
          due_date: p.due_date,
          paid_date: p.paid_date,
          method: p.method,
          leaseCreatedAt: lease.created_at,
          rentAmount: lease.rent_amount,
          charges: prop?.charges ?? 0,
          propertyTitle: prop?.title ?? "",
          propertyAddress: prop?.address ?? "",
          propertyCity: prop?.city ?? "",
          tenantFirstName: tenant.first_name,
          tenantLastName: tenant.last_name,
          tenantPhone: tenant.phone,
          orgName,
        };
      });

      setQuittances(rows);
      setLoading(false);
    }
    load();
  }, []);

  function download(q: QuittanceRow) {
    const leaseNumber = `BAI-${new Date(q.leaseCreatedAt).getFullYear()}-${q.lease_id.slice(0, 6).toUpperCase()}`;
    generateQuittancePDF({
      orgName: q.orgName,
      paymentId: q.id,
      amount: q.amount,
      dueDate: q.due_date,
      paidDate: q.paid_date,
      method: q.method,
      leaseNumber,
      rentAmount: q.rentAmount,
      charges: q.charges,
      tenantFirstName: q.tenantFirstName,
      tenantLastName: q.tenantLastName,
      tenantPhone: q.tenantPhone,
      propertyTitle: q.propertyTitle,
      propertyAddress: q.propertyAddress,
      propertyCity: q.propertyCity,
    });
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><p className="text-muted-foreground">Chargement...</p></div>;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Mes documents</h1>
        <p className="text-muted-foreground mt-1">Téléchargez vos quittances de loyer.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            Quittances de loyer
            {quittances.length > 0 && (
              <span className="ml-auto text-sm font-normal text-muted-foreground">{quittances.length} quittance{quittances.length > 1 ? "s" : ""}</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {quittances.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <FolderOpen className="h-10 w-10 text-muted-foreground opacity-40 mb-3" />
              <p className="text-sm text-muted-foreground">Aucune quittance disponible pour l&apos;instant.</p>
              <p className="text-xs text-muted-foreground mt-1">Les quittances apparaissent ici une fois vos paiements confirmés.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {quittances.map((q) => {
                const date = new Date(q.due_date);
                const mois = date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
                return (
                  <div key={q.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold capitalize">{mois}</p>
                        <p className="text-xs text-muted-foreground">
                          {q.amount.toLocaleString("fr-FR")} FCFA
                          {q.paid_date && ` · payé le ${new Date(q.paid_date).toLocaleDateString("fr-FR")}`}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="gap-1.5 shrink-0" onClick={() => download(q)}>
                      <FileDown className="h-4 w-4" />
                      Télécharger
                    </Button>
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
