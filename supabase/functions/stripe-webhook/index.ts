import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@13.0.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// n8n webhook URL for notifications (optional)
const N8N_WEBHOOK_URL = Deno.env.get("N8N_PAYMENT_WEBHOOK_URL");

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      const produtoId = session.metadata?.produto_id;
      const duracaoMeses = parseInt(session.metadata?.duracao_meses || "0");

      if (!userId || !produtoId) break;

      // Calculate access_end for one-time purchases
      const accessEnd =
        duracaoMeses > 0
          ? new Date(
              Date.now() + duracaoMeses * 30 * 24 * 60 * 60 * 1000
            ).toISOString()
          : null;

      // Create subscription record
      await supabase.from("assinaturas").insert({
        user_id: userId,
        produto_id: produtoId,
        stripe_subscription_id: session.subscription?.toString() || null,
        status: "active",
        access_start: new Date().toISOString(),
        access_end: accessEnd,
      });

      // Update profile plan type
      const { data: produto } = await supabase
        .from("produtos")
        .select("tipo")
        .eq("id", produtoId)
        .single();

      await supabase
        .from("profiles")
        .update({
          plano: produto?.tipo === "assinatura" ? "assinatura" : "avulso",
        })
        .eq("id", userId);

      // Notify n8n
      if (N8N_WEBHOOK_URL) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email, nome")
          .eq("id", userId)
          .single();

        await fetch(N8N_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_type: "checkout_completed",
            user_email: profile?.email,
            user_nome: profile?.nome,
            produto_nome: produto?.tipo,
          }),
        }).catch(() => {});
      }

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const { data: assinatura } = await supabase
        .from("assinaturas")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", subscription.id)
        .select("user_id")
        .single();

      if (assinatura) {
        // Check if user has any other active subscriptions
        const { count } = await supabase
          .from("assinaturas")
          .select("*", { count: "exact", head: true })
          .eq("user_id", assinatura.user_id)
          .eq("status", "active");

        if (!count || count === 0) {
          await supabase
            .from("profiles")
            .update({ plano: "gratuito" })
            .eq("id", assinatura.user_id);
        }
      }

      // Notify n8n
      if (N8N_WEBHOOK_URL) {
        await fetch(N8N_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_type: "subscription_canceled",
            subscription_id: subscription.id,
          }),
        }).catch(() => {});
      }

      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.subscription) {
        await supabase
          .from("assinaturas")
          .update({ status: "past_due" })
          .eq(
            "stripe_subscription_id",
            invoice.subscription.toString()
          );
      }

      // Notify n8n
      if (N8N_WEBHOOK_URL) {
        await fetch(N8N_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_type: "payment_failed",
            subscription_id: invoice.subscription?.toString(),
          }),
        }).catch(() => {});
      }

      break;
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
