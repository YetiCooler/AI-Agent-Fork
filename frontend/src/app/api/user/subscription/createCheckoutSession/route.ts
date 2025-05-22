import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";
import { UserRepo } from "@/lib/database/userrepo";
import { PlanRepo } from "@/lib/database/planRepo";
import db from "@/lib/database/db";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const profile = await UserRepo.findByEmail(user?.email as string);
    if (!profile) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const { planId } = await request.json();
    const plan = await PlanRepo.findById(planId);
    if (!plan) {
        return NextResponse.json({ success: false, error: "Plan not found" }, { status: 404 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    let customerId = profile.stripeCustomerId;
    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.email as string,
        });
        customerId = customer.id;
        await UserRepo.updateUserStripeInfo(profile.email as string, customerId);
    }
    const stripeSession = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [{ price: plan.priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `${process.env.NEXTAUTH_URL}/subscription?success=true`,
        cancel_url: `${process.env.NEXTAUTH_URL}/subscription?canceled=true`,
        metadata: {
            userId: profile._id.toString(),
            planId: plan._id.toString(),
        },
    });
    
    await db.User.updateOne(
        { email: profile.email },
        { $set: { requestPlanId: planId } }
    );

    return NextResponse.json({ success: true, url: stripeSession.url }, { status: 200 });
}