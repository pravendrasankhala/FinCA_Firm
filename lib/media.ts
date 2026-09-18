import { MediaType } from "@prisma/client";

export function mediaTypeFromMime(mimeType: string): MediaType {
  if (mimeType.startsWith("image/")) return MediaType.IMAGE;
  if (mimeType.startsWith("video/")) return MediaType.VIDEO;
  return MediaType.PDF;
}
