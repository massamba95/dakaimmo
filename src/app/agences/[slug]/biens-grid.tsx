"use client";

import { useState, useCallback } from "react";
import { Home, MapPin, DoorOpen, Ruler, MessageCircle, Calendar, Loader2, CheckCircle2, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

const typeLabels: Record<string, string> = {
  APARTMENT: "Appartement",
  HOUSE: "Maison",
  COMMERCIAL: "Local commercial",
  LAND: "Terrain",
};

const listingLabels: Record<string, string> = {
  RENT: "Location",
  SALE: "Vente",
  BOTH: "Location / Vente",
};

export interface PublicProperty {
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
  photos: string[];
  parent_id: string | null;
  unit_label: string | null;
  floor: number | null;
  parent?: { title: string } | null;
}

type FilterTab = "all" | "RENT" | "SALE";

export function BiensGrid({ biens, orgName, orgId }: { biens: PublicProperty[]; orgName: string; orgId: string }) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const displayBiens = biens.filter((b) => b.type !== "BUILDING");

  const rentCount = displayBiens.filter((b) => b.listing_type === "RENT" || b.listing_type === "BOTH").length;
  const saleCount = displayBiens.filter((b) => b.listing_type === "SALE" || b.listing_type === "BOTH").length;
  const showTabs = rentCount > 0 && saleCount > 0;

  const filtered = displayBiens.filter((b) => {
    if (activeTab === "RENT") return b.listing_type === "RENT" || b.listing_type === "BOTH";
    if (activeTab === "SALE") return b.listing_type === "SALE" || b.listing_type === "BOTH";
    return true;
  });

  return (
    <div>
      {showTabs && (
        <div className="flex gap-1 border-b mb-6">
          {([
            { key: "all",  label: `Tous (${displayBiens.length})` },
            { key: "RENT", label: `Location (${rentCount})` },
            { key: "SALE", label: `Vente (${saleCount})` },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Home className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="mt-4 text-muted-foreground">Aucun bien dans cette catégorie.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((bien) => (
            <BienCard key={bien.id} bien={bien} orgName={orgName} orgId={orgId} />
          ))}
        </div>
      )}
    </div>
  );
}

function PhotoCarousel({ photos, title }: { photos: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const next = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i + 1) % photos.length);
  }, [photos.length]);

  if (photos.length === 0) {
    return (
      <div className="w-full h-48 bg-muted flex items-center justify-center">
        <Home className="h-10 w-10 text-muted-foreground/40" />
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full h-48 group overflow-hidden">
        <img
          src={photos[index]}
          alt={`${title} — photo ${index + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Bouton zoom */}
        <button
          onClick={() => setLightbox(true)}
          className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors"
        >
          <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
        </button>

        {/* Navigation — seulement si plusieurs photos */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Compteur */}
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
              {index + 1}/{photos.length}
            </div>

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? "bg-white" : "bg-white/50"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X className="h-7 w-7" />
          </button>

          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[index]}
              alt={`${title} — photo ${index + 1}`}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />

            {photos.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Miniatures */}
            {photos.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1 justify-center">
                {photos.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-colors ${i === index ? "border-white" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img src={p} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <p className="text-center text-white/60 text-sm mt-2">{index + 1} / {photos.length}</p>
          </div>
        </div>
      )}
    </>
  );
}

function BienCard({ bien, orgName, orgId }: { bien: PublicProperty; orgName: string; orgId: string }) {
  const lt = bien.listing_type;
  const [showVisit, setShowVisit] = useState(false);

  const whatsappText = encodeURIComponent(
    `Bonjour, je suis intéressé(e) par ce bien :\n\n` +
    `📍 ${bien.title}\n` +
    `${typeLabels[bien.type] ?? bien.type} — ${bien.city}\n` +
    `${bien.address}\n` +
    (lt !== "SALE" && bien.rent_amount
      ? `💰 Loyer : ${bien.rent_amount.toLocaleString("fr-FR")} FCFA/mois\n`
      : "") +
    (lt !== "RENT" && bien.sale_price
      ? `💰 Prix : ${bien.sale_price.toLocaleString("fr-FR")} FCFA\n`
      : "") +
    `\nMerci de me recontacter. — Via vitrine ${orgName}`
  );

  return (
    <>
      <div className="bg-card rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
        <PhotoCarousel photos={bien.photos ?? []} title={bien.title} />

        <div className="p-4 space-y-3">
          <span className="inline-block text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {listingLabels[lt] ?? lt}
          </span>

          <div>
            {bien.parent && (
              <p className="text-xs text-muted-foreground mb-0.5">{bien.parent.title}{bien.unit_label ? ` · ${bien.unit_label}` : ""}</p>
            )}
            <h2 className="font-semibold text-base leading-tight">{bien.title}</h2>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{bien.address}, {bien.city}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="text-xs bg-muted px-2 py-0.5 rounded">
              {typeLabels[bien.type] ?? bien.type}
            </span>
            {bien.rooms && (
              <span className="flex items-center gap-1">
                <DoorOpen className="h-3.5 w-3.5" />{bien.rooms}p
              </span>
            )}
            {bien.area && (
              <span className="flex items-center gap-1">
                <Ruler className="h-3.5 w-3.5" />{bien.area}m²
              </span>
            )}
          </div>

          <div className="space-y-0.5">
            {(lt === "RENT" || lt === "BOTH") && bien.rent_amount > 0 && (
              <p className="font-bold text-primary">
                {bien.rent_amount.toLocaleString("fr-FR")} FCFA
                <span className="text-sm font-normal text-muted-foreground">/mois</span>
                {bien.charges > 0 && (
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    + {bien.charges.toLocaleString("fr-FR")} charges
                  </span>
                )}
              </p>
            )}
            {(lt === "SALE" || lt === "BOTH") && bien.sale_price && (
              <p className="font-bold text-primary">
                {bien.sale_price.toLocaleString("fr-FR")} FCFA
                <span className="text-sm font-normal text-muted-foreground ml-1">(vente)</span>
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowVisit(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2 rounded-lg transition-colors"
            >
              <Calendar className="h-4 w-4" />
              Visiter
            </button>
            <a
              href={`https://wa.me/?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {showVisit && (
        <VisitDialog
          bien={bien}
          orgId={orgId}
          onClose={() => setShowVisit(false)}
        />
      )}
    </>
  );
}

function VisitDialog({ bien, orgId, onClose }: { bien: PublicProperty; orgId: string; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", time: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/public/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        property_id: bien.id,
        org_id: orgId,
        property_title: bien.title,
        visitor_name: form.name,
        visitor_phone: form.phone,
        visitor_email: form.email || null,
        requested_date: form.date,
        requested_time: form.time || null,
        message: form.message || null,
      }),
    });
    setLoading(false);
    if (res.ok) setDone(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Demander une visite</h2>
            <p className="text-sm text-muted-foreground truncate">{bien.title}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl">✕</button>
        </div>

        <div className="p-5">
          {done ? (
            <div className="flex flex-col items-center text-center py-6 gap-3">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <p className="font-medium">Demande envoyée !</p>
              <p className="text-sm text-muted-foreground">L'agence vous contactera pour confirmer la visite.</p>
              <button onClick={onClose} className="mt-2 text-sm text-primary underline">Fermer</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-sm font-medium">Nom complet *</label>
                  <input
                    type="text" required placeholder="Votre nom"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Téléphone *</label>
                  <input
                    type="tel" required placeholder="+221 77 000 00 00"
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email" placeholder="votre@email.com"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Date souhaitée *</label>
                  <input
                    type="date" required min={new Date().toISOString().split("T")[0]}
                    value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Heure souhaitée</label>
                  <input
                    type="time"
                    value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-sm font-medium">Message (optionnel)</label>
                  <textarea
                    rows={2} placeholder="Questions ou précisions..."
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60"
              >
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Envoi...</> : "Envoyer la demande"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
