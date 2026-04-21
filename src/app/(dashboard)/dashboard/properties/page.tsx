"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useOrg } from "@/lib/hooks/use-org";
import { hasPermission } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from "@/components/dashboard/search-bar";
import { CsvImportDialog } from "@/components/dashboard/csv-import-dialog";
import { Plus, Home, Building2, Store, MapPin, ChevronDown, ChevronRight, Layers } from "lucide-react";

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
  charges: number;
  sale_price: number | null;
  status: string;
  photos: string[];
  parent_id: string | null;
  unit_label: string | null;
  floor: number | null;
  created_at: string;
}

const typeLabels: Record<string, string> = {
  APARTMENT: "Appartement",
  HOUSE: "Maison",
  COMMERCIAL: "Local commercial",
  LAND: "Terrain",
  BUILDING: "Immeuble",
};

const statusConfig: Record<string, { label: string; cls: string }> = {
  AVAILABLE:   { label: "Disponible",  cls: "bg-green-100 text-green-800" },
  OCCUPIED:    { label: "Occupé",      cls: "bg-blue-100 text-blue-800" },
  MAINTENANCE: { label: "En travaux",  cls: "bg-yellow-100 text-yellow-800" },
  SOLD:        { label: "Vendu",       cls: "bg-gray-100 text-gray-600" },
};

const listingCls: Record<string, string> = {
  RENT: "text-blue-600 bg-blue-50",
  SALE: "text-orange-600 bg-orange-50",
  BOTH: "text-purple-600 bg-purple-50",
};

const listingLabel: Record<string, string> = {
  RENT: "Location", SALE: "Vente", BOTH: "Location + Vente",
};

const typeIcons: Record<string, typeof Home> = {
  APARTMENT: Building2,
  HOUSE: Home,
  COMMERCIAL: Store,
  LAND: MapPin,
  BUILDING: Layers,
};

export default function PropertiesPage() {
  const { orgId, role } = useOrg();
  const canCreate = hasPermission(role, "properties:create");
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "RENT" | "SALE" | "SOLD">("all");
  const [expandedBuildings, setExpandedBuildings] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  async function fetchProperties() {
    if (!orgId) return;
    const supabase = createClient();
    const { data, error } = await supabase.from("properties").select("*").eq("org_id", orgId).order("created_at", { ascending: false });
    if (error) {
      console.error("[properties] fetch error:", error);
    }
    console.log("[properties] loaded:", data?.length ?? 0, "for org", orgId);
    setProperties(data ?? []);
  }

  useEffect(() => {
    if (!orgId) return;
    async function load() {
      await fetchProperties();
      setLoading(false);
    }
    load();
  }, [orgId]);

  function toggleBuilding(id: string) {
    setExpandedBuildings((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // Séparer bâtiments, unités enfants et biens autonomes
  const buildings = properties.filter((p) => p.type === "BUILDING");
  const unitsByBuilding = (buildingId: string) => properties.filter((p) => p.parent_id === buildingId);
  // Les biens "autonomes" : tout ce qui n'est ni un immeuble, ni une unité rattachée à un immeuble existant
  const buildingIds = new Set(buildings.map((b) => b.id));
  const standalone = properties.filter((p) => p.type !== "BUILDING" && !(p.parent_id && buildingIds.has(p.parent_id)));

  const applyTabFilter = (list: Property[]) => list.filter((p) => {
    if (activeTab === "SOLD") return p.status === "SOLD";
    if (activeTab === "RENT") return p.listing_type === "RENT" && p.status !== "SOLD";
    if (activeTab === "SALE") return (p.listing_type === "SALE" || p.listing_type === "BOTH") && p.status !== "SOLD";
    return true;
  });

  const applySearch = (list: Property[]) => {
    const q = search.toLowerCase();
    if (!q) return list;
    return list.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q)
    );
  };

  const visibleBuildings = applySearch(buildings);
  const visibleStandalone = applySearch(applyTabFilter(standalone));

  const total = properties.filter((p) => p.type !== "BUILDING").length;

  if (loading) {
    return <div className="flex items-center justify-center py-20"><p className="text-muted-foreground">Chargement...</p></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes biens</h1>
          <p className="text-muted-foreground mt-1">Gérez votre patrimoine immobilier.</p>
        </div>
        {canCreate && (
          <div className="flex items-center gap-2">
            <CsvImportDialog type="properties" onSuccess={fetchProperties} />
            <Link href="/dashboard/properties/new">
              <Button><Plus className="h-4 w-4 mr-2" />Ajouter</Button>
            </Link>
          </div>
        )}
      </div>

      {total > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex gap-1 border-b">
            {(["all", "RENT", "SALE", "SOLD"] as const).map((tab) => {
              const labels = { all: "Tous", RENT: "Location", SALE: "Vente", SOLD: "Vendus" };
              const count = tab === "all" ? total
                : tab === "SOLD" ? standalone.filter((p) => p.status === "SOLD").length
                : tab === "RENT" ? standalone.filter((p) => p.listing_type === "RENT" && p.status !== "SOLD").length
                : standalone.filter((p) => (p.listing_type === "SALE" || p.listing_type === "BOTH") && p.status !== "SOLD").length;
              return (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  {labels[tab]} <span className="ml-1 text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
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
      ) : (
        <div className="mt-6 space-y-4">

          {/* Immeubles avec leurs unités */}
          {visibleBuildings.map((building) => {
            const units = unitsByBuilding(building.id);
            const expanded = expandedBuildings.has(building.id);
            const availableCount = units.filter((u) => u.status === "AVAILABLE").length;
            const occupiedCount = units.filter((u) => u.status === "OCCUPIED").length;

            return (
              <div key={building.id} className="border rounded-xl overflow-hidden">
                {/* En-tête immeuble */}
                <div className="bg-muted/50 px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Layers className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <Link href={`/dashboard/properties/${building.id}`} className="font-semibold hover:underline truncate block">
                        {building.title}
                      </Link>
                      <p className="text-sm text-muted-foreground truncate">{building.address}, {building.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">{units.length} unité{units.length > 1 ? "s" : ""}</p>
                      <p className="text-xs">
                        <span className="text-green-600">{availableCount} libre{availableCount > 1 ? "s" : ""}</span>
                        {occupiedCount > 0 && <> · <span className="text-blue-600">{occupiedCount} occupé{occupiedCount > 1 ? "s" : ""}</span></>}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleBuilding(building.id)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Unités */}
                {expanded && (
                  <div className="divide-y">
                    {units.length === 0 ? (
                      <div className="px-5 py-4 text-sm text-muted-foreground flex items-center justify-between">
                        <span>Aucune unité dans cet immeuble.</span>
                        {canCreate && (
                          <Link href={`/dashboard/properties/new?parent=${building.id}`}>
                            <Button size="sm" variant="outline"><Plus className="h-3.5 w-3.5 mr-1" />Ajouter une unité</Button>
                          </Link>
                        )}
                      </div>
                    ) : (
                      <>
                        {units.map((unit) => {
                          const st = statusConfig[unit.status];
                          return (
                            <Link key={unit.id} href={`/dashboard/properties/${unit.id}`}
                              className="px-5 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="min-w-0">
                                  <p className="font-medium text-sm truncate">
                                    {unit.unit_label ? `${unit.unit_label} — ` : ""}{unit.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {typeLabels[unit.type]}
                                    {unit.rooms && ` · ${unit.rooms} pièces`}
                                    {unit.area && ` · ${unit.area}m²`}
                                    {unit.floor != null && ` · Étage ${unit.floor}`}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                {unit.listing_type === "RENT" || unit.listing_type === "BOTH" ? (
                                  <span className="text-sm font-bold">{unit.rent_amount.toLocaleString("fr-FR")} <span className="text-xs font-normal text-muted-foreground">FCFA/mois</span></span>
                                ) : unit.sale_price ? (
                                  <span className="text-sm font-bold">{unit.sale_price.toLocaleString("fr-FR")} <span className="text-xs font-normal text-muted-foreground">FCFA</span></span>
                                ) : null}
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st?.cls ?? ""}`}>{st?.label}</span>
                              </div>
                            </Link>
                          );
                        })}
                        {canCreate && (
                          <div className="px-5 py-3 bg-muted/20">
                            <Link href={`/dashboard/properties/new?parent=${building.id}`}>
                              <Button size="sm" variant="outline"><Plus className="h-3.5 w-3.5 mr-1" />Ajouter une unité</Button>
                            </Link>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Biens autonomes */}
          {visibleStandalone.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleStandalone.map((property) => {
                const Icon = typeIcons[property.type] ?? Home;
                const st = statusConfig[property.status];
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
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st?.cls ?? ""}`}>{st?.label}</span>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />{property.address}, {property.city}
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${listingCls[property.listing_type ?? "RENT"] ?? ""}`}>
                            {listingLabel[property.listing_type ?? "RENT"] ?? "Location"}
                          </span>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t">
                            {(property.listing_type === "RENT" || property.listing_type === "BOTH" || !property.listing_type) && (
                              <span className="text-sm font-bold">{property.rent_amount.toLocaleString("fr-FR")} <span className="text-muted-foreground font-normal">FCFA/mois</span></span>
                            )}
                            {property.listing_type === "SALE" && property.sale_price && (
                              <span className="text-sm font-bold">{property.sale_price.toLocaleString("fr-FR")} <span className="text-muted-foreground font-normal">FCFA</span></span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}

          {visibleBuildings.length === 0 && visibleStandalone.length === 0 && search && (
            <p className="text-muted-foreground text-center py-12">Aucun résultat pour &quot;{search}&quot;</p>
          )}

          {visibleBuildings.length === 0 && visibleStandalone.length === 0 && !search && properties.length > 0 && (
            <p className="text-muted-foreground text-center py-12">
              {properties.length} bien(s) en base mais aucun à afficher avec le filtre actuel. Vérifiez l&apos;onglet sélectionné.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
