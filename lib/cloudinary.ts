import "server-only";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const CLOUDINARY_UPLOAD_FOLDER = "cms-uploads";

export function getCloudinaryEnv() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Missing Cloudinary configuration. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }

  return { cloudName, apiKey, apiSecret };
}

/**
 * Cloudinary's delete API needs a `public_id` + `resource_type`, not the asset URL.
 * Both are recoverable from the URL shape Cloudinary always returns:
 * https://res.cloudinary.com/<cloud>/<resource_type>/upload/[transforms/]v<version>/<public_id>.<ext>
 */
export function parseCloudinaryUrl(url: string): { publicId: string; resourceType: string } | null {
  try {
    const { pathname } = new URL(url);
    const parts = pathname.split("/").filter(Boolean);
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex < 1) return null;

    const resourceType = parts[uploadIndex - 1];
    let rest = parts.slice(uploadIndex + 1);
    if (rest[0] && /^v\d+$/.test(rest[0])) {
      rest = rest.slice(1);
    }
    if (rest.length === 0) return null;

    const last = rest[rest.length - 1];
    const dotIndex = last.lastIndexOf(".");
    const lastWithoutExt = dotIndex > 0 ? last.slice(0, dotIndex) : last;
    const publicId = [...rest.slice(0, -1), lastWithoutExt].join("/");

    return { publicId, resourceType };
  } catch {
    return null;
  }
}

export { cloudinary };
