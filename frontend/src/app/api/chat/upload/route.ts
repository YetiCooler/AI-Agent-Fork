import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/server/storage";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const formData = await req.formData();
    try {
        const formDataEntryValues = Array.from(formData.values());
        const files = formDataEntryValues.filter(value => value instanceof File);
        const fileUrl = await Promise.all(files.map(async (file) => {
            try {
                const fileBuffer = await file.arrayBuffer();
                const fileName = `${Date.now()}-${file.name}`;
                const fileUrl = await uploadFile(fileBuffer, fileName);
                return fileUrl;
            } catch (error) {
                console.error("Error uploading file:", error);
                return null;
            }
        }));

        const fileUrls = fileUrl.filter(url => url !== null);
        if (fileUrls.length === 0) {
            return NextResponse.json({ success: false, error: "Failed to upload files" });
        }
        return NextResponse.json({ success: true, fileUrl });
    } catch (error) {
        return NextResponse.json({ success: false, error: error });
    }
}