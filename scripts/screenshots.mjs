// Automated screenshot capture for Jappalé Immo documentation.
// Usage: node scripts/screenshots.mjs
// Reads credentials from .env.local.screenshots (not committed).

import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

// Load env from .env.local.screenshots
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
const EMAIL = process.env.DEMO_ADMIN_EMAIL;
const PASSWORD = process.env.DEMO_ADMIN_PASSWORD;

if (!EMAIL || !PASSWORD) {
  console.error("❌ DEMO_ADMIN_EMAIL and DEMO_ADMIN_PASSWORD required");
  process.exit(1);
}

const OUT = path.join(ROOT, "public", "docs");

async function waitForLoaded(page) {
  // Attendre la disparition du "Chargement..."
  try {
    await page.waitForFunction(
      () => !document.body.innerText.match(/^Chargement\.\.\.?$/m),
      { timeout: 15000 }
    );
  } catch {
    // fallback: juste un délai
  }
  await page.waitForTimeout(1200);
}

async function shoot(page, filename, opts = {}) {
  const full = path.join(OUT, filename);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  await waitForLoaded(page);
  if (opts.wait) await page.waitForTimeout(opts.wait);
  await page.screenshot({
    path: full,
    fullPage: opts.full !== false,
  });
  console.log(`  📸 ${filename}`);
}

async function login(page) {
  console.log(`🔑 Connexion à ${BASE}...`);
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASSWORD);
  await page.screenshot({ path: "/tmp/login-before.png" });

  // Submit + attendre la redirection côté client
  const btn = page.getByRole("button", { name: /connexion|se connecter|login/i });
  await btn.click();

  // Attendre explicitement qu'on quitte /login (redirection soft Next.js)
  await page.waitForFunction(() => !location.pathname.startsWith("/login"), {
    timeout: 20000,
  }).catch(async (e) => {
    await page.screenshot({ path: "/tmp/login-after-fail.png", fullPage: true });
    const err = await page.locator("text=/incorrect|erreur/i").first().textContent().catch(() => null);
    console.error(`  ⚠️  URL actuelle: ${page.url()}`);
    console.error(`  ⚠️  Erreur page: ${err ?? "(aucune)"}`);
    throw e;
  });

  console.log(`  ✅ Connecté (${page.url()})`);
}

async function main() {
  console.log(`\n🚀 Jappalé Immo — génération des captures\n`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
    locale: "fr-FR",
  });
  const page = await context.newPage();

  try {
    await login(page);

    // ═══════════════════════════════════════════════════════
    // DASHBOARD & PARAMÈTRES
    // ═══════════════════════════════════════════════════════
    console.log("\n📂 Tableau de bord & paramètres");
    await page.goto(`${BASE}/dashboard`, { waitUntil: "domcontentloaded" });
    await shoot(page, "demarrage/05-dashboard.png");

    await page.goto(`${BASE}/dashboard/settings`, { waitUntil: "domcontentloaded" });
    await shoot(page, "demarrage/02-profile.png");
    await shoot(page, "parametres/01-profile.png");
    await shoot(page, "parametres/02-organization.png");

    await page.goto(`${BASE}/dashboard/team`, { waitUntil: "domcontentloaded" });
    await shoot(page, "parametres/03-team.png");

    // ═══════════════════════════════════════════════════════
    // BIENS
    // ═══════════════════════════════════════════════════════
    console.log("\n🏠 Biens immobiliers");
    await page.goto(`${BASE}/dashboard/properties`, { waitUntil: "domcontentloaded" });
    await shoot(page, "biens/00-properties-list.png");

    await page.goto(`${BASE}/dashboard/properties/new`, { waitUntil: "domcontentloaded" });
    await shoot(page, "demarrage/03-new-property.png");
    await shoot(page, "biens/01-new-residence.png");
    await shoot(page, "biens/02-new-apartment.png");

    // Essaie d'accéder au détail du premier bien
    await page.goto(`${BASE}/dashboard/properties`, { waitUntil: "domcontentloaded" });
    await waitForLoaded(page);
    const propHrefs = await page.$$eval(
      'a[href^="/dashboard/properties/"]',
      (links) => links.map((l) => l.getAttribute("href")).filter((h) => h && !h.includes("/new") && h !== "/dashboard/properties")
    );
    if (propHrefs.length > 0) {
      await page.goto(`${BASE}${propHrefs[0]}`, { waitUntil: "domcontentloaded" });
      await shoot(page, "biens/03-property-detail.png");
    }

    // ═══════════════════════════════════════════════════════
    // LOCATAIRES
    // ═══════════════════════════════════════════════════════
    console.log("\n👥 Locataires");
    await page.goto(`${BASE}/dashboard/tenants`, { waitUntil: "domcontentloaded" });
    await shoot(page, "locataires/02-tenants-list.png");

    await page.goto(`${BASE}/dashboard/tenants/new`, { waitUntil: "domcontentloaded" });
    await shoot(page, "demarrage/04-new-tenant.png");
    await shoot(page, "locataires/01-new-tenant.png");

    await page.goto(`${BASE}/dashboard/tenants`, { waitUntil: "domcontentloaded" });
    await waitForLoaded(page);
    const tenantHrefs = await page.$$eval(
      'a[href^="/dashboard/tenants/"]',
      (links) => links.map((l) => l.getAttribute("href")).filter((h) => h && !h.includes("/new") && h !== "/dashboard/tenants")
    );
    if (tenantHrefs.length > 0) {
      await page.goto(`${BASE}${tenantHrefs[0]}`, { waitUntil: "domcontentloaded" });
      await shoot(page, "locataires/03-tenant-detail.png");
      await shoot(page, "locataires/04-invite-button.png");
    }

    // ═══════════════════════════════════════════════════════
    // BAUX
    // ═══════════════════════════════════════════════════════
    console.log("\n📄 Baux");
    await page.goto(`${BASE}/dashboard/leases`, { waitUntil: "domcontentloaded" });
    await shoot(page, "baux/02-leases-list.png");

    await page.goto(`${BASE}/dashboard/leases/new`, { waitUntil: "domcontentloaded" });
    await shoot(page, "baux/01-new-lease.png");

    // ═══════════════════════════════════════════════════════
    // PAIEMENTS
    // ═══════════════════════════════════════════════════════
    console.log("\n💰 Paiements");
    await page.goto(`${BASE}/dashboard/payments`, { waitUntil: "domcontentloaded" });
    await shoot(page, "paiements/01-payments-page.png");
    await shoot(page, "paiements/02-mark-paid.png");
    await shoot(page, "paiements/03-partial-payment.png");
    await shoot(page, "paiements/04-reminder.png");
    await shoot(page, "documents/02-download-button.png");

    // ═══════════════════════════════════════════════════════
    // SIGNALEMENTS
    // ═══════════════════════════════════════════════════════
    console.log("\n🔧 Signalements");
    await page.goto(`${BASE}/dashboard/signalements`, { waitUntil: "domcontentloaded" });
    await shoot(page, "signalements/02-issues-list.png");

    const issueHrefs = await page.$$eval(
      'a[href^="/dashboard/signalements/"]',
      (links) => links.map((l) => l.getAttribute("href")).filter((h) => h && h !== "/dashboard/signalements")
    );
    if (issueHrefs.length > 0) {
      await page.goto(`${BASE}${issueHrefs[0]}`, { waitUntil: "domcontentloaded" });
      await shoot(page, "signalements/03-issue-detail.png");
    }

    // ═══════════════════════════════════════════════════════
    // ABONNEMENT
    // ═══════════════════════════════════════════════════════
    console.log("\n💳 Abonnement");
    await page.goto(`${BASE}/dashboard/upgrade`, { waitUntil: "domcontentloaded" });
    await shoot(page, "abonnement/01-plans.png");
    await shoot(page, "abonnement/02-payment-form.png");

    // ═══════════════════════════════════════════════════════
    // ESPACE LOCATAIRE (le compte admin est aussi un locataire)
    // ═══════════════════════════════════════════════════════
    console.log("\n🏠 Espace locataire");
    await page.goto(`${BASE}/locataire`, { waitUntil: "domcontentloaded" });
    await shoot(page, "locataire/02-home.png");
    await shoot(page, "locataires/05-multi-leases.png");

    await page.goto(`${BASE}/locataire/contrat`, { waitUntil: "domcontentloaded" });
    await shoot(page, "locataire/03-contract.png");

    await page.goto(`${BASE}/locataire/paiements`, { waitUntil: "domcontentloaded" });
    await shoot(page, "locataire/04-payments.png");
    await shoot(page, "documents/03-tenant-docs-page.png");

    await page.goto(`${BASE}/locataire/documents`, { waitUntil: "domcontentloaded" });
    await shoot(page, "locataire/05-documents.png");

    await page.goto(`${BASE}/locataire/signaler`, { waitUntil: "domcontentloaded" });
    await shoot(page, "locataire/06-signaler.png");
    await shoot(page, "signalements/01-tenant-form.png");

    await page.goto(`${BASE}/locataire/profil`, { waitUntil: "domcontentloaded" });
    await shoot(page, "locataire/07-profile.png");

    // ═══════════════════════════════════════════════════════
    // PAGE D'INSCRIPTION (déconnexion pour y accéder)
    // ═══════════════════════════════════════════════════════
    console.log("\n📝 Page d'inscription");
    // Se déconnecter d'abord
    await page.context().clearCookies();
    await page.goto(`${BASE}/register`, { waitUntil: "domcontentloaded" });
    await shoot(page, "demarrage/01-register.png");

    await browser.close();
    console.log(`\n✅ Toutes les captures admin générées dans public/docs/\n`);
  } catch (err) {
    console.error("❌ Erreur:", err.message);
    await page.screenshot({ path: "error.png" }).catch(() => {});
    await browser.close();
    process.exit(1);
  }
}

main();
