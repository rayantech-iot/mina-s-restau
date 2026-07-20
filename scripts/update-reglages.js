const https = require('https');

const SRK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6bW5vYnJzemxpZnJkdXBkdHNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDM5NjYwMSwiZXhwIjoyMDk5OTcyNjAxfQ.l6SNSWayZF0eaSfO9jw7nlL5Z5_z5NXAQvrSk8r9SUI';
const BASE = 'pzmnobrszlifrdupdtsp.supabase.co';

function patchReglages(body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: BASE,
      path: '/rest/v1/reglages?id=eq.00000000-0000-0000-0000-000000000001',
      method: 'PATCH',
      headers: {
        'apikey': SRK,
        'Authorization': `Bearer ${SRK}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        'Content-Length': Buffer.byteLength(data),
      },
    }, (res) => {
      let chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Body:', Buffer.concat(chunks).toString());
        resolve();
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  // Update phone, whatsapp, adresse
  await patchReglages({
    telephone: '06 76 77 22 75',
    whatsapp: '33676772275',
    adresse: 'Route de Cirendino, 20144 Sainte-Lucie de Porto-Vecchio',
    google_maps_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3666.5!2d9.25!3d41.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDM2JzAwLjAiTiA5wrAxNScwMC4wIkU!5e0!3m2!1sfr!2sfr!4v1!5m2!1sfr!2sfr',
  });
  console.log('Reglages updated!');
}

main().catch(console.error);
