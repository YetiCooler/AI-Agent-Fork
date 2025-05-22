import { NextRequest } from "next/server";
import { UserRepo } from "@/lib/database/userrepo";
import { createClient } from "@/lib/supabase/server";

// export async function PUT(request: NextRequest) {
//     const { name, avatar, wallet, workerPoints, isNodeConnected, isNodeAdded } = await request.json();
//     const supabase = await createClient();
//     const { data: { user } } = await supabase.auth.getUser();

//     // Verify reCAPTCHA
//     // const recaptchaToken = getRecaptchaTokenFromRequest(request);
//     // if (!recaptchaToken) {
//     //     return Response.json({ success: false, message: "reCAPTCHA token is required" });
//     // }

//     // const isValidRecaptcha = await verifyRecaptcha(recaptchaToken);
//     // if (!isValidRecaptcha) {
//     //     return Response.json({ success: false, message: "reCAPTCHA verification failed" });
//     // }

//     const profile = await UserRepo.findByEmail(user?.email as string);
//     if (!profile) {
//         return Response.json({ success: false, message: "User not found" });
//     }

//     try {

//         const isExist = await UserRepo.findByWalletWithoutUser(wallet, session?.user?.email as string);
//         if (isExist && user.wallet !== wallet) {
//             return Response.json({ success: false, message: "Wallet already exists" });
//         }
//         // }
//         await UserRepo.updateUserProfileWithEmail(user.email, user.name, user.avatar, user.wallet, user.chatPoints ?? 0, user.workerPoints ?? 0, user.isNodeConnected, user.isNodeAdded);
//         return Response.json({ success: true, message: "User updated", user: user });
//     } catch (error) {   
//         console.error(error);
//         return Response.json({ success: false, message: "User update failed" });
//     }
// }

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
        return Response.json({ success: false, message: "User not found" });
    }
    try {
        const profile = await UserRepo.findByEmail(user?.email as string);
        if (!profile) {
            return Response.json({ success: false, message: "User not found" });
        }
        // const chatHistory = await ChatRepo.findHistoryByEmail(user.email);
        // if (chatHistory) {
        //     user.chatPoints = getChatPoints(chatHistory.session);
        // }
        // await UserRepo.updateUserProfileWithEmail(user.email, user.name, user.avatar, user.wallet, user.chatPoints ?? 0, user.workerPoints ?? 0, user.isNodeConnected ?? false, user.isNodeAdded ?? false);
        return Response.json({ success: true, user: profile });
    } catch (error) {
        console.error(error);
        return Response.json({ success: false, message: "User fetch failed" });
    }
}
