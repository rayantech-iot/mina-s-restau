import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom, telephone, email, type_occasion, date_souhaitee, nb_convives, lieu, preferences, allergies, message } = body;

    if (!nom || !telephone || !email || !type_occasion || !date_souhaitee || !nb_convives) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("demandes_devis")
      .insert({
        nom,
        telephone,
        email,
        type_occasion,
        date_souhaitee,
        nb_convives: parseInt(nb_convives),
        lieu: lieu || "",
        preferences: preferences || null,
        allergies: allergies || null,
        message: message || null,
        statut: "nouveau",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send email notification if configured
    try {
      const { data: reglages } = await supabase
        .from("reglages")
        .select("email_notification")
        .limit(1)
        .single();

      const emailConfig = reglages?.email_notification;
      if (emailConfig?.enabled && emailConfig?.email && emailConfig?.smtp_host) {
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.createTransport({
          host: emailConfig.smtp_host,
          port: emailConfig.smtp_port || 587,
          secure: false,
          auth: {
            user: emailConfig.smtp_user,
            pass: emailConfig.smtp_pass,
          },
        });

        await transporter.sendMail({
          from: `"A Cas'a Mina" <${emailConfig.smtp_user}>`,
          to: emailConfig.email,
          subject: `Nouvelle demande de devis - ${nom}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1E355B;">Nouvelle demande de devis</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px; font-weight: bold; color: #1E355B;">Nom:</td><td style="padding: 8px;">${nom}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold; color: #1E355B;">Telephone:</td><td style="padding: 8px;">${telephone}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold; color: #1E355B;">Email:</td><td style="padding: 8px;">${email}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold; color: #1E355B;">Occasion:</td><td style="padding: 8px;">${type_occasion}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold; color: #1E355B;">Date:</td><td style="padding: 8px;">${date_souhaitee}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold; color: #1E355B;">Convives:</td><td style="padding: 8px;">${nb_convives}</td></tr>
                ${lieu ? `<tr><td style="padding: 8px; font-weight: bold; color: #1E355B;">Lieu:</td><td style="padding: 8px;">${lieu}</td></tr>` : ""}
                ${preferences ? `<tr><td style="padding: 8px; font-weight: bold; color: #1E355B;">Preferences:</td><td style="padding: 8px;">${preferences}</td></tr>` : ""}
                ${allergies ? `<tr><td style="padding: 8px; font-weight: bold; color: #1E355B;">Allergies:</td><td style="padding: 8px;">${allergies}</td></tr>` : ""}
                ${message ? `<tr><td style="padding: 8px; font-weight: bold; color: #1E355B;">Message:</td><td style="padding: 8px;">${message}</td></tr>` : ""}
              </table>
              <p style="margin-top: 16px;">
                <a href="https://a-casa-mina.vercel.app/admin/demandes" style="background-color: #1E355B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 20px;">
                  Voir dans l&apos;admin
                </a>
              </p>
            </div>
          `,
        });
      }
    } catch (emailErr) {
      console.error("Email notification failed:", emailErr);
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
