import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const url = new URL(req.url);
  // Vérification Webhook pour Meta
  if (req.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    if (mode === "subscribe" && token === "repondia_secret_123") {
      return new Response(challenge, { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const body = await req.json();
    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!message) return new Response("No message", { status: 200 });

    const customerPhone = message.from;
    const userText = message.text.body;

    // Appel à l'API Gemini
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Tu es un assistant de réservation. Extrais les informations suivantes au format JSON uniquement : 
            {"name": "nom", "date": "YYYY-MM-DD", "guests": nombre}. 
            Si une info manque, mets "null". 
            Texte du client : "${userText}"`
          }]
        }]
      })
    });

    const result = await response.json();
    const aiText = result.candidates[0].content.parts[0].text;
    const args = JSON.parse(aiText.replace(/```json|```/g, ""));

    // Connexion Supabase
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    if (args.name && args.date && args.guests) {
      await supabase.from('reservations').insert({
        customer_name: args.name,
        customer_phone: customerPhone,
        reservation_date: args.date,
        guests_count: args.guests,
        status: 'pending'
      });
    }

    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response("Error", { status: 500 });
  }
});
