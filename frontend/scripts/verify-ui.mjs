#!/usr/bin/env node
/**
 * Agent verification script: run after code changes to verify the UI.
 * - Fetches the homepage
 * - Takes a screenshot
 * - Checks for console errors
 * - Exits 0 on success, 1 on failure
 */
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.env.VERIFY_URL || "http://localhost:3000";
const SCREENSHOT_DIR = join(__dirname, "..", ".verification");

async function main() {
  let browser;
  const errors = [];

  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Capture console errors
    page.on("console", (msg) => {
      const type = msg.type();
      if (type === "error") {
        errors.push(msg.text());
      }
    });

    const response = await page.goto(BASE_URL, {
      waitUntil: "domcontentloaded",
      timeout: 20000,
    });

    if (!response || response.status() !== 200) {
      console.error("❌ Page failed to load:", response?.status() ?? "no response");
      process.exit(1);
    }

    // Wait for main content and allow 3D/hydration to settle
    await page.waitForSelector("#main-content, #hero", { timeout: 8000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 2000));

    // Take screenshot
    mkdirSync(SCREENSHOT_DIR, { recursive: true });
    const screenshotPath = join(SCREENSHOT_DIR, "homepage.png");
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log("📸 Screenshot saved:", screenshotPath);

    // Basic content checks
    const heroText = await page.textContent("body");
    const checks = [
      ["Founder Radar", heroText?.includes("Founder Radar")],
      ["Hero headline", heroText?.includes("Find breakout startups")],
      ["Request Access CTA", heroText?.includes("Request Access")],
    ];

    let failed = false;
    for (const [name, ok] of checks) {
      if (ok) {
        console.log("✓", name);
      } else {
        console.error("✗", name);
        failed = true;
      }
    }

    if (errors.length > 0) {
      console.warn("⚠ Console errors:", errors.length);
      errors.slice(0, 3).forEach((e) => console.warn("  -", e));
    }

    if (failed) {
      process.exit(1);
    }

    console.log("✅ Verification passed");
  } catch (err) {
    console.error("❌ Verification failed:", err.message);
    process.exit(1);
  } finally {
    await browser?.close();
  }
}

main();
