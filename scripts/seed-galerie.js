const https = require('https');
const fs = require('fs');
const path = require('path');

const SRK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6bW5vYnJzemxpZnJkdXBkdHNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDM5NjYwMSwiZXhwIjoyMDk5OTcyNjAxfQ.l6SNSWayZF0eaSfO9jw7nlL5Z5_z5NXAQvrSk8r9SUI';
const BASE = 'pzmnobrszlifrdupdtsp.supabase.co';

function api(method, pathStr, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: BASE,
      path: pathStr,
      method,
      headers: {
        'apikey': SRK,
        'Authorization': `Bearer ${SRK}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
    };
    if (data) opts.headers['Content-Length'] = Buffer.byteLength(data);
    const req = https.request(opts, (res) => {
      let chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString() }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  // 1. Get all plat image_urls already in galerie
  const platRes = await api('GET', '/rest/v1/plats?select=image_url');
  const plats = JSON.parse(platRes.body);
  const platUrls = new Set(plats.map(p => p.image_url).filter(Boolean));

  // 2. Get all existing galerie_images urls
  const galerieRes = await api('GET', '/rest/v1/galerie_images?select=url');
  const galerie = JSON.parse(galerieRes.body);
  const galerieUrls = new Set(galerie.map(g => g.url));

  // 3. Get all image files from public/images/plats
  const platsDir = path.join(__dirname, '..', 'public', 'images', 'plats');
  const files = fs.readdirSync(platsDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
  console.log(`Total images in folder: ${files.length}`);
  console.log(`Already in plat image_url: ${platUrls.size}`);
  console.log(`Already in galerie_images: ${galerieUrls.size}`);

  // 4. Insert ALL images into galerie_images (skip if already there)
  let inserted = 0;
  let skipped = 0;
  let ordre = galerie.length;

  for (const file of files) {
    const url = `/images/plats/${encodeURIComponent(file)}`;
    const alt = file.replace(/\.(png|jpg|jpeg|webp)$/i, '').replace(/[-_]/g, ' ');
    
    if (galerieUrls.has(url)) {
      skipped++;
      continue;
    }

    ordre++;
    const res = await api('POST', '/rest/v1/galerie_images', {
      url,
      alt,
      ordre,
    });

    if (res.status === 201 || res.status === 200) {
      inserted++;
      galerieUrls.add(url);
    } else {
      console.error(`ERROR [${res.status}]: ${file} -> ${res.body.substring(0, 200)}`);
    }

    if (inserted % 20 === 0 && inserted > 0) console.log(`  Inserted ${inserted}...`);
  }

  console.log(`\nDone! Inserted: ${inserted}, Skipped: ${skipped}, Total in galerie: ${inserted + skipped}`);
}

main().catch(console.error);
