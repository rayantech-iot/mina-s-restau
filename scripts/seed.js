const fs = require('fs');
const https = require('https');

const SRK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6bW5vYnJzemxpZnJkdXBkdHNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDM5NjYwMSwiZXhwIjoyMDk5OTcyNjAxfQ.l6SNSWayZF0eaSfO9jw7nlL5Z5_z5NXAQvrSk8r9SUI';
const BASE = 'pzmnobrszlifrdupdtsp.supabase.co';

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: BASE,
      path,
      method,
      headers: {
        'apikey': SRK,
        'Authorization': `Bearer ${SRK}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
    };
    const req = https.request(opts, (res) => {
      let chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const txt = Buffer.concat(chunks).toString();
        resolve({ status: res.statusCode, body: txt });
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  // 1. Fetch categories
  const catRes = await request('GET', '/rest/v1/categories?select=id,nom');
  const cats = JSON.parse(catRes.body);
  const catMap = {};
  for (const c of cats) catMap[c.nom] = c.id;
  console.log('Categories:', Object.keys(catMap).join(', '));

  // 2. Delete Test
  await request('DELETE', '/rest/v1/categories?nom=eq.Test');
  console.log('Deleted Test category');

  // 3. Fetch existing plats
  const platRes = await request('GET', '/rest/v1/plats?select=nom');
  const existing = JSON.parse(platRes.body);
  const existingNames = new Set(existing.map(p => p.nom));
  console.log(`Existing plats: ${existingNames.size}`);

  // 4. Insert plats
  const plats = JSON.parse(fs.readFileSync(__dirname + '/seed-data.json', 'utf8'));
  let inserted = 0, skipped = 0, errors = 0;

  for (const p of plats) {
    if (existingNames.has(p.nom)) { skipped++; continue; }
    
    const catId = catMap[p.cat] || null;
    const res = await request('POST', '/rest/v1/plats', {
      nom: p.nom,
      image_url: p.image_url,
      categorie_id: catId,
      statut: 'disponible',
      afficher_prix: false,
      mis_en_avant: false,
      ordre: inserted + 1,
    });

    if (res.status === 201 || res.status === 200) {
      inserted++;
    } else {
      console.error(`ERROR [${res.status}]: ${p.nom} -> ${res.body.substring(0, 200)}`);
      errors++;
    }
    if (inserted % 10 === 0 && inserted > 0) console.log(`  Inserted ${inserted}...`);
  }

  console.log(`\nDone! Inserted: ${inserted}, Skipped: ${skipped}, Errors: ${errors}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
