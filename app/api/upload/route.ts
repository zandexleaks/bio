import { type NextRequest, NextResponse } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2-client"
import { validateUploadKey, generateImageId } from "@/lib/auth"
import type { ImageData } from "@/types/image"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const uploadKey = formData.get("key") as string

    // Validate upload key
    if (!validateUploadKey(uploadKey)) {
      return NextResponse.json({ error: "Invalid upload key" }, { status: 401 })
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/webm",
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images and videos (MP4, WebM) are allowed." },
        { status: 400 },
      )
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 50MB." }, { status: 400 })
    }

    const imageId = generateImageId()
    const fileExtension = file.name.split(".").pop()
    const filename = `${imageId}.${fileExtension}`

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload to R2
    const uploadCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
      Metadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    })

    await r2Client.send(uploadCommand)

    // Create image data
    const imageData: ImageData = {
      id: imageId,
      filename,
      originalName: file.name,
      url: `${R2_PUBLIC_URL}/${filename}`,
      uploadedAt: new Date().toISOString(),
      size: file.size,
      contentType: file.type,
    }

    // Store image metadata (in a real app, you'd use a database)
    // For now, we'll just return the data
    return NextResponse.json(imageData)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
