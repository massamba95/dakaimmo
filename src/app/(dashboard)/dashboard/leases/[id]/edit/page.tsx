"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function EditLeasePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [propertyTitle, setPropertyTitle] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    rent_amount: "",
    deposit: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("leases")
        .select("*, properties(title), tenants(first_name, last_name)")
        .eq("id", id)
        .single();

      if (data) {
        setFormData({
          start_date: data.start_date,
          end_date: data.end_date ?? "",
          rent_amount: data.rent_amount.toString(),
          deposit: data.deposit.toString(),
          status: data.status,
        });
        const prop = data.properties as Record<string, string> | null;
        const tenant = data.tenants as Record<string, string> | null;
        setPropertyTitle(prop?.title ?? "");
        setTenantName(`${tenant?.first_name ?? ""} ${tenant?.last_name ?? ""}`);
      }
    }
    load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("leases")
      .update({
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        rent_amount: parseInt(formData.rent_amount),
        deposit: parseInt(formData.deposit) || 0,
        status: formData.status,
      })
      .eq("id", id);

    if (error) {
      toast.error("Erreur lors de la modification.");
      setLoading(false);
      return;
    }

    toast.success("Bail modifie avec succes !");
    router.push("/dashboard/leases");
    router.refresh();
  }

  return (
    <div>
      <Link href="/dashboard/leases" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />Retour aux baux
      </Link>

      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Modifier le bail</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Infos non modifiables */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bien</Label>
                <Input value={propertyTitle} disabled />
              </div>
              <div className="space-y-2">
                <Label>Locataire</Label>
                <Input value={tenantName} disabled />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Date de debut</Label>
                <Input id="start_date" type="date" value={formData.start_date} onChange={(e) => setFormData((p) => ({ ...p, start_date: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">Date de fin (optionnel)</Label>
                <Input id="end_date" type="date" value={formData.end_date} onChange={(e) => setFormData((p) => ({ ...p, end_date: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rent_amount">Loyer mensuel (FCFA)</Label>
                <Input id="rent_amount" type="number" value={formData.rent_amount} onChange={(e) => setFormData((p) => ({ ...p, rent_amount: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deposit">Caution (FCFA)</Label>
                <Input id="deposit" type="number" value={formData.deposit} onChange={(e) => setFormData((p) => ({ ...p, deposit: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Statut du bail</Label>
              <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={formData.status} onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}>
                <option value="ACTIVE">Actif</option>
                <option value="EXPIRED">Expire</option>
                <option value="TERMINATED">Resilie</option>
              </select>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>{loading ? "Modification..." : "Enregistrer"}</Button>
              <Link href="/dashboard/leases">
                <Button type="button" variant="outline">Annuler</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
