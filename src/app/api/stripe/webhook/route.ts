import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { constructWebhookEvent } from "@/lib/stripe/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature") as string

  let event: any

  try {
    event = await constructWebhookEvent(body, signature)
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  const supabase = createClient()

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object
      const organizationId = session.metadata?.organization_id

      if (session.mode === "subscription" && organizationId) {
        // Update organization with subscription info
        await supabase
          .from("organizations")
          .update({
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            subscription_status: "active",
          })
          .eq("id", organizationId)
      }
      break
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object
      
      // Update organization subscription status
      await supabase
        .from("organizations")
        .update({
          subscription_status: subscription.status,
        })
        .eq("stripe_subscription_id", subscription.id)
      break
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object
      
      // Update organization subscription status
      await supabase
        .from("organizations")
        .update({
          subscription_status: "canceled",
          subscription_tier: "free",
        })
        .eq("stripe_subscription_id", subscription.id)
      break
    }

    case "invoice.paid": {
      const invoice = event.data.object
      // Handle successful payment
      break
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object
      
      // Update subscription status to past_due
      if (invoice.subscription) {
        await supabase
          .from("organizations")
          .update({
            subscription_status: "past_due",
          })
          .eq("stripe_subscription_id", invoice.subscription as string)
      }
      break
    }

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
