const typeLabels: Record<string, string> = {
  APARTMENT: "Appartement",
  HOUSE: "Maison",
  COMMERCIAL: "Local commercial",
  LAND: "Terrain",
};

interface PropertyForShare {
  title: string;
  type: string;
  address: string;
  city: string;
  rooms: number | null;
  area: number | null;
  rent_amount: number;
  status: string;
}

export function generateWhatsAppMessage(property: PropertyForShare, orgName: string, phone?: string): string {
  const type = typeLabels[property.type] ?? property.type;
  const rooms = property.rooms ? `${property.rooms} pieces` : "";
  const area = property.area ? `${property.area} m2` : "";
  const details = [type, rooms, area].filter(Boolean).join(" - ");
  const statusLabel = property.status === "AVAILABLE" ? "Disponible immediatement" : "Occupe";

  let message = `*${property.title}*\n\n`;
  message += `${details}\n`;
  message += `${property.address}, ${property.city}\n\n`;
  message += `*${property.rent_amount.toLocaleString("fr-FR")} FCFA / mois*\n`;
  message += `${statusLabel}\n\n`;
  message += `${orgName}`;
  if (phone) message += `\nContact : ${phone}`;

  return message;
}

export function getWhatsAppShareUrl(message: string, phoneNumber?: string): string {
  const encoded = encodeURIComponent(message);
  if (phoneNumber) {
    const clean = phoneNumber.replace(/[^0-9]/g, "");
    return `https://wa.me/${clean}?text=${encoded}`;
  }
  return `https://wa.me/?text=${encoded}`;
}

export function generateFacebookPost(property: PropertyForShare, orgName: string): string {
  const type = typeLabels[property.type] ?? property.type;
  let post = `${type} a louer - ${property.title}\n\n`;
  post += `${property.address}, ${property.city}\n`;
  if (property.rooms) post += `${property.rooms} pieces`;
  if (property.area) post += ` - ${property.area} m2`;
  post += `\n\nLoyer : ${property.rent_amount.toLocaleString("fr-FR")} FCFA / mois\n\n`;
  post += `Contactez ${orgName} pour plus d'informations.`;
  return post;
}
