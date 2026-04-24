// Génère la plaquette commerciale PDF.
// Usage: node scripts/brochure.mjs

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
const OUT = path.join(ROOT, "public", "plaquette-jappaleimmo.pdf");

async function main() {
  console.log(`\n📘 Génération de la plaquette depuis ${BASE}/plaquette\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    locale: "fr-FR",
  });
  const page = await context.newPage();
  await page.emulateMedia({ media: "print" });

  try {
    await page.goto(`${BASE}/plaquette`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2500);

    await page.pdf({
      path: OUT,
      format: "A4",
      margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
      printBackground: true,
      preferCSSPageSize: true,
    });

    const stats = fs.statSync(OUT);
    const sizeKb = Math.round(stats.size / 1024);
    console.log(`  ✅ plaquette-jappaleimmo.pdf généré (${sizeKb} Ko)`);
    console.log(`\n   → public/plaquette-jappaleimmo.pdf`);
    console.log(`   → Accessible à https://www.jappaleimmo.com/plaquette-jappaleimmo.pdf\n`);

    await browser.close();
  } catch (err) {
    console.error("❌ Erreur:", err.message);
    await browser.close();
    process.exit(1);
  }
}

main();
