import { NextResponse } from "next/server"
import { createPortalSession } from "@/lib/stripe/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { organizationId } = await req.json()

    if (!organizationId) {
      return NextResponse.json(
        { error: "Missing organization ID" },
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

    if (error || !organization.stripe_customer_id) {
      return NextResponse.json(
        { error: "No Stripe customer found" },
        { status: 400 }
      )
    }

    // Create Stripe portal session
    const session = await createPortalSession(
      organization.stripe_customer_id,
      `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`
    )

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
