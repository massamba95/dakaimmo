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
import { ArrowLeft, MapPin, Home, Ruler, DoorOpen, Pencil, Share2, MessageCircle, Copy } from "lucide-react";
import { generateWhatsAppMessage, getWhatsAppShareUrl, generateFacebookPost } from "@/lib/whatsapp";
import { toast } from "sonner";

interface Property {
  id: string;
  title: string;
  type: string;
  address: string;
  city: string;
  rooms: number | null;
  area: number | null;
  rent_amount: number;
  charges: number;
  status: string;
  photos: string[];
}

interface LeaseWithTenant {
  id: string;
  start_date: string;
  end_date: string | null;
  rent_amount: number;
  status: string;
  tenants: { first_name: string; last_name: string; phone: string } | null;
}

const typeLabels: Record<string, string> = {
  APARTMENT: "Appartement",
  HOUSE: "Maison",
  COMMERCIAL: "Local commercial",
  LAND: "Terrain",
};

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  AVAILABLE: { label: "Disponible", variant: "secondary" },
  OCCUPIED: { label: "Occupe", variant: "default" },
  MAINTENANCE: { label: "En travaux", variant: "destructive" },
};

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { role, orgName } = useOrg();
  const canEdit = hasPermission(role, "properties:edit");
  const canDelete = hasPermission(role, "properties:delete");
  const [property, setProperty] = useState<Property | null>(null);
  const [leases, setLeases] = useState<LeaseWithTenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const { data: prop } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      const { data: leaseData } = await supabase
        .from("leases")
        .select("*, tenants(first_name, last_name, phone)")
        .eq("property_id", id)
        .eq("status", "ACTIVE");

      setProperty(prop);
      setLeases((leaseData as LeaseWithTenant[]) ?? []);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><p className="text-muted-foreground">Chargement...</p></div>;
  }

  if (!property) {
    return <div className="text-center py-20"><p>Bien introuvable.</p></div>;
  }

  const status = statusConfig[property.status];

  return (
    <div>
      <Link href="/dashboard/properties" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />Retour aux biens
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{property.title}</h1>
          <p className="text-muted-foreground mt-1">{typeLabels[property.type]}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={status?.variant} className="text-sm px-3 py-1">{status?.label}</Badge>
          {canEdit && (
            <Link href={`/dashboard/properties/${id}/edit`}>
              <Button variant="outline" size="sm"><Pencil className="h-4 w-4 mr-1" />Modifier</Button>
            </Link>
          )}
          {canDelete && (
            <DeleteButton table="properties" id={id} label="Bien" redirectTo="/dashboard/properties" />
          )}
        </div>
      </div>

      {/* Photos */}
      {property.photos && property.photos.length > 0 && (
        <div className="mt-6 flex gap-4 overflow-x-auto">
          {property.photos.map((url, i) => (
            <img key={i} src={url} alt={`Photo ${i + 1}`} className="h-48 w-72 object-cover rounded-lg border" />
          ))}
        </div>
      )}

      {/* Boutons de partage */}
      {property.status === "AVAILABLE" && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Share2 className="h-5 w-5 text-muted-foreground shrink-0" />
              <span className="text-sm font-medium">Diffuser cette annonce :</span>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    const msg = generateWhatsAppMessage(property, orgName ?? "");
                    const url = getWhatsAppShareUrl(msg);
                    window.open(url, "_blank");
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  WhatsApp
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const post = generateFacebookPost(property, orgName ?? "");
                    navigator.clipboard.writeText(post);
                    toast.success("Annonce copiee ! Collez-la sur Facebook ou Instagram.");
                  }}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copier pour Facebook / Instagram
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Adresse</p>
                <p className="font-medium">{property.address}, {property.city}</p>
              </div>
            </div>
            {property.rooms && (
              <div className="flex items-center gap-3">
                <DoorOpen className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Pieces</p>
                  <p className="font-medium">{property.rooms} pieces</p>
                </div>
              </div>
            )}
            {property.area && (
              <div className="flex items-center gap-3">
                <Ruler className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Superficie</p>
                  <p className="font-medium">{property.area} m2</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Home className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Loyer + charges</p>
                <p className="font-medium">
                  {property.rent_amount.toLocaleString("fr-FR")} + {property.charges.toLocaleString("fr-FR")} = {(property.rent_amount + property.charges).toLocaleString("fr-FR")} FCFA/mois
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Locataire actuel</CardTitle></CardHeader>
          <CardContent>
            {leases.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucun locataire actif</p>
                <Link href="/dashboard/leases/new" className="mt-4 inline-block">
                  <Button variant="outline" size="sm">Creer un bail</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {leases.map((lease) => (
                  <div key={lease.id} className="p-4 border rounded-lg">
                    <p className="font-semibold">{lease.tenants?.first_name} {lease.tenants?.last_name}</p>
                    <p className="text-sm text-muted-foreground">Tel: {lease.tenants?.phone}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Bail: {new Date(lease.start_date).toLocaleDateString("fr-FR")}
                      {lease.end_date && ` — ${new Date(lease.end_date).toLocaleDateString("fr-FR")}`}
                    </p>
                    <p className="text-sm font-medium mt-1">{lease.rent_amount.toLocaleString("fr-FR")} FCFA/mois</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
