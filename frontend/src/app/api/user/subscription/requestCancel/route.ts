import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UserRepo } from "@/lib/database/userrepo";

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await UserRepo.findByEmail(user?.email as string);
    if (!profile) return NextResponse.json({ error: "User not found" }, { status: 404 });

    profile.requestPlanId = null;
    await profile.save();

    return NextResponse.json({ success: true, user }, { status: 200 });
}

