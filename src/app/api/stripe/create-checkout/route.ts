import { NextResponse } from "next/server"
import { createCheckoutSession } from "@/lib/stripe/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { priceId, organizationId } = await req.json()

    if (!priceId || !organizationId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Get organization
    const { data: organization, error } = await supabase
      .from("organizations")
      .select("stripe_customer_id")
      .eq("id", organizationId)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      customerId: organization.stripe_customer_id,
      priceId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/workspace?success=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=true`,
      metadata: {
        organization_id: organizationId,
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
