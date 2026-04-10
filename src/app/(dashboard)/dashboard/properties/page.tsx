"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/dashboard/search-bar";
import { Plus, Home, Building, Store, MapPin } from "lucide-react";

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
  created_at: string;
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

const typeIcons: Record<string, typeof Home> = {
  APARTMENT: Building,
  HOUSE: Home,
  COMMERCIAL: Store,
  LAND: MapPin,
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setProperties(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = properties.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      typeLabels[p.type]?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return <div className="flex items-center justify-center py-20"><p className="text-muted-foreground">Chargement...</p></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes biens</h1>
          <p className="text-muted-foreground mt-1">Gerez votre patrimoine immobilier.</p>
        </div>
        <Link href="/dashboard/properties/new">
          <Button><Plus className="h-4 w-4 mr-2" />Ajouter un bien</Button>
        </Link>
      </div>

      {properties.length > 0 && (
        <div className="mt-6">
          <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un bien..." />
        </div>
      )}

      {properties.length === 0 ? (
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Home className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Aucun bien</h3>
            <p className="text-muted-foreground mt-1">Commencez par ajouter votre premier bien immobilier.</p>
            <Link href="/dashboard/properties/new" className="mt-4">
              <Button><Plus className="h-4 w-4 mr-2" />Ajouter un bien</Button>
            </Link>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">Aucun resultat pour &quot;{search}&quot;</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filtered.map((property) => {
            const Icon = typeIcons[property.type] ?? Home;
            const status = statusConfig[property.status];
            return (
              <Link key={property.id} href={`/dashboard/properties/${property.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{property.title}</h3>
                          <p className="text-sm text-muted-foreground">{typeLabels[property.type]}</p>
                        </div>
                      </div>
                      <Badge variant={status?.variant}>{status?.label}</Badge>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {property.address}, {property.city}
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <span className="text-sm text-muted-foreground">Loyer mensuel</span>
                        <span className="font-bold text-lg">{property.rent_amount.toLocaleString("fr-FR")} FCFA</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
