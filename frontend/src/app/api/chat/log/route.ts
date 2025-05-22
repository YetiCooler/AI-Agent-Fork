import { ChatRepo } from "@/lib/database/chatrepo";
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    if (!sessionId) {
        return Response.json({ success: false, message: "Session ID is required" }, { status: 400 });
    }
    try {
        const chats: any = await ChatRepo.findLogByEmail(session.user?.email as string, sessionId);
        if (!chats || !chats[0].session) {
            return Response.json({ success: false, message: "No chats found" }, { status: 404 });
        }
        
        return Response.json({ success: true, data: chats[0].session[0].chats });
    } catch (error) {
        console.error(error);
        return Response.json({ success: false, message: "Failed to fetch chats" }, { status: 500 });
    }
}