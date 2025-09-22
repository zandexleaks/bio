import { NextResponse } from "next/server"
import { ListObjectsV2Command } from "@aws-sdk/client-s3"
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2-client"
import type { ImageData } from "@/types/image"

/**
 * Infers the content type of a file based on its extension.
 * NOTE: This is a workaround because `ListObjectsV2Command` does not return
 * the `ContentType` metadata for each object. A more robust solution would
 * involve storing metadata in a database.
 */
const getContentTypeFromKey = (key: string): string => {
  const extension = key.split(".").pop()?.toLowerCase()
  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg"
    case "png":
      return "image/png"
    case "gif":
      return "image/gif"
    case "webp":
      return "image/webp"
    case "mp4":
      return "video/mp4"
    case "webm":
      return "video/webm"
    default:
      return "application/octet-stream" // Fallback for unknown types
  }
}

export async function GET() {
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      MaxKeys: 100, // Limit to 100 items for now
    })

    const response = await r2Client.send(listCommand)

    if (!response.Contents) {
      return NextResponse.json([])
    }

    // Filter out folder-like objects, which in S3/R2 typically end with a '/'
    const media: ImageData[] = response.Contents
      .filter((obj) => obj.Key && !obj.Key.endsWith("/"))
      .map((obj) => ({
        id: obj.Key!, // Use the full key as the unique ID
        filename: obj.Key!,
        originalName: obj.Key!, // NOTE: Metadata not available from ListObjects, using filename as fallback.
        url: `${R2_PUBLIC_URL}/${obj.Key}`,
        uploadedAt: obj.LastModified?.toISOString() || new Date().toISOString(),
        size: obj.Size || 0,
        contentType: getContentTypeFromKey(obj.Key!),
      }))
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

    return NextResponse.json(media)
  } catch (error) {
    console.error("Error fetching media:", error)
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 })
  }
}
