import { NextResponse } from "next/server";
import { cloudinary, CLOUDINARY_UPLOAD_FOLDER, getCloudinaryEnv } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/session";

export async function POST() {
  try {
    await requireAdmin();

    const { cloudName, apiKey, apiSecret } = getCloudinaryEnv();

    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = { timestamp, folder: CLOUDINARY_UPLOAD_FOLDER };
    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

    return NextResponse.json({
      cloudName,
      apiKey,
      timestamp,
      signature,
      folder: CLOUDINARY_UPLOAD_FOLDER,
    });
  } catch (error) {
    console.error("Cloudinary upload authorization failed:", error);
    const message = error instanceof Error ? error.message : "Upload authorization failed";
    const status = message.startsWith("Unauthorized") ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
