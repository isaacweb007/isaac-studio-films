// Render each deck to a 1920x1080 PDF only after every font and image has finished loading.
// usage: node tools/build-pdf.js ko en vi   (static server must be running on :8787)
const puppeteer = require('puppeteer-core');
const path = require('path');
const BASE = process.env.BASE || 'http://127.0.0.1:8787';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const langs = process.argv.slice(2).length ? process.argv.slice(2) : ['ko'];

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--disable-gpu'] });
  for (const lang of langs) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
    const file = lang === 'ko' ? 'index.html' : `${lang}.html`;
    await page.goto(`${BASE}/${file}?print=1`, { waitUntil: 'networkidle0', timeout: 120000 });
    await page.evaluate(async () => {
      await document.fonts.ready;
      const imgs = [...document.images];
      await Promise.all(imgs.map(i => i.complete && i.naturalWidth > 0 ? i.decode().catch(() => {}) :
        new Promise(r => { i.onload = () => i.decode().catch(() => {}).finally(r); i.onerror = r; })));
    });
    await new Promise(r => setTimeout(r, 800));
    const out = path.resolve(__dirname, '..', 'pdf', `isaac-studio-slate-${lang}.pdf`);
    await page.pdf({ path: out, width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    const missing = await page.evaluate(() => [...document.images].filter(i => !(i.complete && i.naturalWidth > 0)).length);
    console.log(`${path.basename(out)}  images missing: ${missing}`);
    await page.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
