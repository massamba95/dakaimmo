export const metadata = {
  title: "Plaquette · Jappalé Immo",
  description: "Brochure commerciale — gestion immobilière pour le Sénégal",
};

export default function PlaquetteLayout({ children }: { children: React.ReactNode }) {
  return <div className="plaquette-root">{children}</div>;
}
