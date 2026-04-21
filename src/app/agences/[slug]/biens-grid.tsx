"use client";

import { useState } from "react";
import { Home, MapPin, DoorOpen, Ruler, MessageCircle, Calendar, Loader2, CheckCircle2 } from "lucide-react";

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
}

type FilterTab = "all" | "RENT" | "SALE";

export function BiensGrid({ biens, orgName, orgId }: { biens: PublicProperty[]; orgName: string; orgId: string }) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const rentCount = biens.filter((b) => b.listing_type === "RENT" || b.listing_type === "BOTH").length;
  const saleCount = biens.filter((b) => b.listing_type === "SALE" || b.listing_type === "BOTH").length;
  const showTabs = rentCount > 0 && saleCount > 0;

  const filtered = biens.filter((b) => {
    if (activeTab === "RENT") return b.listing_type === "RENT" || b.listing_type === "BOTH";
    if (activeTab === "SALE") return b.listing_type === "SALE" || b.listing_type === "BOTH";
    return true;
  });

  return (
    <div>
      {showTabs && (
        <div className="flex gap-1 border-b mb-6">
          {([
            { key: "all",  label: `Tous (${biens.length})` },
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

function BienCard({ bien, orgName, orgId }: { bien: PublicProperty; orgName: string; orgId: string }) {
  const photo = bien.photos?.[0];
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
        {photo ? (
          <img src={photo} alt={bien.title} className="w-full h-44 object-cover" />
        ) : (
          <div className="w-full h-44 bg-muted flex items-center justify-center">
            <Home className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}

        <div className="p-4 space-y-3">
          <span className="inline-block text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {listingLabels[lt] ?? lt}
          </span>

          <h2 className="font-semibold text-base leading-tight">{bien.title}</h2>

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
