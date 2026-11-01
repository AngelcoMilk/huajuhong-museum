// 前台冒烟：逐页打开、收集控制台报错、确认水合后的内容真的出现了。
// 用法：node scripts/smoke-public.mjs [baseUrl] [outDir]
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.argv[2] ?? "http://127.0.0.1:5173";
const OUT = process.argv[3] ?? "/tmp/public-shots";

const PAGES = [
  ["home", "/", null],
  ["park", "/park", "基础情况"],
  ["museum", "/museum", null],
  ["products", "/products", "化橘红"],
  ["product-detail", "/products/CP-007", "七爪"],
  ["enterprises", "/enterprises", null],
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
let failures = 0;

for (const [name, path, expectText] of PAGES) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text().slice(0, 160)));
  page.on("pageerror", (err) => errors.push(String(err).slice(0, 160)));

  await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(1200);
  const text = await page.locator("body").innerText();
  const found = expectText ? text.includes(expectText) : text.length > 200;
  if (!found) failures += 1;
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
  console.log(`[public] ${name} ${path} textOk=${found} errors=${errors.length}`, errors.slice(0, 2));
  await context.close();
}

await browser.close();
console.log("PUBLIC_FAILURES", failures);
process.exitCode = failures > 0 ? 1 : 0;
