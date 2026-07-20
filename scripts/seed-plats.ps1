# Supprimer la catégorie Test
# curl.exe -s -X DELETE "https://pzmnobrszlifrdupdtsp.supabase.co/rest/v1/categories?nom=eq.Test" -H "apikey: $SRK" -H "Authorization: Bearer $SRK" -H "Prefer: return=minimal"

$SRK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6bW5vYnJzemxpZnJkdXBkdHNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDM5NjYwMSwiZXhwIjoyMDk5OTcyNjAxfQ.l6SNSWayZF0eaSfO9jw7nlL5Z5_z5NXAQvrSk8r9SUI"
$BASE = "https://pzmnobrszlifrdupdtsp.supabase.co/rest/v1"

# Get category IDs
Write-Output "Fetching categories..."
$catJson = & curl.exe -s "$BASE/categories?select=id,nom" -H "apikey: $SRK" -H "Authorization: Bearer $SRK"
$catObj = $catJson | ConvertFrom-Json
$catMap = @{}
foreach ($c in $catObj) { $catMap[$c.nom] = $c.id }
Write-Output "Categories: $($catMap.Keys -join ', ')"

# Delete test category
& curl.exe -s -X DELETE "$BASE/categories?nom=eq.Test" -H "apikey: $SRK" -H "Authorization: Bearer $SRK" -H "Prefer: return=minimal" 2>&1 | Out-Null

# Check existing plats
$existingJson = & curl.exe -s "$BASE/plats?select=nom" -H "apikey: $SRK" -H "Authorization: Bearer $SRK"
$existingObj = $existingJson | ConvertFrom-Json -ErrorAction SilentlyContinue
$existingNames = @{}
if ($existingObj) { foreach ($p in $existingObj) { $existingNames[$p.nom] = $true } }
Write-Output "Existing plats: $($existingNames.Count)"

# All image files mapping
$platFiles = @(
    @{ file="Aïoli - Filet de lingue légumes.png"; cat="Plats du jour" },
    @{ file="Aubergine au parmesan.png"; cat="Entrees" },
    @{ file="Aubergines au parmesan.png"; cat="Entrees" },
    @{ file="Bastelles brocciu blettes menthe.png"; cat="Entrees" },
    @{ file="Bruschettas tomates cerises tapenade.png"; cat="Entrees" },
    @{ file="Burgers maison.png"; cat="Entrees" },
    @{ file="Canelloni brocciu blettes.png"; cat="Entrees" },
    @{ file="Chapon au four tomates pommes de terre fondantes SUR COMMANDE.png"; cat="Poulets rotis a la broche" },
    @{ file="Cuisses de poulet galette de pommes de terre.png"; cat="Poulets rotis a la broche" },
    @{ file="fiadone.png"; cat="Desserts maison" },
    @{ file="Filets de lingue beurre aux agrumes, Wok de légumes de saison.png"; cat="Plats du jour" },
    @{ file="Filets de poulets sauce crème à l'estragon.png"; cat="Poulets rotis a la broche" },
    @{ file="Flan aux abricots.png"; cat="Desserts maison" },
    @{ file="Linguines aux légumes.png"; cat="Plats du jour" },
    @{ file="Loup au four, tomates pommes de terre.png"; cat="Plats du jour" },
    @{ file="Mini hamburger bœuf oignons confits.png"; cat="Entrees" },
    @{ file="Nouilles chinoises sautées aux courgettes et au soja.png"; cat="Plats du jour" },
    @{ file="Paella (2).png"; cat="Menus speciaux" },
    @{ file="Paella royale.png"; cat="Menus speciaux" },
    @{ file="Paëlla royale.png"; cat="Menus speciaux" },
    @{ file="Paella.png"; cat="Menus speciaux" },
    @{ file="Pain de veau à l'estragon.png"; cat="Plats du jour" },
    @{ file="Papillotes de cabillaud petits légumes citrons.png"; cat="Plats du jour" },
    @{ file="Pilons de poulet façon asiatique.png"; cat="Poulets rotis a la broche" },
    @{ file="Polpette tomates fromage.png"; cat="Entrees" },
    @{ file="pomme de terre.png"; cat="Accompagnements" },
    @{ file="Pommes de terre à la libanaise.png"; cat="Accompagnements" },
    @{ file="Pommes de terre grenaille.png"; cat="Accompagnements" },
    @{ file="Pommes de terre grenailles ail et ciboulettes.png"; cat="Accompagnements" },
    @{ file="Pommes de terre.png"; cat="Accompagnements" },
    @{ file="Poulet crapaudine.png"; cat="Poulets rotis a la broche" },
    @{ file="Poulet grillé pommes de terre.png"; cat="Poulets rotis a la broche" },
    @{ file="Poulet thaï curry rouge  riz.png"; cat="Poulets rotis a la broche" },
    @{ file="Poulet Thaï curry rouge.png"; cat="Poulets rotis a la broche" },
    @{ file="Poulets basquaises servis avec du riz.png"; cat="Poulets rotis a la broche" },
    @{ file="Poulets crapaudines.png"; cat="Poulets rotis a la broche" },
    @{ file="Poulets panés aux graines de fenouil.png"; cat="Poulets rotis a la broche" },
    @{ file="Poulets rôtis sauce chimichurri Pommes de terre grenailles ail et ciboulettes.png"; cat="Poulets rotis a la broche" },
    @{ file="Poulets rôtis, galettes de légumes de saison.png"; cat="Poulets rotis a la broche" },
    @{ file="Riz façon risotto au parmesan.png"; cat="Accompagnements" },
    @{ file="Riz sauté aux légumes moules et gambas.png"; cat="Plats du jour" },
    @{ file="Roti de porc sauce échalote.png"; cat="Plats du jour" },
    @{ file="Salade de chou chinois aux légumes.png"; cat="Accompagnements" },
    @{ file="Salade de pâtes.png"; cat="Accompagnements" },
    @{ file="Salade de poulpes.png"; cat="Entrees" },
    @{ file="Salade fraicheur (tomates, blé…).png"; cat="Accompagnements" },
    @{ file="Salade fraîcheur avec un effiloché de poulets.png"; cat="Accompagnements" },
    @{ file="Sanglier rôti et Pommes de terres aux épices façon libanaise.png"; cat="Plats du jour" },
    @{ file="Sauté de veau aux olives Plat typique Corse.png"; cat="Plats du jour" },
    @{ file="Sauté de veau aux olives.png"; cat="Plats du jour" },
    @{ file="Souris d'agneau confite aux thym et romarin Aubergines farcies à la brousse tomates fraîches Pommes de terre ail et ciboulette.png"; cat="Plats du jour" },
    @{ file="Tagliatelles aux légumes olives noires parmesan.png"; cat="Plats du jour" },
    @{ file="Tajine de poulet.png"; cat="Poulets rotis a la broche" },
    @{ file="Tarte aux abricots.png"; cat="Desserts maison" },
    @{ file="Tarte blettes saumon.png"; cat="Entrees" },
    @{ file="Tarte chèvre chorizo.png"; cat="Entrees" },
    @{ file="Tarte tomates cerises.png"; cat="Entrees" },
    @{ file="Tartes aux fraises.png"; cat="Desserts maison" },
    @{ file="Tartes salées.png"; cat="Entrees" },
    @{ file="Travers de porc laqués au miel et aux épices Gratin dauphinois.png"; cat="Plats du jour" },
    @{ file="Travers de porc laqués au miel et aux épices.png"; cat="Plats du jour" },
    @{ file="Verrine de poulpe.png"; cat="Entrees" },
    @{ file="Verrines Crème de parmesan brunoise de courgettes.png"; cat="Entrees" },
    @{ file="Wok de légumes.png"; cat="Accompagnements" }
)

$inserted = 0
$skipped = 0

foreach ($p in $platFiles) {
    $name = $p.file -replace '\.png$', '' -replace '\.jpg$', ''
    if ($existingNames.ContainsKey($name)) { $skipped++; continue }

    $imageUrl = "/images/plats/" + [System.Uri]::EscapeDataString($p.file)
    $catId = $catMap[$p.cat]
    if (-not $catId) { $catId = $null }

    $bodyObj = @{
        nom = $name
        image_url = $imageUrl
        categorie_id = $catId
        statut = "disponible"
        afficher_prix = $false
        mis_en_avant = $false
        ordre = $inserted + 1
    }
    $bodyJson = $bodyObj | ConvertTo-Json -Compress

    $result = & curl.exe -s -w "|%{http_code}" -X POST "$BASE/plats" -H "apikey: $SRK" -H "Authorization: Bearer $SRK" -H "Content-Type: application/json" -H "Prefer: return=minimal" -d $bodyJson
    $httpCode = ($result -split '\|')[-1]
    
    if ($httpCode -eq "201" -or $httpCode -eq "200") {
        $inserted++
    } else {
        Write-Output "ERROR [$httpCode]: $name -> $result"
    }
    
    if ($inserted % 10 -eq 0 -and $inserted -gt 0) { Write-Output "Inserted $inserted..." }
}

Write-Output "`nDone! Inserted: $inserted, Skipped: $skipped"
