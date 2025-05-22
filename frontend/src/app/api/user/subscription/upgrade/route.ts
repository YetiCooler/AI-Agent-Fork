import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { UserRepo } from "@/lib/database/userrepo";
import { PlanRepo } from "@/lib/database/planRepo";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
});

export async function POST(request: NextRequest) {
    const { planId } = await request.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const profile = await UserRepo.findByEmail(user?.email as string);
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const plan = await PlanRepo.findById(planId);
    if (!plan) {
        return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }
    if (profile.currentplan === planId) {
        return NextResponse.json({ error: "User already on this plan" }, { status: 400 });
    }

    try {
        // First retrieve the subscription to get the subscription item ID
        const subscription = await stripe.subscriptions.retrieve(profile.subscriptionId);
        const subscriptionItemId = subscription.items.data[0].id;

        // Update the subscription with the new price
        await stripe.subscriptions.update(profile.subscriptionId, {
            items: [{
                id: subscriptionItemId,
                price: plan.priceId
            }],
            proration_behavior: 'none',
            billing_cycle_anchor: 'now'
        });

        // Update user's current plan in database
        profile.requestPlanId = planId;
        await profile.save();

        return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (error) {
        console.error('Subscription update error:', error);
        return NextResponse.json(
            { error: "Failed to update subscription" },
            { status: 500 }
        );
    }
}
