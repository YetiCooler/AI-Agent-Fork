import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";
import { UserRepo } from "@/lib/database/userrepo";
import { PlanRepo } from "@/lib/database/planRepo";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
});

export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const profile = await UserRepo.findByEmail(user?.email as string);
    if (!profile) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const { planId } = await request.json();
    const plan = await PlanRepo.findById(planId);
    if (!plan) {
        return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    if (profile.currentplan === planId) {
        return NextResponse.json({ error: "User already on this plan" }, { status: 400 });
    }

    // Check if current plan has ended
    const isCurrentPlanEnded = profile.planEndDate && new Date(profile.planEndDate).getTime() < new Date().getTime();

    if (!isCurrentPlanEnded) {
        return NextResponse.json({ error: "Current plan has not ended" }, { status: 400 });
    }

    // Handle free plan (price = 0)
    if (plan.price === 0) {
        // If user has an active subscription, cancel it
        if (profile.subscriptionId) {
            const subscription = await stripe.subscriptions.retrieve(profile.subscriptionId);
            try {
                await stripe.subscriptions.cancel(profile.subscriptionId);
            } catch (error) {
                console.error('Error canceling subscription:', error);
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });
    }

    // Handle paid plan
    const subscription = await stripe.subscriptions.retrieve(profile.subscriptionId);
    const subscriptionItemId = subscription.items.data[0].id;
    await stripe.subscriptions.update(profile.subscriptionId, {
        items: [{ id: subscriptionItemId, price: plan.priceId }],
        proration_behavior: 'none',
        billing_cycle_anchor: 'now'
    });

    profile.requestPlanId = planId;
    await profile.save();

    return NextResponse.json({
        success: true,
        user
    }, { status: 200 });

    // Update existing subscription
    // const subscription = await stripe.subscriptions.retrieve(user.subscriptionId);
    // if (!subscription) {
    //     return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    // }

    // await stripe.subscriptions.update(user.subscriptionId, {
    //     items: [{ id: user.subscriptionId, price: plan.priceId }],
    //     proration_behavior: 'always_invoice',
    //     billing_cycle_anchor: 'now'
    // });

    // return NextResponse.json({ success: true }, { status: 200 });
}
