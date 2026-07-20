const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://pzmnobrszlifrdupdtsp.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6bW5vYnJzemxpZnJkdXBkdHNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDM5NjYwMSwiZXhwIjoyMDk5OTcyNjAxfQ.l6SNSWayZF0eaSfO9jw7nlL5Z5_z5NXAQvrSk8r9SUI';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const CATEGORIES = {
  'Poulets rotis a la broche': null,
  'Plats du jour': null,
  'Accompagnements': null,
  'Entrees': null,
  'Desserts maison': null,
  'Menus speciaux': null,
};

function encodeUrl(s) {
  return s.replace(/ /g, '%20').replace(/'/g, '%27').replace(/&/g, '%26');
}

function cleanName(filename) {
  return filename.replace(/\.png$/i, '').replace(/\.jpg$/i, '').replace(/\.jpeg$/i, '');
}

function guessCategory(name, filename) {
  const n = name.toLowerCase();
  const f = filename.toLowerCase();
  if (n.includes('dessert') || n.includes('tarte') && !n.includes('tomate') && !n.includes('chèvre') && !n.includes('saumon') || n.includes('flan') || n.includes('fiadone') || n.includes('fraise') || n.includes('abricot') && n.includes('tarte'))
    return 'Desserts maison';
  if (n.includes('poulet') || n.includes('chapon') || n.includes('pilon') || n.includes('cuisse'))
    return 'Poulets rotis a la broche';
  if (n.includes('paella') || n.includes('paëlla'))
    return 'Menus speciaux';
  if (n.includes('salade') || n.includes('verrine') || n.includes('bastel') || n.includes('bruschetta') || n.includes('aubergine') || n.includes('canelloni') || n.includes('polpette'))
    return 'Entrees';
  if (n.includes('pomme de terre') || n.includes('pommes de terre') || n.includes('riz') && !n.includes('saute') || n.includes('wok de legumes') || n.includes('salade de chou') || n.includes('salade de p'))
    return 'Accompagnements';
  if (n.includes('burger'))
    return 'Entrees';
  return 'Plats du jour';
}

const PLATS = [
  'Aïoli - Filet de lingue légumes.png',
  'Aubergine au parmesan.png',
  'Aubergines au parmesan.png',
  'Bastelles brocciu blettes menthe.png',
  'Bruschettas tomates cerises tapenade.png',
  'Burgers maison.png',
  'Canelloni brocciu blettes.png',
  'Chapon au four tomates pommes de terre fondantes SUR COMMANDE.png',
  'Cuisses de poulet galette de pommes de terre.png',
  'fiadone.png',
  'Filets de lingue beurre aux agrumes, Wok de légumes de saison.png',
  'Filets de poulets sauce crème à l\'estragon.png',
  'Flan aux abricots.png',
  'Linguines aux légumes.png',
  'Loup au four, tomates pommes de terre.png',
  'Mini hamburger bœuf oignons confits.png',
  'Nouilles chinoises sautées aux courgettes et au soja.png',
  'Paella (2).png',
  'Paella royale.png',
  'Paëlla royale.png',
  'Paella.png',
  'Pain de veau à l\'estragon.png',
  'Papillotes de cabillaud petits légumes citrons.png',
  'Pilons de poulet façon asiatique.png',
  'Polpette tomates fromage.png',
  'pomme de terre.png',
  'Pommes de terre à la libanaise.png',
  'Pommes de terre grenaille.png',
  'Pommes de terre grenailles ail et ciboulettes.png',
  'Pommes de terre.png',
  'Poulet crapaudine.png',
  'Poulet grillé pommes de terre.png',
  'Poulet thaï curry rouge  riz.png',
  'Poulet Thaï curry rouge.png',
  'Poulets basquaises servis avec du riz.png',
  'Poulets crapaudines.png',
  'Poulets panés aux graines de fenouil.png',
  'Poulets rôtis sauce chimichurri Pommes de terre grenailles ail et ciboulettes.png',
  'Poulets rôtis, galettes de légumes de saison.png',
  'Riz façon risotto au parmesan.png',
  'Riz sauté aux légumes moules et gambas.png',
  'Roti de porc sauce échalote.png',
  'Salade de chou chinois aux légumes.png',
  'Salade de pâtes.png',
  'Salade de poulpes.png',
  'Salade fraicheur (tomates, blé…).png',
  'Salade fraîcheur avec un effiloché de poulets.png',
  'Sanglier rôti et Pommes de terres aux épices façon libanaise.png',
  'Sauté de veau aux olives Plat typique Corse.png',
  'Sauté de veau aux olives.png',
  'Souris d\'agneau confite aux thym et romarin Aubergines farcies à la brousse tomates fraîches Pommes de terre ail et ciboulette.png',
  'Tagliatelles aux légumes olives noires parmesan.png',
  'Tajine de poulet.png',
  'Tarte aux abricots.png',
  'Tarte blettes saumon.png',
  'Tarte chèvre chorizo.png',
  'Tarte tomates cerises.png',
  'Tartes aux fraises.png',
  'Tartes salées.png',
  'Travers de porc laqués au miel et aux épices Gratin dauphinois.png',
  'Travers de porc laqués au miel et aux épices.png',
  'Verrine de poulpe.png',
  'Verrines Crème de parmesan brunoise de courgettes.png',
  'Wok de légumes.png',
];

// Also include numbered plats for the missing ones
const NUMBERED_PLATS = [
  'plat-100.png', 'plat-104.png', 'plat-105.png', 'plat-109.png',
  'plat-110.png', 'plat-112.png', 'plat-13.png', 'plat-16.png',
  'plat-17.png', 'plat-18.png', 'plat-19.png', 'plat-21.png',
  'plat-23.png', 'plat-24.png', 'plat-25.png', 'plat-28.png',
  'plat-29.png', 'plat-30.png', 'plat-31.png', 'plat-32.png',
  'plat-35.png', 'plat-36.png', 'plat-37.png', 'plat-38.png',
  'plat-39.png', 'plat-40.png', 'plat-41.png', 'plat-42.png',
  'plat-51.png', 'plat-52.png', 'plat-54.png', 'plat-58.png',
  'plat-59.png', 'plat-63.png', 'plat-64.png', 'plat-66.png',
  'plat-67.png', 'plat-70.png', 'plat-71.png', 'plat-78.png',
  'plat-79.png', 'plat-80.png', 'plat-84.png', 'plat-85.png',
  'plat-86.png', 'plat-87.png', 'plat-88.png', 'plat-99.png',
];

async function main() {
  // 1. Get category IDs
  console.log('Fetching categories...');
  const { data: cats } = await supabase.from('categories').select('id,nom');
  for (const c of cats) {
    CATEGORIES[c.nom] = c.id;
  }
  console.log('Categories:', Object.entries(CATEGORIES).map(([k,v]) => `${k}: ${v ? v.slice(0,8) : 'NULL'}`).join(', '));

  // 2. Delete test category
  console.log('Deleting test category...');
  await supabase.from('categories').delete().eq('nom', 'Test');

  // 3. Check existing plats
  const { data: existing } = await supabase.from('plats').select('nom');
  const existingNames = new Set((existing || []).map(p => p.nom));
  console.log(`Existing plats: ${existingNames.size}`);

  // 4. Insert named plats
  const allFiles = [...PLATS, ...NUMBERED_PLATS];
  let inserted = 0;
  let skipped = 0;

  for (const file of allFiles) {
    const name = cleanName(file);
    if (existingNames.has(name)) {
      skipped++;
      continue;
    }

    const imageUrl = `/images/plats/${encodeUrl(file)}`;
    const cat = guessCategory(name, file);
    const catId = CATEGORIES[cat] || null;

    const { error } = await supabase.from('plats').insert({
      nom: name,
      image_url: imageUrl,
      categorie_id: catId,
      statut: 'disponible',
      afficher_prix: false,
      mis_en_avant: false,
      ordre: inserted + 1,
    });

    if (error) {
      console.error(`ERROR inserting "${name}": ${error.message}`);
    } else {
      inserted++;
      if (inserted % 10 === 0) console.log(`Inserted ${inserted} plats...`);
    }
  }

  console.log(`\nDone! Inserted: ${inserted}, Skipped: ${skipped}`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
