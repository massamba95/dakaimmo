"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useOrg } from "@/lib/hooks/use-org";
import { hasPermission } from "@/lib/permissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { ArrowLeft, Phone, Mail, Home, Building, Store, MapPin, Pencil, FileText } from "lucide-react";

interface Owner {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  notes: string | null;
}

interface Property {
  id: string;
  title: string;
  type: string;
  listing_type: string;
  address: string;
  city: string;
  rooms: number | null;
  area: number | null;
  rent_amount: number;
  sale_price: number | null;
  status: string;
}

const typeLabels: Record<string, string> = {
  APARTMENT: "Appartement",
  HOUSE: "Maison",
  COMMERCIAL: "Local commercial",
  LAND: "Terrain",
};

const typeIcons: Record<string, typeof Home> = {
  APARTMENT: Building,
  HOUSE: Home,
  COMMERCIAL: Store,
  LAND: MapPin,
};

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  AVAILABLE: { label: "Disponible", variant: "secondary" },
  OCCUPIED: { label: "Occupé", variant: "default" },
  MAINTENANCE: { label: "En travaux", variant: "destructive" },
  SOLD: { label: "Vendu", variant: "outline" },
};

const listingConfig: Record<string, { label: string; color: string }> = {
  RENT: { label: "Location", color: "text-blue-600 bg-blue-50" },
  SALE: { label: "Vente", color: "text-orange-600 bg-orange-50" },
  BOTH: { label: "Location + Vente", color: "text-purple-600 bg-purple-50" },
};

export default function OwnerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { role } = useOrg();
  const canEdit = hasPermission(role, "owners:edit");
  const canDelete = hasPermission(role, "owners:delete");
  const [owner, setOwner] = useState<Owner | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data: ownerData }, { data: propsData }] = await Promise.all([
        supabase.from("owners").select("*").eq("id", id).single(),
        supabase.from("properties").select("id, title, type, listing_type, address, city, rooms, area, rent_amount, sale_price, status").eq("owner_id", id).order("created_at", { ascending: false }),
      ]);
      setOwner(ownerData);
      setProperties(propsData ?? []);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><p className="text-muted-foreground">Chargement...</p></div>;
  }

  if (!owner) {
    return <div className="text-center py-20"><p>Propriétaire introuvable.</p></div>;
  }

  return (
    <div>
      <Link href="/dashboard/owners" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />Retour aux propriétaires
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-primary">
              {owner.first_name[0]}{owner.last_name[0]}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{owner.first_name} {owner.last_name}</h1>
            <div className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />{owner.phone}
              </span>
              {owner.email && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />{owner.email}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {canEdit && (
            <Link href={`/dashboard/owners/${id}/edit`}>
              <Button variant="outline" size="sm"><Pencil className="h-4 w-4 mr-1" />Modifier</Button>
            </Link>
          )}
          {canDelete && (
            <DeleteButton table="owners" id={id} label="Propriétaire" redirectTo="/dashboard/owners" />
          )}
        </div>
      </div>

      {owner.notes && (
        <Card className="mb-6">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">{owner.notes}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Biens de ce propriétaire</span>
            <Badge variant="outline">{properties.length} bien{properties.length > 1 ? "s" : ""}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {properties.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">Aucun bien associé à ce propriétaire.</p>
              <Link href="/dashboard/properties/new" className="mt-3 inline-block">
                <Button variant="outline" size="sm">Ajouter un bien</Button>
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {properties.map((property) => {
                const Icon = typeIcons[property.type] ?? Home;
                const status = statusConfig[property.status];
                const listing = listingConfig[property.listing_type ?? "RENT"];
                return (
                  <Link key={property.id} href={`/dashboard/properties/${property.id}`}>
                    <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{property.title}</p>
                            <p className="text-xs text-muted-foreground">{typeLabels[property.type]}</p>
                          </div>
                        </div>
                        <Badge variant={status?.variant} className="text-xs">{status?.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                        <MapPin className="h-3 w-3" />{property.address}, {property.city}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${listing?.color}`}>
                          {listing?.label}
                        </span>
                        <span className="text-sm font-bold">
                          {property.listing_type === "SALE"
                            ? `${property.sale_price?.toLocaleString("fr-FR")} FCFA`
                            : `${property.rent_amount.toLocaleString("fr-FR")} FCFA/mois`}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
