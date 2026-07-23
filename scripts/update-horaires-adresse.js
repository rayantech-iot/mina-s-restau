const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://pzmnobrszlifrdupdtsp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6bW5vYnJzemxpZnJkdXBkdHNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDM5NjYwMSwiZXhwIjoyMDk5OTcyNjAxfQ.l6SNSWayZF0eaSfO9jw7nlL5Z5_z5NXAQvrSk8r9SUI"
);

const horaires = {
  lundi: { ouverture: "08:00", fermeture: "13:30", ouverture2: "17:00", fermeture2: "20:30" },
  mardi: { ouverture: "08:00", fermeture: "13:30", ouverture2: "17:00", fermeture2: "20:30" },
  mercredi: { ouverture: "08:00", fermeture: "13:30", ouverture2: "17:00", fermeture2: "20:30" },
  jeudi: { ouverture: "08:00", fermeture: "13:30", ouverture2: "17:00", fermeture2: "20:30" },
  vendredi: { ouverture: "08:00", fermeture: "13:30", ouverture2: "17:00", fermeture2: "20:30" },
  samedi: { ouverture: "08:00", fermeture: "13:30", ouverture2: "17:00", fermeture2: "20:30" },
  dimanche: { ouverture: "08:00", fermeture: "13:30", ouverture2: "17:00", fermeture2: "20:30" },
};

async function main() {
  const { error: hErr } = await supabase
    .from("reglages")
    .update({ horaires })
    .eq("id", "00000000-0000-0000-0000-000000000001");
  if (hErr) console.error("Horaires error:", hErr);
  else console.log("Horaires updated: all days 8h00-13h30 / 17h00-20h30");

  const { error: aErr } = await supabase
    .from("reglages")
    .update({
      adresse: "Route de Cirindinu, 20144 Sainte-Lucie-de-Porto-Vecchio",
      google_maps_url: "https://www.google.com/maps?q=41.659103,9.362065",
    })
    .eq("id", "00000000-0000-0000-0000-000000000001");
  if (aErr) console.error("Adresse error:", aErr);
  else console.log("Adresse + Google Maps URL updated");
}

main();
