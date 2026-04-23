// Génère les PDFs de la documentation utilisateur.
// Usage: node scripts/pdfs.mjs
// Prérequis: app en prod sur DEMO_BASE_URL

import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const envPath = path.join(ROOT, ".env.local.screenshots");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const [key, ...rest] = trimmed.split("=");
    process.env[key] = rest.join("=");
  });
}

const BASE = process.env.DEMO_BASE_URL || "https://www.jappaleimmo.com";
const OUT = path.join(ROOT, "public", "docs", "pdfs");

const sections = [
  { slug: "",                 title: "Introduction",              filename: "00-introduction.pdf" },
  { slug: "demarrage",        title: "Premiers pas",              filename: "01-demarrage.pdf" },
  { slug: "biens",            title: "Biens immobiliers",         filename: "02-biens.pdf" },
  { slug: "locataires",       title: "Locataires",                filename: "03-locataires.pdf" },
  { slug: "baux",             title: "Baux et contrats",          filename: "04-baux.pdf" },
  { slug: "paiements",        title: "Paiements",                 filename: "05-paiements.pdf" },
  { slug: "signalements",     title: "Signalements",              filename: "06-signalements.pdf" },
  { slug: "documents",        title: "Quittances et documents",   filename: "07-documents.pdf" },
  { slug: "parametres",       title: "Paramètres",                filename: "08-parametres.pdf" },
  { slug: "abonnement",       title: "Abonnement",                filename: "09-abonnement.pdf" },
  { slug: "espace-locataire", title: "Espace locataire",          filename: "10-espace-locataire.pdf" },
];

async function main() {
  console.log(`\n📄 Génération des PDFs depuis ${BASE}/aide\n`);
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    locale: "fr-FR",
  });
  const page = await context.newPage();

  // Cacher la sidebar et le header en print
  await page.emulateMedia({ media: "print" });

  try {
    for (const section of sections) {
      const url = `${BASE}/aide${section.slug ? "/" + section.slug : ""}`;
      console.log(`  🌐 ${url}`);
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2000);

      const outPath = path.join(OUT, section.filename);
      await page.pdf({
        path: outPath,
        format: "A4",
        margin: { top: "20mm", right: "15mm", bottom: "20mm", left: "15mm" },
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: `
          <div style="font-size: 9px; color: #666; width: 100%; padding: 0 15mm; display: flex; justify-content: space-between;">
            <span>Jappalé Immo · ${section.title}</span>
          </div>`,
        footerTemplate: `
          <div style="font-size: 9px; color: #666; width: 100%; padding: 0 15mm; display: flex; justify-content: space-between;">
            <span>jappaleimmo.com</span>
            <span>Page <span class="pageNumber"></span> / <span class="totalPages"></span></span>
          </div>`,
      });
      console.log(`  📄 ${section.filename}`);
    }

    await browser.close();

    // Concaténer tous les PDFs en un guide complet
    console.log(`\n  📚 Concaténation du guide complet...`);
    const { PDFDocument } = await import("pdf-lib");
    const merged = await PDFDocument.create();
    for (const section of sections) {
      const src = path.join(OUT, section.filename);
      const bytes = fs.readFileSync(src);
      const doc = await PDFDocument.load(bytes);
      const pages = await merged.copyPages(doc, doc.getPageIndices());
      pages.forEach((p) => merged.addPage(p));
    }
    const mergedBytes = await merged.save();
    fs.writeFileSync(path.join(OUT, "guide-complet.pdf"), mergedBytes);
    console.log(`  ✅ guide-complet.pdf (${merged.getPageCount()} pages)`);

    console.log(`\n✅ PDFs générés dans public/docs/pdfs/\n`);
  } catch (err) {
    console.error("❌ Erreur:", err.message);
    await browser.close();
    process.exit(1);
  }
}

main();
