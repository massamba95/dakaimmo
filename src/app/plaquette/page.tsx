import Image from "next/image";

export default function PlaquettePage() {
  return (
    <>
      {/* Styles locaux pour l'impression A4 */}
      <style>{`
        @page { size: A4; margin: 0; }
        html, body { margin: 0; padding: 0; background: #fff; }
        .plaquette-root { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; line-height: 1.5; }
        .page-a4 { width: 210mm; min-height: 297mm; padding: 16mm; box-sizing: border-box; break-after: page; page-break-after: always; position: relative; display: flex; flex-direction: column; }
        .page-a4:last-child { break-after: auto; }
        @media screen { .page-a4 { box-shadow: 0 2px 12px rgba(0,0,0,.1); margin: 20px auto; } body { background: #f1f5f9; } }
        .brand-primary { color: #3741d3; }
        .bg-brand { background: #3741d3; color: #fff; }
        .bg-brand-soft { background: rgba(55,65,211,0.08); }
        h1.cover { font-size: 44pt; font-weight: 800; line-height: 1.05; letter-spacing: -0.02em; margin: 0; }
        h2.section { font-size: 24pt; font-weight: 800; margin: 0 0 6mm; letter-spacing: -0.015em; }
        h3 { font-size: 14pt; font-weight: 700; margin: 0 0 2mm; }
        .lede { font-size: 13pt; color: #475569; line-height: 1.55; }
        .tag { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 999px; font-size: 10pt; font-weight: 600; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10mm; }
        .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 6mm; }
        .card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 6mm; background: #fff; }
        .card-brand { border: 2px solid #3741d3; }
        .chip { width: 36px; height: 36px; border-radius: 9px; background: rgba(55,65,211,0.1); color: #3741d3; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16pt; margin-bottom: 3mm; }
        .footer-brand { position: absolute; bottom: 10mm; left: 16mm; right: 16mm; display: flex; justify-content: space-between; align-items: center; font-size: 9pt; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 4mm; }
        ul.features { list-style: none; padding: 0; margin: 0; }
        ul.features li { position: relative; padding-left: 20px; margin-bottom: 6px; font-size: 11pt; }
        ul.features li::before { content: "✓"; position: absolute; left: 0; color: #3741d3; font-weight: bold; }
        .price { font-size: 28pt; font-weight: 800; line-height: 1; }
        .price small { font-size: 10pt; font-weight: 500; color: #64748b; }
        .kv { display: flex; justify-content: space-between; padding: 3mm 0; border-bottom: 1px solid #e2e8f0; font-size: 11pt; }
        .kv:last-child { border-bottom: 0; }
        .highlight-box { background: rgba(55,65,211,0.06); border-left: 4px solid #3741d3; padding: 5mm 6mm; border-radius: 0 8px 8px 0; font-size: 11pt; }
        .stat { text-align: center; padding: 6mm 2mm; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; }
        .stat .n { font-size: 22pt; font-weight: 800; color: #3741d3; }
        .stat .l { font-size: 9pt; color: #64748b; margin-top: 2mm; }
        .no-print { }
        @media print { .no-print { display: none !important; } }
      `}</style>

      {/* ========== PAGE 1 — COUVERTURE ========== */}
      <section className="page-a4" style={{ background: "linear-gradient(135deg, #3741d3 0%, #5b67f0 100%)", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22pt", fontWeight: 800 }}>J</div>
          <div style={{ fontSize: "16pt", fontWeight: 700 }}>Jappalé Immo</div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: "170mm" }}>
          <div className="tag" style={{ background: "rgba(255,255,255,0.2)", color: "#fff", marginBottom: "8mm" }}>
            Plateforme SaaS · Sénégal &amp; Afrique de l&apos;Ouest
          </div>
          <h1 className="cover" style={{ color: "#fff" }}>
            La gestion immobilière<br />
            <span style={{ opacity: 0.85 }}>enfin simple</span> pour les<br />
            agences sénégalaises.
          </h1>
          <p style={{ fontSize: "14pt", marginTop: "8mm", opacity: 0.9, maxWidth: "150mm" }}>
            Biens, locataires, baux, paiements, quittances — tout centralisé en un seul endroit. Accessible depuis n&apos;importe quel téléphone.
          </p>

          <div style={{ display: "flex", gap: "4mm", marginTop: "12mm", flexWrap: "wrap" }}>
            <div className="tag" style={{ background: "#fff", color: "#3741d3" }}>✓ Essai gratuit 1 mois</div>
            <div className="tag" style={{ background: "#fff", color: "#3741d3" }}>✓ Sans carte bancaire</div>
            <div className="tag" style={{ background: "#fff", color: "#3741d3" }}>✓ Mise en route en 15 min</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", fontSize: "10pt", opacity: 0.85 }}>
          <div>
            <div style={{ fontSize: "11pt", fontWeight: 600 }}>jappaleimmo.com</div>
            <div>contact@jappaleimmo.com</div>
          </div>
          <div style={{ textAlign: "right" }}>
            Édition 2026<br />
            Document commercial
          </div>
        </div>
      </section>

      {/* ========== PAGE 2 — LE PROBLÈME ========== */}
      <section className="page-a4">
        <div className="tag bg-brand-soft brand-primary" style={{ alignSelf: "flex-start", marginBottom: "8mm" }}>
          Le constat
        </div>
        <h2 className="section">
          Gérer une agence immobilière<br />au Sénégal, c&apos;est souvent…
        </h2>
        <p className="lede" style={{ maxWidth: "170mm", marginBottom: "10mm" }}>
          Des heures perdues à chercher l&apos;info, des loyers oubliés, des tensions évitables avec les locataires. Un quotidien épuisant pour des équipes qui veulent se concentrer sur leur vrai métier : bien gérer les biens de leurs clients.
        </p>

        <div className="grid-2" style={{ flex: 1 }}>
          <div className="card">
            <div className="chip">📊</div>
            <h3>Des fichiers Excel éparpillés</h3>
            <p style={{ fontSize: "10.5pt", color: "#475569", margin: 0 }}>
              Plusieurs fichiers par agence, versions qui divergent, aucune historique fiable. Impossible de retrouver rapidement un contrat ou un paiement.
            </p>
          </div>
          <div className="card">
            <div className="chip">💸</div>
            <h3>Des loyers impayés oubliés</h3>
            <p style={{ fontSize: "10.5pt", color: "#475569", margin: 0 }}>
              Sans système d&apos;alerte, les retards s&apos;accumulent. Résultat : impayés qui s&apos;enveniment et trésorerie qui souffre.
            </p>
          </div>
          <div className="card">
            <div className="chip">📝</div>
            <h3>Des quittances manuscrites</h3>
            <p style={{ fontSize: "10.5pt", color: "#475569", margin: 0 }}>
              Écrire chaque quittance à la main, scanner, envoyer. Un vrai marathon administratif chaque fin de mois.
            </p>
          </div>
          <div className="card">
            <div className="chip">📱</div>
            <h3>Des relances sur WhatsApp</h3>
            <p style={{ fontSize: "10.5pt", color: "#475569", margin: 0 }}>
              Chasser manuellement les locataires en retard, envoyer les mêmes messages encore et encore. Du temps perdu quotidiennement.
            </p>
          </div>
        </div>

        <div className="highlight-box" style={{ marginTop: "8mm" }}>
          <strong>Le résultat ?</strong> Des agences qui passent plus de temps dans l&apos;administratif que dans le développement commercial.
        </div>

        <div className="footer-brand">
          <span>Jappalé Immo · Plaquette commerciale</span>
          <span>2 / 6</span>
        </div>
      </section>

      {/* ========== PAGE 3 — LA SOLUTION ========== */}
      <section className="page-a4">
        <div className="tag bg-brand-soft brand-primary" style={{ alignSelf: "flex-start", marginBottom: "8mm" }}>
          La solution
        </div>
        <h2 className="section">
          Jappalé Immo centralise<br />toute votre gestion.
        </h2>
        <p className="lede" style={{ maxWidth: "170mm", marginBottom: "10mm" }}>
          Une seule plateforme, accessible depuis votre téléphone ou votre ordinateur, pour piloter votre activité de A à Z.
        </p>

        <div className="grid-3" style={{ marginBottom: "6mm" }}>
          <div className="card">
            <div className="chip">🏢</div>
            <h3 style={{ fontSize: "12pt" }}>Gestion des biens</h3>
            <p style={{ fontSize: "9.5pt", color: "#475569", margin: 0 }}>Appartements, maisons, terrains. Photos, adresse, loyer — tout au même endroit.</p>
          </div>
          <div className="card">
            <div className="chip">👥</div>
            <h3 style={{ fontSize: "12pt" }}>Suivi locataires</h3>
            <p style={{ fontSize: "9.5pt", color: "#475569", margin: 0 }}>Dossier complet : CNI, contrat, coordonnées, historique de paiements.</p>
          </div>
          <div className="card">
            <div className="chip">📄</div>
            <h3 style={{ fontSize: "12pt" }}>Baux &amp; contrats</h3>
            <p style={{ fontSize: "9.5pt", color: "#475569", margin: 0 }}>Création de baux en 2 minutes. Renouvellement, résiliation, historique.</p>
          </div>
          <div className="card">
            <div className="chip">💰</div>
            <h3 style={{ fontSize: "12pt" }}>Paiements</h3>
            <p style={{ fontSize: "9.5pt", color: "#475569", margin: 0 }}>Génération automatique mensuelle. Paiements partiels, en retard, à jour.</p>
          </div>
          <div className="card">
            <div className="chip">🧾</div>
            <h3 style={{ fontSize: "12pt" }}>Quittances PDF</h3>
            <p style={{ fontSize: "9.5pt", color: "#475569", margin: 0 }}>Quittance officielle en 1 clic. Envoi par email, téléchargement PDF.</p>
          </div>
          <div className="card">
            <div className="chip">🔔</div>
            <h3 style={{ fontSize: "12pt" }}>Rappels auto</h3>
            <p style={{ fontSize: "9.5pt", color: "#475569", margin: 0 }}>Relances automatiques des locataires en retard. L&apos;app s&apos;en occupe.</p>
          </div>
          <div className="card">
            <div className="chip">📈</div>
            <h3 style={{ fontSize: "12pt" }}>Tableau de bord</h3>
            <p style={{ fontSize: "9.5pt", color: "#475569", margin: 0 }}>Vision claire du chiffre d&apos;affaires, des impayés, de l&apos;occupation.</p>
          </div>
          <div className="card">
            <div className="chip">🔐</div>
            <h3 style={{ fontSize: "12pt" }}>Portail locataire</h3>
            <p style={{ fontSize: "9.5pt", color: "#475569", margin: 0 }}>Chaque locataire accède à son espace : paiements, quittances, contrat.</p>
          </div>
          <div className="card">
            <div className="chip">👨‍👩‍👧</div>
            <h3 style={{ fontSize: "12pt" }}>Multi-utilisateurs</h3>
            <p style={{ fontSize: "9.5pt", color: "#475569", margin: 0 }}>Vos collaborateurs accèdent à leur compte avec des rôles précis.</p>
          </div>
        </div>

        <div className="grid-3">
          <div className="stat"><div className="n">15 min</div><div className="l">Mise en route complète</div></div>
          <div className="stat"><div className="n">100%</div><div className="l">Accessible mobile</div></div>
          <div className="stat"><div className="n">0 FCFA</div><div className="l">Pour commencer</div></div>
        </div>

        <div className="footer-brand">
          <span>Jappalé Immo · Plaquette commerciale</span>
          <span>3 / 6</span>
        </div>
      </section>

      {/* ========== PAGE 4 — EN ACTION (SCREENSHOTS) ========== */}
      <section className="page-a4">
        <div className="tag bg-brand-soft brand-primary" style={{ alignSelf: "flex-start", marginBottom: "8mm" }}>
          En action
        </div>
        <h2 className="section">
          Une interface pensée<br />pour les agences du Sénégal.
        </h2>
        <p className="lede" style={{ maxWidth: "170mm", marginBottom: "8mm" }}>
          Simple, rapide, en français. Prise en main en quelques minutes, même sans expérience en outils digitaux.
        </p>

        <div className="grid-2" style={{ flex: 1, gap: "8mm" }}>
          <div>
            <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden", background: "#f8fafc", height: "105mm", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <Image src="/docs/demarrage/05-dashboard.png" alt="Tableau de bord" fill style={{ objectFit: "cover", objectPosition: "top" }} unoptimized />
            </div>
            <h3 style={{ marginTop: "3mm" }}>Tableau de bord</h3>
            <p style={{ fontSize: "10pt", color: "#475569", margin: 0 }}>
              Vue d&apos;ensemble de votre patrimoine, des paiements du mois et des retards.
            </p>
          </div>
          <div>
            <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden", background: "#f8fafc", height: "105mm", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <Image src="/docs/locataires/02-tenants-list.png" alt="Liste locataires" fill style={{ objectFit: "cover", objectPosition: "top" }} unoptimized />
            </div>
            <h3 style={{ marginTop: "3mm" }}>Liste des locataires</h3>
            <p style={{ fontSize: "10pt", color: "#475569", margin: 0 }}>
              Tous vos locataires, avec statut, bail et coordonnées à portée de clic.
            </p>
          </div>
          <div>
            <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden", background: "#f8fafc", height: "105mm", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <Image src="/docs/paiements/01-payments-page.png" alt="Paiements" fill style={{ objectFit: "cover", objectPosition: "top" }} unoptimized />
            </div>
            <h3 style={{ marginTop: "3mm" }}>Suivi des paiements</h3>
            <p style={{ fontSize: "10pt", color: "#475569", margin: 0 }}>
              En attente, à jour, en retard, partiel. Filtre et marquage en 1 clic.
            </p>
          </div>
          <div>
            <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden", background: "#f8fafc", height: "105mm", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <Image src="/docs/locataire/02-home.png" alt="Espace locataire" fill style={{ objectFit: "cover", objectPosition: "top" }} unoptimized />
            </div>
            <h3 style={{ marginTop: "3mm" }}>Portail locataire</h3>
            <p style={{ fontSize: "10pt", color: "#475569", margin: 0 }}>
              Vos locataires consultent leur situation, paient et récupèrent leurs quittances.
            </p>
          </div>
        </div>

        <div className="footer-brand">
          <span>Jappalé Immo · Plaquette commerciale</span>
          <span>4 / 6</span>
        </div>
      </section>

      {/* ========== PAGE 5 — TARIFS ========== */}
      <section className="page-a4">
        <div className="tag bg-brand-soft brand-primary" style={{ alignSelf: "flex-start", marginBottom: "8mm" }}>
          Tarifs
        </div>
        <h2 className="section">
          Un prix simple,<br />adapté à chaque agence.
        </h2>
        <p className="lede" style={{ maxWidth: "170mm", marginBottom: "10mm" }}>
          Commencez gratuitement. Passez à une formule payante quand vous êtes prêt. Sans engagement, résiliable à tout moment.
        </p>

        <div className="grid-2" style={{ gap: "6mm", marginBottom: "6mm" }}>
          <div className="card">
            <h3 style={{ fontSize: "13pt" }}>Gratuit</h3>
            <div className="price" style={{ margin: "3mm 0" }}>0 <small>FCFA/mois</small></div>
            <ul className="features">
              <li>1 bien</li>
              <li>1 utilisateur</li>
              <li>Quittances PDF</li>
              <li>Mini-site public</li>
            </ul>
          </div>
          <div className="card">
            <h3 style={{ fontSize: "13pt" }}>Pro</h3>
            <div className="price" style={{ margin: "3mm 0" }}>5 000 <small>FCFA/mois</small></div>
            <ul className="features">
              <li>3 biens · 3 utilisateurs</li>
              <li>Toutes fonctionnalités</li>
              <li>Mini-site public</li>
              <li>Support email</li>
            </ul>
          </div>
          <div className="card card-brand" style={{ background: "rgba(55,65,211,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "13pt" }}>Agence</h3>
              <span className="tag bg-brand" style={{ fontSize: "8pt" }}>★ Populaire</span>
            </div>
            <div className="price" style={{ margin: "3mm 0" }}>10 000 <small>FCFA/mois</small></div>
            <ul className="features">
              <li>15 biens · 10 utilisateurs</li>
              <li>Toutes fonctionnalités Pro</li>
              <li>Rôles &amp; permissions</li>
              <li>Support prioritaire</li>
            </ul>
          </div>
          <div className="card">
            <h3 style={{ fontSize: "13pt" }}>Entreprise</h3>
            <div className="price" style={{ margin: "3mm 0" }}>20 000 <small>FCFA/mois</small></div>
            <ul className="features">
              <li>Biens illimités</li>
              <li>Utilisateurs illimités</li>
              <li>Support dédié</li>
              <li>Accompagnement sur-mesure</li>
            </ul>
          </div>
        </div>

        <div className="highlight-box">
          <strong>Offre de lancement :</strong> 1 mois d&apos;essai gratuit sur tous les plans payants. Aucune carte bancaire requise. Paiement par Wave ou Orange Money.
        </div>

        <div className="footer-brand">
          <span>Jappalé Immo · Plaquette commerciale</span>
          <span>5 / 6</span>
        </div>
      </section>

      {/* ========== PAGE 6 — CONTACT / CTA ========== */}
      <section className="page-a4" style={{ background: "#0f172a", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22pt", fontWeight: 800 }}>J</div>
          <div style={{ fontSize: "16pt", fontWeight: 700 }}>Jappalé Immo</div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div className="tag" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", marginBottom: "8mm", alignSelf: "flex-start" }}>
            Démarrer
          </div>
          <h2 className="section" style={{ fontSize: "32pt", color: "#fff" }}>
            Prêt à simplifier<br />votre quotidien ?
          </h2>
          <p style={{ fontSize: "13pt", opacity: 0.85, maxWidth: "160mm", marginBottom: "10mm" }}>
            Rejoignez les agences et propriétaires qui ont choisi Jappalé Immo pour gérer leurs biens sereinement.
          </p>

          <div className="grid-3" style={{ marginBottom: "10mm" }}>
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "5mm" }}>
              <div style={{ fontSize: "20pt", fontWeight: 800, color: "#5b67f0" }}>1</div>
              <h3 style={{ color: "#fff", fontSize: "11pt", marginTop: "2mm" }}>Créez votre compte</h3>
              <p style={{ fontSize: "9pt", opacity: 0.7, margin: 0 }}>jappaleimmo.com/register — gratuit, 2 minutes.</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "5mm" }}>
              <div style={{ fontSize: "20pt", fontWeight: 800, color: "#5b67f0" }}>2</div>
              <h3 style={{ color: "#fff", fontSize: "11pt", marginTop: "2mm" }}>Ajoutez vos biens</h3>
              <p style={{ fontSize: "9pt", opacity: 0.7, margin: 0 }}>Saisie manuelle ou import. Photos, adresses, loyers.</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "5mm" }}>
              <div style={{ fontSize: "20pt", fontWeight: 800, color: "#5b67f0" }}>3</div>
              <h3 style={{ color: "#fff", fontSize: "11pt", marginTop: "2mm" }}>Invitez vos locataires</h3>
              <p style={{ fontSize: "9pt", opacity: 0.7, margin: 0 }}>Ils accèdent à leur espace personnel. Vous êtes opérationnel !</p>
            </div>
          </div>

          <div className="grid-2" style={{ marginBottom: "6mm" }}>
            <div>
              <h3 style={{ color: "#fff", fontSize: "11pt" }}>Nous contacter</h3>
              <div style={{ fontSize: "10.5pt", lineHeight: 1.8, opacity: 0.85 }}>
                <div>📧 contact@jappaleimmo.com</div>
                <div>💬 WhatsApp : +33 7 45 86 26 02</div>
                <div>🌐 jappaleimmo.com</div>
              </div>
            </div>
            <div>
              <h3 style={{ color: "#fff", fontSize: "11pt" }}>Démo gratuite</h3>
              <p style={{ fontSize: "10.5pt", opacity: 0.85, margin: 0 }}>
                Prenez 15 minutes avec nous : on vous montre l&apos;app en direct et on répond à toutes vos questions.
              </p>
            </div>
          </div>

          <div style={{ background: "#3741d3", borderRadius: 12, padding: "8mm", textAlign: "center", marginTop: "4mm" }}>
            <div style={{ fontSize: "18pt", fontWeight: 800, marginBottom: "3mm" }}>
              Essayez gratuitement pendant 1 mois
            </div>
            <div style={{ fontSize: "11pt", opacity: 0.9 }}>
              Rendez-vous sur <strong>jappaleimmo.com</strong> — aucune carte bancaire requise.
            </div>
          </div>
        </div>

        <div style={{ fontSize: "9pt", opacity: 0.5, textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "4mm" }}>
          © 2026 Jappalé Immo · Plateforme de gestion immobilière pour le Sénégal &amp; l&apos;Afrique de l&apos;Ouest
        </div>
      </section>
    </>
  );
}
