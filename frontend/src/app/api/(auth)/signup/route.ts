import { NextRequest, NextResponse } from 'next/server';
import { UserRepo } from '@/lib/database/userrepo';

export async function POST(request: NextRequest) {
    const { email } = await request.json();
    const user = await UserRepo.findByEmail(email);
    if (user) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }
    await UserRepo.create({
        email,
        pointsUsed: 0,
        pointsResetDate: new Date(),
        currentplan: "680f11c0d44970f933ae5e54",
        disableModel: [],
        planStartDate: null,
        planEndDate: null,
        requestPlanId: null,
        subscriptionId: null,
        subscriptionStatus: null,
        stripeCustomerId: null
    });
    return NextResponse.json({ message: 'User created successfully' }, { status: 200 });
}